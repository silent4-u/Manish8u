package np.loksewa.sathi.core

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class ProgressTest {

    private fun attempt(id: String, correct: Int = 1, wrong: Int = 0) = AttemptRecord(
        id = id, levelId = "kharidar", mode = "practice", subjectId = "iq",
        total = correct + wrong, correct = correct, wrong = wrong, skipped = 0,
        score = correct.toDouble(), maxScore = correct + wrong, seconds = 30,
        finishedAt = 0L,
    )

    @Test
    fun `answered questions update per-subject stats`() {
        val state = ProgressState().withAttempt(
            attempt("a"),
            listOf("iq" to true, "iq" to false, "constitution" to true),
        )
        assertEquals(SubjectStat(attempted = 2, correct = 1), state.subjectStats["iq"])
        assertEquals(SubjectStat(attempted = 1, correct = 1), state.subjectStats["constitution"])
        assertEquals(50, state.subjectStats["iq"]!!.accuracy)
    }

    @Test
    fun `skipping a paper does not dent accuracy`() {
        // An attempt where nothing was answered contributes no subject counters.
        val state = ProgressState().withAttempt(attempt("a", correct = 0), emptyList())
        assertEquals(0, state.questionsAttempted)
        assertEquals(0, state.overallAccuracy)
        assertEquals(1, state.attempts.size, "the attempt is still recorded")
    }

    @Test
    fun `stats accumulate across attempts`() {
        val state = ProgressState()
            .withAttempt(attempt("a"), listOf("iq" to true, "iq" to true))
            .withAttempt(attempt("b"), listOf("iq" to false))
        assertEquals(SubjectStat(attempted = 3, correct = 2), state.subjectStats["iq"])
        assertEquals(66, state.overallAccuracy)
    }

    @Test
    fun `attempt history is capped and newest first`() {
        var state = ProgressState()
        repeat(60) { state = state.withAttempt(attempt("a$it"), listOf("iq" to true)) }
        assertEquals(ProgressState.MAX_ATTEMPTS, state.attempts.size)
        assertEquals("a59", state.attempts.first().id, "newest first")
        assertEquals(60, state.subjectStats["iq"]!!.attempted, "stats are not capped")
    }

    @Test
    fun `bookmarks toggle on and off`() {
        val on = ProgressState().toggleSavedQuestion("con-q01").toggleSavedLesson("con-01")
        assertTrue("con-q01" in on.savedQuestions)
        assertTrue("con-01" in on.savedLessons)
        val off = on.toggleSavedQuestion("con-q01")
        assertTrue("con-q01" !in off.savedQuestions)
        assertTrue("con-01" in off.savedLessons, "unrelated bookmark untouched")
    }

    @Test
    fun `clearing keeps the chosen level but drops everything else`() {
        val state = ProgressState()
            .withLevel("adhikrit")
            .withAttempt(attempt("a"), listOf("iq" to true))
            .toggleSavedQuestion("q1")
            .cleared()
        assertEquals("adhikrit", state.levelId)
        assertTrue(state.attempts.isEmpty() && state.subjectStats.isEmpty() && state.savedQuestions.isEmpty())
    }

    @Test
    fun `state survives a serialisation round trip`() {
        val original = ProgressState()
            .withLevel("nayabsubba")
            .withAttempt(attempt("a"), listOf("iq" to true))
            .toggleSavedLesson("gov-01")
        val json = kotlinx.serialization.json.Json
        val restored = json.decodeFromString(
            ProgressState.serializer(),
            json.encodeToString(ProgressState.serializer(), original),
        )
        assertEquals(original, restored)
    }
}
