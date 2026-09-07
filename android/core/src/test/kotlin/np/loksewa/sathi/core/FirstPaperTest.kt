package np.loksewa.sathi.core

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class FirstPaperTest {

    private val repo = ContentRepository.load()
    private val pooled = repo.firstPaperSubjects()

    @Test
    fun `every first-paper subject is pooled and resolvable`() {
        assertTrue(pooled.isNotEmpty())
        pooled.forEach {
            assertTrue(repo.subject(it.subjectId) != null, "${it.subjectId} is not a known subject")
            assertTrue(it.levels.isNotEmpty(), "${it.subjectId} belongs to no post")
            assertTrue(it.placements.isNotEmpty(), "${it.subjectId} sits in no section")
        }
    }

    @Test
    fun `subjects common to every post lead the list`() {
        val n = repo.levels.size
        val commonCount = pooled.count { it.isCommonToAll(n) }
        assertTrue(commonCount > 0, "nothing is common to all posts")
        // The common ones must all come before any that are not.
        val firstPartial = pooled.indexOfFirst { !it.isCommonToAll(n) }
        if (firstPartial >= 0) {
            pooled.drop(firstPartial).forEach {
                assertFalse(it.isCommonToAll(n), "${it.subjectId} sorted after a partial subject")
            }
        }
    }

    @Test
    fun `every post sits the same preliminary shape but a different subject`() {
        val nasu = repo.level("nayabsubba")!!.papers.first()
        val khar = repo.level("kharidar")!!.papers.first()
        // The two assistant posts share the mechanics of the screening test...
        assertEquals(100, nasu.fullMarks)
        assertEquals(100, khar.fullMarks)
        assertEquals(45, nasu.durationMinutes)
        assertEquals(45, khar.durationMinutes)
        assertEquals(45, nasu.passMarks, "screening test passes at 45 per cent")
        assertEquals(45, khar.passMarks, "screening test passes at 45 per cent")

        // ...but not what it examines. Nayab Subba sits General Mental Ability
        // and Kharidar sits Basic Office Skills, so the app must never present
        // the two first papers as one shared paper.
        assertTrue("General Mental Ability" in nasu.name.en, "Na. Su. paper I is a mental ability test")
        assertTrue("Basic Office Skills" in khar.name.en, "Kharidar paper I is an office skills test")
        assertTrue(
            nasu.sections.map { it.name.en } != khar.sections.map { it.name.en },
            "the two assistant first papers now share sections — rewrite the first-paper copy",
        )
    }

    @Test
    fun `the officer first paper is set differently`() {
        val officer = repo.level("adhikrit")!!.papers.first()
        val nasu = repo.level("nayabsubba")!!.papers.first()
        // If the commission ever makes these identical, this test should fail
        // and the interface copy about the difference must be rewritten.
        assertTrue(
            officer.pattern.en != nasu.pattern.en,
            "officer and assistant first papers now share a pattern — update the app's copy",
        )
        assertEquals(90, officer.durationMinutes, "officer preliminary runs 90 minutes")
        assertEquals(45, officer.passMarks, "officer preliminary passes at 45")
        assertEquals(45, nasu.durationMinutes)
        assertEquals(45, nasu.passMarks)

        // Both examine aptitude; only the officer paper tests English. The app's
        // copy about the difference is written against exactly this.
        val officerSubjects = officer.sections.flatMap { it.subjectIds }.toSet()
        val nasuSubjects = nasu.sections.flatMap { it.subjectIds }.toSet()
        assertTrue("iq" in officerSubjects, "officer paper has an aptitude section")
        assertTrue("iq" in nasuSubjects, "assistant paper has an intelligence section")
        assertTrue("english" in officerSubjects, "officer paper tests English")
        assertFalse("english" in nasuSubjects, "assistant paper does not test English separately")
    }

    @Test
    fun `every post now sits the unified three-stage system`() {
        // Officer 2082, Nayab Subba and Kharidar 2081: all three syllabi put a
        // screening preliminary in front of subjective main papers. If a post
        // ever drops back to a two-paper scheme this fails first.
        repo.levels.forEach { level ->
            val prelim = level.papers.first()
            assertEquals("objective", prelim.format, "${level.id} preliminary is objective")
            assertEquals(100, prelim.fullMarks, "${level.id} preliminary is out of 100")
            assertEquals(45, prelim.passMarks, "${level.id} preliminary passes at 45 per cent")
            assertTrue(level.papers.size >= 3, "${level.id} has a preliminary and at least two main papers")
            level.papers.drop(1).forEach { main ->
                assertEquals("subjective", main.format, "${level.id} main papers are written")
                assertEquals(100, main.fullMarks)
                assertEquals(40, main.passMarks)
            }
        }
    }

    @Test
    fun `each assistant main paper adds up to its full marks`() {
        // The section marks come straight off the syllabus tables, so a typo in
        // one of them shows up here rather than in a candidate's revision plan.
        listOf("nayabsubba", "kharidar").forEach { id ->
            repo.level(id)!!.papers.drop(1).forEach { paper ->
                assertEquals(
                    paper.fullMarks,
                    paper.sections.sumOf { it.marks ?: 0 },
                    "$id ${paper.id}: section marks do not total the paper",
                )
            }
        }
    }

    @Test
    fun `the officer sits four papers under the unified system`() {
        val officer = repo.level("adhikrit")!!
        assertEquals(4, officer.papers.size, "one preliminary and three main papers")
        assertEquals(400, officer.totalMarks, "100 preliminary plus 300 main")
        // Only the preliminary is objective; the three main papers are written.
        assertEquals("objective", officer.papers[0].format)
        officer.papers.drop(1).forEach {
            assertEquals("subjective", it.format)
            assertEquals(180, it.durationMinutes)
            assertEquals(100, it.fullMarks)
            assertEquals(40, it.passMarks)
        }
    }

    @Test
    fun `marks accumulate across every post that examines a subject`() {
        val gk = pooled.single { it.subjectId == "gk-nepal" }
        val expected = repo.levels.sumOf { level ->
            level.papers.first().sections
                .filter { "gk-nepal" in it.subjectIds }
                .sumOf { it.marks ?: 0 }
        }
        assertEquals(expected, gk.totalMarks)
        assertTrue(gk.isOnPaperFor("kharidar") && gk.isOnPaperFor("adhikrit"))
    }

    @Test
    fun `a placement names one section of one post`() {
        pooled.forEach { subject ->
            subject.placements.forEach { pl ->
                assertTrue(pl.levelId in subject.levels, "${subject.subjectId}: stray placement")
                assertTrue(pl.sectionName.en.isNotBlank() && pl.sectionName.ne.isNotBlank())
            }
        }
    }
}
