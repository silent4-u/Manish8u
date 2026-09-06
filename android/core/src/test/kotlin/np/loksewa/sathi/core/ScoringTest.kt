package np.loksewa.sathi.core

import kotlin.test.Test
import kotlin.test.assertEquals

/**
 * Mirrors scripts/test-scoring.ts in the web app. Both clients must mark a
 * paper identically, so these cases are kept in step deliberately.
 */
class ScoringTest {

    /** Five questions whose correct answer is always index 0. */
    private val questions = (0 until 5).map { i ->
        Question(
            id = "t$i",
            subjectId = "gk-nepal",
            levels = listOf("kharidar"),
            difficulty = "easy",
            prompt = Bilingual("q", "q"),
            options = listOf(
                Bilingual("a", "a"), Bilingual("b", "b"),
                Bilingual("c", "c"), Bilingual("d", "d"),
            ),
            answer = 0,
            explanation = Bilingual("e", "e"),
        )
    }

    private val noPenalty = MarkingScheme(marksPerQuestion = 1, negativePerWrong = 0.0)
    private val kharidar = MarkingScheme(marksPerQuestion = 2, negativePerWrong = 0.4)

    @Test
    fun `all correct with no penalty`() {
        val s = scoreAttempt(listOf(0, 0, 0, 0, 0), questions, noPenalty)
        assertEquals(AttemptSummary(5, 0, 0, 5.0, 5, 100, 100), s)
    }

    @Test
    fun `all blank counts as skipped not wrong`() {
        val s = scoreAttempt(listOf(null, null, null, null, null), questions, noPenalty)
        assertEquals(AttemptSummary(0, 0, 5, 0.0, 5, 0, 0), s)
    }

    @Test
    fun `mixed answers with no penalty`() {
        val s = scoreAttempt(listOf(0, 1, 0, null, 2), questions, noPenalty)
        assertEquals(AttemptSummary(2, 2, 1, 2.0, 5, 40, 50), s)
    }

    @Test
    fun `kharidar scheme three right two wrong`() {
        // 3 x 2 marks = 6, minus 2 x 0.4 = 0.8, leaves 5.2 out of 10.
        val s = scoreAttempt(listOf(0, 0, 0, 1, 1), questions, kharidar)
        assertEquals(AttemptSummary(3, 2, 0, 5.2, 10, 52, 60), s)
    }

    @Test
    fun `blanks are not penalised`() {
        val s = scoreAttempt(listOf(0, 0, 0, null, null), questions, kharidar)
        assertEquals(AttemptSummary(3, 0, 2, 6.0, 10, 60, 100), s)
    }

    @Test
    fun `score is floored at zero never negative`() {
        val s = scoreAttempt(listOf(1, 1, 1, 1, 1), questions, kharidar)
        assertEquals(AttemptSummary(0, 5, 0, 0.0, 10, 0, 0), s)
    }

    @Test
    fun `accuracy ignores skipped questions`() {
        val s = scoreAttempt(listOf(0, null, null, null, null), questions, noPenalty)
        assertEquals(AttemptSummary(1, 0, 4, 1.0, 5, 20, 100), s)
    }

    @Test
    fun `shorter answer list leaves the rest skipped`() {
        val s = scoreAttempt(listOf(0), questions, noPenalty)
        assertEquals(AttemptSummary(1, 0, 4, 1.0, 5, 20, 100), s)
    }

    @Test
    fun `empty paper does not divide by zero`() {
        val s = scoreAttempt(emptyList(), emptyList(), noPenalty)
        assertEquals(AttemptSummary(0, 0, 0, 0.0, 0, 0, 0), s)
    }

    @Test
    fun `format clock`() {
        assertEquals("00:00", formatClock(0))
        assertEquals("00:45", formatClock(45))
        assertEquals("25:00", formatClock(1500))
        assertEquals("00:00", formatClock(-10))
    }

    @Test
    fun `devanagari numerals only in nepali`() {
        assertEquals("2072", localiseNumber(2072, Lang.EN))
        assertEquals("२०७२", localiseNumber(2072, Lang.NE))
        assertEquals("२५:००", localiseNumber("25:00", Lang.NE))
        assertEquals("८४%", localiseNumber("84%", Lang.NE))
    }
}
