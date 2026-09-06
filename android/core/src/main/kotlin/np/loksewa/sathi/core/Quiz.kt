package np.loksewa.sathi.core

enum class QuizMode { PRACTICE, MOCK }

/** How one option should be drawn, given the mode and whether the answer is out. */
enum class OptionState { NEUTRAL, CHOSEN, CORRECT, WRONG }

/**
 * A quiz in progress, as an immutable value with pure transitions.
 *
 * Practice reveals the answer the moment one is chosen and never runs a clock.
 * A mock test hides everything until submission and finishes itself when time
 * runs out. Keeping all of that here rather than in the interface means the
 * rules are unit-tested rather than only exercised by hand on a device.
 */
data class QuizSession(
    val questions: List<Question>,
    val mode: QuizMode,
    val scheme: MarkingScheme,
    val answers: List<Int?>,
    val index: Int = 0,
    /** Practice only: the answer to the current question is on show. */
    val revealed: Boolean = false,
    val finished: Boolean = false,
    /** Mock only; zero for practice. */
    val secondsLeft: Int = 0,
    val elapsed: Int = 0,
) {
    val isMock: Boolean get() = mode == QuizMode.MOCK
    val isEmpty: Boolean get() = questions.isEmpty()
    val current: Question? get() = questions.getOrNull(index)
    val isLast: Boolean get() = index == questions.lastIndex
    val answeredCount: Int get() = answers.count { it != null }
    val summary: AttemptSummary get() = scoreAttempt(answers, questions, scheme)

    /** Whether question [i] has been answered — drives the mock question palette. */
    fun isAnswered(i: Int): Boolean = answers.getOrNull(i) != null

    /**
     * Choose an option for the current question. In practice this also reveals
     * the answer; once revealed, further taps are ignored so a learner cannot
     * change their mind after seeing the result.
     */
    fun choose(option: Int): QuizSession {
        if (finished) return this
        if (mode == QuizMode.PRACTICE && revealed) return this
        val question = current ?: return this
        if (option !in question.options.indices) return this
        return copy(
            answers = answers.toMutableList().also { it[index] = option },
            revealed = mode == QuizMode.PRACTICE,
        )
    }

    fun goTo(target: Int): QuizSession {
        if (finished || target !in questions.indices) return this
        return copy(index = target, revealed = false)
    }

    fun next(): QuizSession = goTo(index + 1)

    fun previous(): QuizSession = goTo(index - 1)

    /** Skip without answering. On the last question this ends the quiz. */
    fun skip(): QuizSession = if (isLast) finish() else next()

    /**
     * Advance one second. A mock test that reaches zero finishes itself, so a
     * learner who walks away still gets their paper marked.
     */
    fun tick(): QuizSession {
        if (finished) return this
        val ticked = copy(elapsed = elapsed + 1, secondsLeft = if (isMock) secondsLeft - 1 else 0)
        return if (ticked.isMock && ticked.secondsLeft <= 0) ticked.copy(secondsLeft = 0).finish() else ticked
    }

    fun finish(): QuizSession = if (finished) this else copy(finished = true, revealed = true)

    /** How option [i] of the current question should be drawn. */
    fun optionState(i: Int): OptionState {
        val question = current ?: return OptionState.NEUTRAL
        val chosen = answers.getOrNull(index) == i
        // The answer is only exposed in practice, and only once revealed.
        val exposed = mode == QuizMode.PRACTICE && revealed
        return when {
            exposed && i == question.answer -> OptionState.CORRECT
            exposed && chosen -> OptionState.WRONG
            chosen -> OptionState.CHOSEN
            else -> OptionState.NEUTRAL
        }
    }

    /** Subject and correctness for each answered question; blanks are excluded. */
    fun answeredSubjects(): List<Pair<String, Boolean>> =
        questions.mapIndexedNotNull { i, question ->
            answers.getOrNull(i)?.let { question.subjectId to (it == question.answer) }
        }

    fun toRecord(levelId: String, subjectId: String?, now: Long): AttemptRecord {
        val s = summary
        return AttemptRecord(
            id = now.toString(),
            levelId = levelId,
            mode = if (isMock) "mock" else "practice",
            subjectId = subjectId,
            total = questions.size,
            correct = s.correct,
            wrong = s.wrong,
            skipped = s.skipped,
            score = s.score,
            maxScore = s.maxScore,
            seconds = elapsed,
            finishedAt = now,
        )
    }

    companion object {
        const val PRACTICE_SIZE = 10

        fun start(questions: List<Question>, mode: QuizMode, mock: MockPattern): QuizSession =
            QuizSession(
                questions = questions,
                mode = mode,
                scheme = if (mode == QuizMode.MOCK) MarkingScheme.of(mock) else MarkingScheme.NO_PENALTY,
                answers = List(questions.size) { null },
                secondsLeft = if (mode == QuizMode.MOCK) mock.durationMinutes * 60 else 0,
            )

        /** Draw a fresh shuffled paper for a level, sized for the mode. */
        fun paper(
            repo: ContentRepository,
            level: ExamLevel,
            subjectId: String?,
            mode: QuizMode,
        ): QuizSession {
            val count = if (mode == QuizMode.MOCK) level.mock.questionCount else PRACTICE_SIZE
            return start(repo.paperFor(level.id, subjectId, count), mode, level.mock)
        }
    }
}
