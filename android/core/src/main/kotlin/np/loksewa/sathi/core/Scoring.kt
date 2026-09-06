package np.loksewa.sathi.core

import kotlin.math.max
import kotlin.math.roundToInt

/** How a paper is marked. `negativePerWrong` of 0.0 means no negative marking. */
data class MarkingScheme(
    val marksPerQuestion: Int = 1,
    val negativePerWrong: Double = 0.0,
) {
    companion object {
        val NO_PENALTY = MarkingScheme()
        fun of(mock: MockPattern) = MarkingScheme(mock.marksPerQuestion, mock.negativePerWrong)
    }
}

data class AttemptSummary(
    val correct: Int,
    val wrong: Int,
    val skipped: Int,
    /** Marks earned after any negative marking, never below zero. */
    val score: Double,
    val maxScore: Int,
    /** Percentage of maxScore, rounded to a whole number. */
    val percent: Int,
    /** Correct answers as a percentage of questions actually attempted. */
    val accuracy: Int,
)

/**
 * Score an attempt. `answers[i]` is the chosen option index for `questions[i]`,
 * or null when the question was left blank. Blank answers never attract a
 * penalty, which matches the Public Service Commission's practice, and the
 * total is floored at zero so a bad run never shows a negative score.
 *
 * A short `answers` list leaves the remaining questions counted as skipped.
 */
fun scoreAttempt(
    answers: List<Int?>,
    questions: List<Question>,
    scheme: MarkingScheme = MarkingScheme.NO_PENALTY,
): AttemptSummary {
    var correct = 0
    var wrong = 0
    var skipped = 0

    questions.forEachIndexed { i, question ->
        when (answers.getOrNull(i)) {
            null -> skipped++
            question.answer -> correct++
            else -> wrong++
        }
    }

    val raw = correct * scheme.marksPerQuestion - wrong * scheme.negativePerWrong
    val score = max(0.0, (raw * 100).roundToInt() / 100.0)
    val maxScore = questions.size * scheme.marksPerQuestion
    val attempted = correct + wrong

    return AttemptSummary(
        correct = correct,
        wrong = wrong,
        skipped = skipped,
        score = score,
        maxScore = maxScore,
        percent = if (maxScore > 0) (score / maxScore * 100).roundToInt() else 0,
        accuracy = if (attempted > 0) (correct.toDouble() / attempted * 100).roundToInt() else 0,
    )
}

/** mm:ss for a duration in seconds. */
fun formatClock(totalSeconds: Int): String {
    val safe = max(0, totalSeconds)
    return "%02d:%02d".format(safe / 60, safe % 60)
}

private val NE_DIGITS = charArrayOf('०', '१', '२', '३', '४', '५', '६', '७', '८', '९')

/** Render ASCII digits as Devanagari numerals when the interface is in Nepali. */
fun localiseNumber(value: String, lang: Lang): String =
    if (lang != Lang.NE) value
    else buildString { value.forEach { append(if (it in '0'..'9') NE_DIGITS[it - '0'] else it) } }

fun localiseNumber(value: Int, lang: Lang): String = localiseNumber(value.toString(), lang)
