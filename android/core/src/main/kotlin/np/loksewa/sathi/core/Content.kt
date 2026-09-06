package np.loksewa.sathi.core

import kotlinx.serialization.DeserializationStrategy
import kotlinx.serialization.builtins.MapSerializer
import kotlinx.serialization.builtins.serializer
import kotlinx.serialization.json.Json
import java.io.InputStream

/**
 * The study corpus, parsed once from the JSON packaged with the module.
 *
 * The same resources are read by the JVM tests and by the Android app, so the
 * content cannot drift between them. Nothing here touches the Android
 * framework, which keeps the whole data layer unit-testable.
 */
class ContentRepository private constructor(
    val syllabusNote: Bilingual,
    val levels: List<ExamLevel>,
    val subjects: List<Subject>,
    val lessons: List<Lesson>,
    val questions: List<Question>,
    val affairsNote: Bilingual,
    val affairs: List<CurrentAffair>,
    private val strings: Map<Lang, Map<String, String>>,
) {
    private val levelIndex = levels.associateBy { it.id }
    private val subjectIndex = subjects.associateBy { it.id }
    private val lessonIndex = lessons.associateBy { it.id }
    private val questionIndex = questions.associateBy { it.id }

    fun level(id: String): ExamLevel? = levelIndex[id]
    fun subject(id: String): Subject? = subjectIndex[id]
    fun lesson(id: String): Lesson? = lessonIndex[id]
    fun question(id: String): Question? = questionIndex[id]

    /** Interface string by key, falling back to English then to the key itself. */
    fun string(key: String, lang: Lang): String =
        strings[lang]?.get(key) ?: strings[Lang.EN]?.get(key) ?: key

    fun subjectsFor(levelId: String): List<Subject> =
        subjects.filter { levelId in it.levels }

    fun lessonsFor(levelId: String, subjectId: String? = null): List<Lesson> =
        lessons.filter { levelId in it.levels && (subjectId == null || it.subjectId == subjectId) }

    fun questionsFor(levelId: String, subjectId: String? = null): List<Question> =
        questions.filter { levelId in it.levels && (subjectId == null || it.subjectId == subjectId) }

    fun affairsFor(levelId: String): List<CurrentAffair> =
        affairs.filter { levelId in it.levels }.sortedByDescending { it.date }

    /** A freshly shuffled paper of at most [count] questions. */
    fun paperFor(levelId: String, subjectId: String? = null, count: Int): List<Question> =
        questionsFor(levelId, subjectId).shuffled().take(count)

    companion object {
        private val json = Json { ignoreUnknownKeys = true }

        private val stringMap = MapSerializer(String.serializer(), String.serializer())

        /** Reads the JSON packaged under `content/` on the classpath. */
        fun load(open: (String) -> InputStream = ::classpathResource): ContentRepository {
            fun <T> parse(name: String, deserializer: DeserializationStrategy<T>): T =
                open(name).use { json.decodeFromString(deserializer, it.readBytes().decodeToString()) }

            val levelsFile = parse("levels.json", LevelsFile.serializer())
            val affairsFile = parse("affairs.json", AffairsFile.serializer())
            val stringsEn = parse("strings-en.json", stringMap)
            val stringsNe = parse("strings-ne.json", stringMap)

            return ContentRepository(
                syllabusNote = levelsFile.note,
                levels = levelsFile.levels,
                subjects = parse("subjects.json", SubjectsFile.serializer()).subjects,
                lessons = parse("lessons.json", LessonsFile.serializer()).lessons,
                questions = parse("questions.json", QuestionsFile.serializer()).questions,
                affairsNote = affairsFile.note,
                affairs = affairsFile.affairs,
                strings = mapOf(Lang.EN to stringsEn, Lang.NE to stringsNe),
            )
        }

        private fun classpathResource(name: String): InputStream =
            ContentRepository::class.java.getResourceAsStream("/content/$name")
                ?: error("Missing bundled content resource: content/$name")
    }
}
