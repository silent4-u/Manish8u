package np.loksewa.sathi.core

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertNull
import kotlin.test.assertTrue

class QuizTest {

    private fun questions(n: Int, subject: String = "iq") = (0 until n).map { i ->
        Question(
            id = "q$i", subjectId = subject, levels = listOf("kharidar"), difficulty = "easy",
            prompt = Bilingual("q$i", "q$i"),
            options = listOf(Bilingual("a", "a"), Bilingual("b", "b"), Bilingual("c", "c"), Bilingual("d", "d")),
            answer = 0, explanation = Bilingual("e", "e"),
        )
    }

    private val mock = MockPattern(
        questionCount = 3, durationMinutes = 1, marksPerQuestion = 2,
        negativePerWrong = 0.4, passPercent = 40,
    )

    private fun practice(n: Int = 3) = QuizSession.start(questions(n), QuizMode.PRACTICE, mock)
    private fun mockRun(n: Int = 3) = QuizSession.start(questions(n), QuizMode.MOCK, mock)

    // ---------------------------------------------------------- practice

    @Test
    fun `practice reveals the answer as soon as one is chosen`() {
        val s = practice().choose(1)
        assertTrue(s.revealed)
        assertEquals(OptionState.CORRECT, s.optionState(0))
        assertEquals(OptionState.WRONG, s.optionState(1))
        assertEquals(OptionState.NEUTRAL, s.optionState(2))
    }

    @Test
    fun `practice ignores a second choice once revealed`() {
        val s = practice().choose(1).choose(0)
        assertEquals(1, s.answers[0], "the first answer stands")
    }

    @Test
    fun `moving on hides the previous reveal`() {
        val s = practice().choose(0)
        assertTrue(s.revealed)
        assertFalse(s.next().revealed)
    }

    @Test
    fun `practice runs no clock`() {
        val s = practice().tick().tick()
        assertEquals(2, s.elapsed)
        assertEquals(0, s.secondsLeft)
        assertFalse(s.finished)
    }

    @Test
    fun `skipping the last question ends practice`() {
        val s = practice(2).skip()
        assertEquals(1, s.index)
        assertTrue(s.skip().finished)
    }

    // ---------------------------------------------------------- mock

    @Test
    fun `mock never exposes the answer before submission`() {
        val s = mockRun().choose(1)
        assertFalse(s.revealed)
        assertEquals(OptionState.CHOSEN, s.optionState(1))
        assertEquals(OptionState.NEUTRAL, s.optionState(0), "the correct option stays hidden")
    }

    @Test
    fun `mock lets an answer be changed`() {
        val s = mockRun().choose(1).choose(2)
        assertEquals(2, s.answers[0])
    }

    @Test
    fun `mock finishes itself when the clock runs out`() {
        var s = mockRun()
        assertEquals(60, s.secondsLeft)
        repeat(59) { s = s.tick() }
        assertFalse(s.finished)
        assertEquals(1, s.secondsLeft)
        s = s.tick()
        assertTrue(s.finished, "auto-submitted at zero")
        assertEquals(0, s.secondsLeft, "never counts below zero")
    }

    @Test
    fun `a finished session ignores further input`() {
        val done = mockRun().choose(1).finish()
        assertEquals(done, done.choose(2))
        assertEquals(done, done.next())
        assertEquals(done, done.tick())
    }

    // ---------------------------------------------------------- navigation

    @Test
    fun `navigation stays inside the paper`() {
        val s = practice(3)
        assertEquals(0, s.previous().index, "cannot go before the first")
        assertEquals(2, s.goTo(2).index)
        assertEquals(2, s.goTo(2).next().index, "cannot go past the last")
        assertEquals(0, s.goTo(-1).index)
        assertEquals(0, s.goTo(99).index)
    }

    @Test
    fun `an out of range option is ignored`() {
        val s = practice().choose(9)
        assertNull(s.answers[0])
        assertFalse(s.revealed)
    }

    @Test
    fun `answered count tracks the palette`() {
        val s = mockRun(3).choose(0).goTo(2).choose(1)
        assertEquals(2, s.answeredCount)
        assertTrue(s.isAnswered(0))
        assertFalse(s.isAnswered(1))
        assertTrue(s.isAnswered(2))
    }

    // ---------------------------------------------------------- results

    @Test
    fun `mock scoring applies negative marking`() {
        // Two right, one wrong: 4 marks less 0.4, out of 6.
        val s = mockRun(3).choose(0).next().choose(0).next().choose(1)
        assertEquals(3.6, s.summary.score)
        assertEquals(6, s.summary.maxScore)
    }

    @Test
    fun `only answered questions feed the subject stats`() {
        val s = mockRun(3).choose(0).goTo(2).choose(1)
        assertEquals(listOf("iq" to true, "iq" to false), s.answeredSubjects())
    }

    @Test
    fun `the record carries the elapsed time not the countdown`() {
        var s = mockRun(2).choose(0)
        repeat(5) { s = s.tick() }
        val record = s.finish().toRecord("kharidar", null, now = 1000L)
        assertEquals(5, record.seconds)
        assertEquals("mock", record.mode)
        assertEquals("kharidar", record.levelId)
        assertEquals(1, record.correct)
        assertEquals(1, record.skipped)
        assertEquals(1000L, record.finishedAt)
    }

    @Test
    fun `a practice record names its subject`() {
        val record = practice(1).choose(0).finish().toRecord("kharidar", "iq", now = 1L)
        assertEquals("practice", record.mode)
        assertEquals("iq", record.subjectId)
    }

    @Test
    fun `an empty paper is safe to hold`() {
        val s = QuizSession.start(emptyList(), QuizMode.PRACTICE, mock)
        assertTrue(s.isEmpty)
        assertNull(s.current)
        assertEquals(OptionState.NEUTRAL, s.optionState(0))
        assertEquals(s, s.choose(0))
        assertEquals(0, s.summary.maxScore)
    }

    @Test
    fun `a paper is drawn from the level at the right size`() {
        val repo = ContentRepository.load()
        val level = repo.level("kharidar")!!
        val m = QuizSession.paper(repo, level, null, QuizMode.MOCK)
        assertEquals(level.mock.questionCount, m.questions.size)
        assertEquals(level.mock.durationMinutes * 60, m.secondsLeft)
        assertTrue(m.questions.all { "kharidar" in it.levels })

        val p = QuizSession.paper(repo, level, "constitution", QuizMode.PRACTICE)
        assertEquals(QuizSession.PRACTICE_SIZE, p.questions.size)
        assertTrue(p.questions.all { it.subjectId == "constitution" })
        assertEquals(0, p.secondsLeft, "practice has no clock")
    }
}
