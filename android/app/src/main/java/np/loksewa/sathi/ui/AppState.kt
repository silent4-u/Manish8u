package np.loksewa.sathi.ui

import android.content.Context
import androidx.appcompat.app.AppCompatDelegate
import androidx.compose.runtime.Composable
import androidx.compose.runtime.compositionLocalOf
import androidx.core.os.LocaleListCompat
import np.loksewa.sathi.core.Bilingual
import np.loksewa.sathi.core.ContentRepository
import np.loksewa.sathi.core.Lang
import np.loksewa.sathi.core.ProgressState
import np.loksewa.sathi.core.localiseNumber
import java.util.Locale

/**
 * Everything a screen needs: the corpus, the current language, saved progress
 * and the handful of actions that change them.
 */
class AppState(
    val repo: ContentRepository,
    val lang: Lang,
    val progress: ProgressState,
    val setLevel: (String) -> Unit,
    val setLang: (Lang) -> Unit,
    val update: ((ProgressState) -> ProgressState) -> Unit,
) {
    val level get() = progress.levelId?.let { repo.level(it) }

    /** Pick the active language out of a bilingual content value. */
    fun b(value: Bilingual): String = value[lang]

    /** Localise digits, so Nepali shows Devanagari numerals. */
    fun n(value: Int): String = localiseNumber(value, lang)
    fun n(value: String): String = localiseNumber(value, lang)
}

val LocalAppState = compositionLocalOf<AppState> { error("AppState not provided") }

@Composable
fun appState(): AppState = LocalAppState.current

/**
 * Switch the app's language using Android's per-app locale rather than a
 * private flag, so the system remembers it and the resource system resolves
 * values-ne automatically.
 */
fun applyLanguage(lang: Lang) {
    AppCompatDelegate.setApplicationLocales(LocaleListCompat.forLanguageTags(lang.tag))
}

/** The language currently in effect, falling back to the device locale. */
fun currentLanguage(context: Context): Lang {
    val applied = AppCompatDelegate.getApplicationLocales()
    val tag = when {
        !applied.isEmpty -> applied[0]?.language
        else -> context.resources.configuration.locales[0]?.language
    } ?: Locale.getDefault().language
    return Lang.fromTag(tag)
}
