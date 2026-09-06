package np.loksewa.sathi.core

import kotlinx.serialization.Serializable

/** One finished quiz or mock test. */
@Serializable
data class AttemptRecord(
    val id: String,
    val levelId: String,
    /** "practice" or "mock". */
    val mode: String,
    val subjectId: String? = null,
    val total: Int,
    val correct: Int,
    val wrong: Int,
    val skipped: Int,
    val score: Double,
    val maxScore: Int,
    val seconds: Int,
    val finishedAt: Long,
) {
    val accuracy: Int
        get() = (correct + wrong).let { if (it > 0) (correct * 100.0 / it).toInt() else 0 }
}

@Serializable
data class SubjectStat(val attempted: Int = 0, val correct: Int = 0) {
    val accuracy: Int get() = if (attempted > 0) (correct * 100.0 / attempted).toInt() else 0
}

/**
 * Everything the app remembers between launches. Kept as an immutable value
 * with pure transitions so the rules are unit-testable, and so the Android
 * layer only has to persist and restore one serialisable object.
 */
@Serializable
data class ProgressState(
    val levelId: String? = null,
    val attempts: List<AttemptRecord> = emptyList(),
    val subjectStats: Map<String, SubjectStat> = emptyMap(),
    val savedQuestions: List<String> = emptyList(),
    val savedLessons: List<String> = emptyList(),
) {
    val questionsAttempted: Int get() = subjectStats.values.sumOf { it.attempted }
    val questionsCorrect: Int get() = subjectStats.values.sumOf { it.correct }
    val overallAccuracy: Int
        get() = questionsAttempted.let { if (it > 0) questionsCorrect * 100 / it else 0 }

    fun withLevel(id: String) = copy(levelId = id)

    /**
     * Record a finished attempt. Only answered questions move the per-subject
     * counters, so skipping a paper never dents the learner's accuracy.
     */
    fun withAttempt(
        record: AttemptRecord,
        answered: List<Pair<String, Boolean>>,
    ): ProgressState {
        val stats = subjectStats.toMutableMap()
        for ((subjectId, isCorrect) in answered) {
            val current = stats[subjectId] ?: SubjectStat()
            stats[subjectId] = SubjectStat(
                attempted = current.attempted + 1,
                correct = current.correct + if (isCorrect) 1 else 0,
            )
        }
        return copy(
            // Keep only the most recent attempts so stored state stays small.
            attempts = (listOf(record) + attempts).take(MAX_ATTEMPTS),
            subjectStats = stats,
        )
    }

    fun toggleSavedQuestion(id: String) = copy(
        savedQuestions = if (id in savedQuestions) savedQuestions - id else listOf(id) + savedQuestions,
    )

    fun toggleSavedLesson(id: String) = copy(
        savedLessons = if (id in savedLessons) savedLessons - id else listOf(id) + savedLessons,
    )

    fun cleared() = ProgressState(levelId = levelId)

    companion object {
        const val MAX_ATTEMPTS = 50
    }
}
