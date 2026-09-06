package np.loksewa.sathi.ui

object Routes {
    const val LEVELS = "levels"
    const val HOME = "home"
    const val SYLLABUS = "syllabus"
    const val STUDY = "study"
    const val SUBJECT = "study/{subjectId}"
    const val LESSON = "lesson/{lessonId}"
    const val PRACTICE = "practice"
    const val PRACTICE_QUIZ = "practice/{subjectId}"
    const val MOCK = "mock"
    const val MOCK_RUN = "mock/run"
    const val PROGRESS = "progress"
    const val SAVED = "saved"
    const val AFFAIRS = "affairs"

    fun subject(id: String) = "study/$id"
    fun lesson(id: String) = "lesson/$id"
    fun practiceQuiz(subjectId: String) = "practice/$subjectId"
}

/** The destinations shown in the bottom bar, in order. */
val BOTTOM_TABS = listOf(
    Triple(Routes.HOME, "🏠", "navHome"),
    Triple(Routes.SYLLABUS, "📜", "navSyllabus"),
    Triple(Routes.STUDY, "📚", "navStudy"),
    Triple(Routes.PRACTICE, "✍️", "navPractice"),
    Triple(Routes.MOCK, "⏱️", "navMock"),
    Triple(Routes.PROGRESS, "📊", "navProgress"),
)
