package np.loksewa.sathi.core

import kotlinx.serialization.ExperimentalSerializationApi
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.JsonClassDiscriminator

/** Every piece of authored content carries both languages. */
@Serializable
data class Bilingual(val en: String, val ne: String) {
    operator fun get(lang: Lang): String = if (lang == Lang.NE) ne else en
}

enum class Lang(val tag: String) {
    EN("en"),
    NE("ne");

    companion object {
        fun fromTag(tag: String?): Lang = if (tag?.startsWith("ne") == true) NE else EN
    }
}

// ---------------------------------------------------------------- levels

@Serializable
data class MockPattern(
    val questionCount: Int,
    val durationMinutes: Int,
    val marksPerQuestion: Int,
    val negativePerWrong: Double,
    val passPercent: Int,
)

@Serializable
data class SyllabusSection(
    val id: String,
    val name: Bilingual,
    val marks: Int? = null,
    val subjectIds: List<String> = emptyList(),
    val topics: List<Bilingual> = emptyList(),
)

@Serializable
data class Paper(
    val id: String,
    val name: Bilingual,
    val fullMarks: Int,
    val passMarks: Int,
    val durationMinutes: Int,
    val format: String,
    val pattern: Bilingual,
    val sections: List<SyllabusSection> = emptyList(),
)

@Serializable
data class ExamLevel(
    val id: String,
    val name: Bilingual,
    val shortName: Bilingual,
    val grade: Bilingual,
    val summary: Bilingual,
    val accent: String,
    val icon: String,
    val minQualification: Bilingual,
    val papers: List<Paper> = emptyList(),
    val mock: MockPattern,
) {
    val totalMarks: Int get() = papers.sumOf { it.fullMarks }
}

@Serializable
data class LevelsFile(val note: Bilingual, val levels: List<ExamLevel>)

// ---------------------------------------------------------------- subjects

@Serializable
data class Subject(
    val id: String,
    val name: Bilingual,
    val short: Bilingual,
    val icon: String,
    val description: Bilingual,
    val levels: List<String> = emptyList(),
)

@Serializable
data class SubjectsFile(val subjects: List<Subject>)

// ---------------------------------------------------------------- lessons

@Serializable
data class FactItem(val label: Bilingual, val value: Bilingual)

/**
 * A lesson is a list of typed blocks rather than prose, so each client can
 * render tables, fact grids and callouts natively instead of parsing markup.
 */
@OptIn(ExperimentalSerializationApi::class)
@Serializable
@JsonClassDiscriminator("type")
sealed class LessonBlock {
    @Serializable
    @SerialName("heading")
    data class Heading(val text: Bilingual) : LessonBlock()

    @Serializable
    @SerialName("para")
    data class Para(val text: Bilingual) : LessonBlock()

    @Serializable
    @SerialName("list")
    data class Listing(val items: List<Bilingual>, val ordered: Boolean = false) : LessonBlock()

    @Serializable
    @SerialName("facts")
    data class Facts(val items: List<FactItem>) : LessonBlock()

    @Serializable
    @SerialName("table")
    data class Table(val headers: List<Bilingual>, val rows: List<List<Bilingual>>) : LessonBlock()

    @Serializable
    @SerialName("callout")
    data class Callout(val tone: String, val text: Bilingual) : LessonBlock()
}

@Serializable
data class Lesson(
    val id: String,
    val subjectId: String,
    val levels: List<String> = emptyList(),
    val title: Bilingual,
    val summary: Bilingual,
    val readMinutes: Int,
    val blocks: List<LessonBlock> = emptyList(),
)

@Serializable
data class LessonsFile(val lessons: List<Lesson>)

// ---------------------------------------------------------------- questions

@Serializable
data class Question(
    val id: String,
    val subjectId: String,
    val levels: List<String> = emptyList(),
    val difficulty: String,
    val prompt: Bilingual,
    val options: List<Bilingual> = emptyList(),
    val answer: Int,
    val explanation: Bilingual,
)

@Serializable
data class QuestionsFile(val questions: List<Question>)

// ---------------------------------------------------------------- affairs

@Serializable
data class CurrentAffair(
    val id: String,
    val date: String,
    val category: Bilingual,
    val title: Bilingual,
    val detail: Bilingual,
    val levels: List<String> = emptyList(),
)

@Serializable
data class AffairsFile(val note: Bilingual, val affairs: List<CurrentAffair>)
