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
    fun `nayab subba and kharidar sit the same first paper`() {
        val nasu = repo.level("nayabsubba")!!.papers.first()
        val khar = repo.level("kharidar")!!.papers.first()
        assertEquals(nasu.fullMarks, khar.fullMarks)
        assertEquals(nasu.durationMinutes, khar.durationMinutes)
        assertEquals(nasu.pattern.en, khar.pattern.en)
        assertEquals(
            nasu.sections.flatMap { it.subjectIds }.toSet(),
            khar.sections.flatMap { it.subjectIds }.toSet(),
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
        assertEquals(40, nasu.passMarks)

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
