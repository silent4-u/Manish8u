package np.loksewa.sathi.core

import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertTrue

/** The counts `npm run export:content` writes alongside the JSON it exports. */
@Serializable
private data class Manifest(val schemaVersion: Int, val counts: Map<String, Int>)

/**
 * Parses the real bundled corpus. These are the checks that would otherwise
 * only fail at runtime on a device, so they run on every build.
 */
class ContentTest {

    private val repo = ContentRepository.load()

    @Test
    fun `whole corpus parses with the expected counts`() {
        // Checked against the manifest the exporter writes rather than against
        // numbers typed here. A hardcoded count fails every time content grows,
        // which trains people to edit the test; comparing with the manifest
        // still catches the failure that matters — a bundle that is stale or
        // only partly parsed — and needs no editing when a question is added.
        val text = javaClass.getResourceAsStream("/content/manifest.json")
            ?.readBytes()?.decodeToString()
            ?: error("Missing bundled content resource: content/manifest.json")
        val manifest = Json { ignoreUnknownKeys = true }.decodeFromString(Manifest.serializer(), text)

        assertEquals(1, manifest.schemaVersion, "content schema version")
        assertEquals(manifest.counts["levels"], repo.levels.size, "levels")
        assertEquals(manifest.counts["subjects"], repo.subjects.size, "subjects")
        assertEquals(manifest.counts["lessons"], repo.lessons.size, "lessons")
        assertEquals(manifest.counts["questions"], repo.questions.size, "questions")
        assertEquals(manifest.counts["currentAffairs"], repo.affairs.size, "current affairs")

        // A corpus this far below its real size means a resource failed to load.
        assertTrue(repo.questions.size > 200, "question bank looks truncated")
        assertTrue(repo.lessons.size > 20, "lesson set looks truncated")
    }

    @Test
    fun `every question is well formed and bilingual`() {
        repo.questions.forEach { q ->
            assertTrue(q.prompt.en.isNotBlank() && q.prompt.ne.isNotBlank(), "${q.id}: prompt")
            assertTrue(q.explanation.en.isNotBlank() && q.explanation.ne.isNotBlank(), "${q.id}: explanation")
            assertEquals(4, q.options.size, "${q.id}: option count")
            q.options.forEach { o ->
                assertTrue(o.en.isNotBlank() && o.ne.isNotBlank(), "${q.id}: option language")
            }
            assertTrue(q.answer in q.options.indices, "${q.id}: answer index")
            assertNotNull(repo.subject(q.subjectId), "${q.id}: unknown subject ${q.subjectId}")
        }
    }

    @Test
    fun `every lesson has content and a known subject`() {
        repo.lessons.forEach { l ->
            assertTrue(l.blocks.isNotEmpty(), "${l.id}: no blocks")
            assertTrue(l.title.en.isNotBlank() && l.title.ne.isNotBlank(), "${l.id}: title")
            assertNotNull(repo.subject(l.subjectId), "${l.id}: unknown subject")
        }
    }

    @Test
    fun `every lesson block subtype round trips`() {
        val kinds = repo.lessons.flatMap { it.blocks }.map { it::class.simpleName }.toSet()
        // All six authored block types must deserialise into their sealed subclass.
        assertEquals(
            setOf("Heading", "Para", "Listing", "Facts", "Table", "Callout"),
            kinds,
        )
        repo.lessons.flatMap { it.blocks }.filterIsInstance<LessonBlock.Table>().forEach { t ->
            t.rows.forEach { row ->
                assertEquals(t.headers.size, row.size, "table row width")
            }
        }
    }

    @Test
    fun `each level has enough questions for its mock test`() {
        repo.levels.forEach { level ->
            val pool = repo.questionsFor(level.id)
            assertTrue(
                pool.size >= level.mock.questionCount,
                "${level.id}: pool ${pool.size} < mock ${level.mock.questionCount}",
            )
            assertTrue(repo.lessonsFor(level.id).isNotEmpty(), "${level.id}: no lessons")
        }
    }

