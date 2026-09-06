package np.loksewa.sathi.data

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.map
import kotlinx.serialization.json.Json
import np.loksewa.sathi.core.ProgressState
import java.io.IOException

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "progress")

/**
 * Persists [ProgressState] as one JSON blob. The state transitions themselves
 * live in the core module and are unit-tested; this only stores and restores.
 */
class ProgressStore(private val context: Context) {

    private val json = Json { ignoreUnknownKeys = true }
    private val key = stringPreferencesKey("state")

    val state: Flow<ProgressState> = context.dataStore.data
        .catch { cause ->
            // A corrupt or unreadable store must not stop the app from opening;
            // the learner loses history, not access to the material.
            if (cause is IOException) emit(androidx.datastore.preferences.core.emptyPreferences())
            else throw cause
        }
        .map { prefs ->
            prefs[key]?.let {
                runCatching { json.decodeFromString(ProgressState.serializer(), it) }.getOrNull()
            } ?: ProgressState()
        }

    suspend fun update(transform: (ProgressState) -> ProgressState) {
        context.dataStore.edit { prefs ->
            val current = prefs[key]
                ?.let { runCatching { json.decodeFromString(ProgressState.serializer(), it) }.getOrNull() }
                ?: ProgressState()
            prefs[key] = json.encodeToString(ProgressState.serializer(), transform(current))
        }
    }
}
