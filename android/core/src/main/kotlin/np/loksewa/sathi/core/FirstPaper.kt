package np.loksewa.sathi.core

/** Where a subject sits in one post's first paper. */
data class Placement(
    val levelId: String,
    val sectionName: Bilingual,
    val marks: Int?,
)

/** One subject as it appears in the first paper, across every post. */
data class FirstPaperSubject(
    val subjectId: String,
    /** Posts whose first paper covers this subject. */
    val levels: List<String>,
    val placements: List<Placement>,
    /** Marks across every post that examines it, for rough weighting. */
    val totalMarks: Int,
) {
    fun isCommonToAll(levelCount: Int) = levels.size == levelCount
    fun isOnPaperFor(levelId: String) = levelId in levels
}

/**
 * The first paper pooled across all posts.
 *
 * Nayab Subba and Kharidar sit the same first paper; the Section Officer paper
 * is set differently, so each subject records which posts actually examine it
 * rather than being presented as common when it is not.
 *
 * Note that syllabus topics belong to a SECTION, and one section covers
 * several subjects — so this returns placements (which section, worth how
 * much) and never attributes a section's topic list to any single subject.
 */
fun ContentRepository.firstPaperSubjects(): List<FirstPaperSubject> {
    val levelsFor = linkedMapOf<String, MutableList<String>>()
    val placements = linkedMapOf<String, MutableList<Placement>>()
    val marks = linkedMapOf<String, Int>()

    for (level in levels) {
        val paper = level.papers.firstOrNull() ?: continue
        for (section in paper.sections) {
            for (subjectId in section.subjectIds) {
                val seen = levelsFor.getOrPut(subjectId) { mutableListOf() }
                if (level.id !in seen) seen += level.id
                placements.getOrPut(subjectId) { mutableListOf() } +=
                    Placement(level.id, section.name, section.marks)
                marks[subjectId] = (marks[subjectId] ?: 0) + (section.marks ?: 0)
            }
        }
    }

    return placements.keys.map { id ->
        FirstPaperSubject(
            subjectId = id,
            levels = levelsFor[id].orEmpty(),
            placements = placements[id].orEmpty(),
            totalMarks = marks[id] ?: 0,
        )
        // Subjects every post examines lead, then by what they are worth.
    }.sortedWith(compareByDescending<FirstPaperSubject> { it.levels.size }.thenByDescending { it.totalMarks })
}