    @Test
    fun `a generated paper is the right size and drawn from the level`() {
        val level = repo.level("kharidar")!!
        val paper = repo.paperFor(level.id, count = level.mock.questionCount)
        assertEquals(level.mock.questionCount, paper.size)
        assertEquals(paper.size, paper.map { it.id }.toSet().size, "no repeats")
        assertTrue(paper.all { level.id in it.levels }, "all drawn from this level")
    }

    @Test
    fun `interface strings resolve in both languages`() {
        listOf("appName", "navHome", "practiceQuiz", "fullMockTest").forEach { key ->
            assertTrue(repo.string(key, Lang.EN).isNotBlank(), "en:$key")
            assertTrue(repo.string(key, Lang.NE).isNotBlank(), "ne:$key")
        }
        // An unknown key degrades to the key rather than throwing on a device.
        assertEquals("nope", repo.string("nope", Lang.NE))
    }

    @Test
    fun `nepali content is genuinely devanagari not copied english`() {
        val devanagari = Regex("\\p{IsDevanagari}")
        val suspicious = repo.questions.filter { !devanagari.containsMatchIn(it.prompt.ne) }
        // Language questions legitimately quote English sentences in both fields.
        assertTrue(
            suspicious.all { it.subjectId == "english" },
            "non-Devanagari Nepali prompts outside the English subject: ${suspicious.map { it.id }}",
        )
    }

    @Test
    fun `syllabus papers are internally consistent`() {
        repo.levels.forEach { level ->
            level.papers.forEach { p ->
                assertTrue(p.passMarks <= p.fullMarks, "${p.id}: pass > full")
                assertTrue(p.sections.isNotEmpty(), "${p.id}: no sections")
                p.sections.forEach { s ->
                    s.subjectIds.forEach { id ->
                        assertNotNull(repo.subject(id), "${s.id}: unknown subject $id")
                    }
                }
            }
        }
    }

    @Test
    fun `an alternative version of a paper is worth the same as the paper`() {
        var seen = 0
        repo.levels.forEach { level ->
            level.papers.forEach { paper ->
                if (paper.variants.isNotEmpty()) {
                    assertNotNull(paper.appliesTo, "${paper.id}: has variants but does not say who its own sections are for")
                }
                paper.variants.forEach { variant ->
                    seen += 1
                    assertTrue(variant.sections.isNotEmpty(), "${variant.id}: no sections")
                    assertEquals(
                        paper.fullMarks,
                        variant.sections.sumOf { it.marks ?: 0 },
                        "${variant.id}: an alternative paper must be worth the same as the paper",
                    )
                    variant.sections.forEach { s ->
                        s.subjectIds.forEach { assertNotNull(repo.subject(it), "${s.id}: unknown subject $it") }
                    }
                }
            }
        }
        // The Section Officer's fourth paper differs for the Audit Service, so
        // a build that carries no variant at all has dropped the data.
        assertTrue(seen > 0, "no paper variants parsed from the bundle")
    }

    @Test
    fun `current affairs are filed by month, newest first`() {
        val grouped = repo.affairsByMonth("adhikrit")
        assertTrue(grouped.isNotEmpty(), "no months")
        val months = grouped.map { it.first }
        assertEquals(months.sortedDescending(), months, "months must run newest first")
        months.forEach { assertTrue(Regex("^\\d{4}-\\d{2}$").matches(it), "bad month key: $it") }
        grouped.forEach { (month, items) ->
            items.forEach { assertEquals(month, it.month, "${it.id} filed under the wrong month") }
        }
    }

    @Test
    fun `an unverified entry carries its sources and what to check`() {
        val unverified = repo.affairs.filter { !it.isVerified }
        unverified.forEach {
            assertTrue(it.sources.isNotEmpty(), "${it.id}: unverified with no source")
            assertNotNull(it.checkNote, "${it.id}: unverified with nothing to check")
            assertTrue(
                it.checkNote!!.en.isNotBlank() && it.checkNote!!.ne.isNotBlank(),
                "${it.id}: check note must be bilingual",
            )
        }
        // Status is a closed set; a typo would silently render as unverified.
        repo.affairs.forEach {
            assertTrue(it.status in setOf("verified", "unverified"), "${it.id}: status ${it.status}")
        }
    }
}
