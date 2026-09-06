package np.loksewa.sathi.ui

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import np.loksewa.sathi.core.CurrentAffair
import np.loksewa.sathi.core.ExamLevel

@Composable
fun LevelSelectScreen(onChosen: () -> Unit) {
    val app = appState()
    LazyColumn(
        contentPadding = androidx.compose.foundation.layout.PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        item {
            Column {
                SectionLabel(app.repo.string("appName", app.lang))
                Text(
                    app.repo.string("chooseLevel", app.lang),
                    style = MaterialTheme.typography.headlineMedium,
                )
                Text(
                    app.repo.string("tagline", app.lang),
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }
        items(app.repo.levels, key = { it.id }) { level ->
            LevelCard(level) {
                app.setLevel(level.id)
                onChosen()
            }
        }
        item {
            Callout("tip", null, app.b(app.repo.syllabusNote))
        }
    }
}

@Composable
private fun LevelCard(level: ExamLevel, onClick: () -> Unit) {
    val app = appState()
    Card(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
    ) {
        Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                Text(level.icon, style = MaterialTheme.typography.headlineSmall)
                Column {
                    Text(app.b(level.name), style = MaterialTheme.typography.titleLarge)
                    Text(
                        app.b(level.grade),
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }
            Text(app.b(level.summary), style = MaterialTheme.typography.bodyMedium)
            FlowRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                Pill("${app.n(level.papers.size)} ${app.repo.string("paper", app.lang)}")
                Pill("${app.n(level.totalMarks)} ${app.repo.string("marks", app.lang)}")
            }
        }
    }
}

@Composable
fun HomeScreen(navigate: (String) -> Unit) {
    val app = appState()
    val level = app.level ?: return
    val lessons = app.repo.lessonsFor(level.id)
    val questions = app.repo.questionsFor(level.id)
    val focus = app.repo.affairsFor(level.id).firstOrNull()

    LazyColumn(
        contentPadding = androidx.compose.foundation.layout.PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        item {
            Card(
                Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
            ) {
                Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    SectionLabel(app.repo.string("preparingFor", app.lang))
                    Text("${level.icon}  ${app.b(level.name)}", style = MaterialTheme.typography.headlineSmall)
                    Text(
                        app.b(level.grade),
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                    Text(app.b(level.summary), style = MaterialTheme.typography.bodyMedium)
                    OutlinedButton(onClick = { navigate(Routes.LEVELS) }) {
                        Text(app.repo.string("changeLevel", app.lang))
                    }
                }
            }
        }

        item {
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                StatTile(app.n(lessons.size), app.repo.string("lessons", app.lang), Modifier.weight(1f))
                StatTile(app.n(questions.size), app.repo.string("questions", app.lang), Modifier.weight(1f))
            }
        }
        item {
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                StatTile(
                    app.n(app.progress.attempts.size),
                    app.repo.string("totalAttempts", app.lang),
                    Modifier.weight(1f),
                )
                StatTile(
                    "${app.n(app.progress.overallAccuracy)}%",
                    app.repo.string("overallAccuracy", app.lang),
                    Modifier.weight(1f),
                )
            }
        }

        item { SectionLabel(app.repo.string("quickActions", app.lang)) }
        items(quickActions(app)) { action ->
            Card(
                onClick = { navigate(action.route) },
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
            ) {
                Row(
                    Modifier.padding(14.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Text(action.icon, style = MaterialTheme.typography.titleLarge)
                    Column {
                        Text(action.title, style = MaterialTheme.typography.titleMedium)
                        Text(
                            action.subtitle,
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                }
            }
        }

        if (focus != null) {
            item { SectionLabel(app.repo.string("todaysFocus", app.lang)) }
            item { AffairCard(focus) { navigate(Routes.AFFAIRS) } }
        }
    }
}

private data class QuickAction(val icon: String, val title: String, val subtitle: String, val route: String)

private fun quickActions(app: AppState): List<QuickAction> {
    val level = app.level ?: return emptyList()
    val s = { key: String -> app.repo.string(key, app.lang) }
    return listOf(
        QuickAction("📚", s("studyNotes"), "${app.n(app.repo.lessonsFor(level.id).size)} ${s("lessons")}", Routes.STUDY),
        QuickAction("✍️", s("practiceQuiz"), "${app.n(app.repo.questionsFor(level.id).size)} ${s("questions")}", Routes.PRACTICE),
        QuickAction(
            "⏱️", s("fullMockTest"),
            "${app.n(level.mock.questionCount)} ${s("questions")} · ${app.n(level.mock.durationMinutes)} ${s("minutes")}",
            Routes.MOCK,
        ),
        QuickAction("📜", s("examPattern"), "${app.n(level.papers.size)} ${s("paper")} · ${app.n(level.totalMarks)} ${s("marks")}", Routes.SYLLABUS),
        QuickAction("📰", s("navAffairs"), "${app.n(app.repo.affairsFor(level.id).size)} ${s("topicsCovered")}", Routes.AFFAIRS),
        QuickAction(
            "⭐", s("navSaved"),
            "${app.n(app.progress.savedLessons.size + app.progress.savedQuestions.size)} ${s("savedItems")}",
            Routes.SAVED,
        ),
    )
}

@Composable
fun SyllabusScreen() {
    val app = appState()
    val level = app.level ?: return
    LazyColumn(
        contentPadding = androidx.compose.foundation.layout.PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        item {
            Column {
                SectionLabel(app.b(level.name))
                Text(app.repo.string("navSyllabus", app.lang), style = MaterialTheme.typography.headlineMedium)
                Text(
                    app.b(level.minQualification),
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }
        items(level.papers, key = { it.id }) { paper ->
            Card(
                Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
            ) {
                Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(app.b(paper.name), style = MaterialTheme.typography.titleMedium)
                    FlowRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        Pill(app.repo.string(paper.format, app.lang), PillTone.Accent)
                        Pill("${app.n(paper.fullMarks)} ${app.repo.string("marks", app.lang)}")
                        Pill("${app.repo.string("passMarks", app.lang)} ${app.n(paper.passMarks)}")
                        Pill("${app.n(paper.durationMinutes)} ${app.repo.string("minutes", app.lang)}")
                    }
                    Text(
                        "${app.repo.string("pattern", app.lang)}: ${app.b(paper.pattern)}",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                    paper.sections.forEach { section ->
                        Column(Modifier.padding(top = 8.dp)) {
                            Text(app.b(section.name), style = MaterialTheme.typography.titleMedium)
                            section.marks?.let {
                                Pill("${app.n(it)} ${app.repo.string("marks", app.lang)}")
                            }
                            section.topics.forEach { topic ->
                                Text("•  ${app.b(topic)}", style = MaterialTheme.typography.bodyMedium)
                            }
                        }
                    }
                }
            }
        }
        item { Callout("key", app.repo.string("syllabusNotice", app.lang), app.b(app.repo.syllabusNote)) }
    }
}

@Composable
fun AffairsScreen() {
    val app = appState()
    val level = app.level ?: return
    val items = app.repo.affairsFor(level.id)
    LazyColumn(
        contentPadding = androidx.compose.foundation.layout.PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        item {
            Text(app.repo.string("navAffairs", app.lang), style = MaterialTheme.typography.headlineMedium)
        }
        item { Callout("tip", null, app.b(app.repo.affairsNote)) }
        items(items, key = { it.id }) { AffairCard(it, null) }
    }
}

@Composable
private fun AffairCard(affair: CurrentAffair, onClick: (() -> Unit)?) {
    val app = appState()
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .then(if (onClick != null) Modifier.clickable(onClick = onClick) else Modifier),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
    ) {
        Column(Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Pill(app.b(affair.category), PillTone.Accent)
            Text(app.b(affair.title), style = MaterialTheme.typography.titleMedium)
            Text(app.b(affair.detail), style = MaterialTheme.typography.bodyMedium)
        }
    }
}

@Composable
fun ProgressScreen() {
    val app = appState()
    val stats = app.progress.subjectStats.entries.filter { it.value.attempted > 0 }
        .sortedByDescending { it.value.attempted }

    if (app.progress.attempts.isEmpty() && stats.isEmpty()) {
        EmptyState("📊", app.repo.string("noAttempts", app.lang))
        return
    }

    LazyColumn(
        contentPadding = androidx.compose.foundation.layout.PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        item { Text(app.repo.string("navProgress", app.lang), style = MaterialTheme.typography.headlineMedium) }
        item {
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                StatTile(app.n(app.progress.attempts.size), app.repo.string("totalAttempts", app.lang), Modifier.weight(1f))
                StatTile(app.n(app.progress.questionsAttempted), app.repo.string("questionsAttempted", app.lang), Modifier.weight(1f))
                StatTile("${app.n(app.progress.overallAccuracy)}%", app.repo.string("overallAccuracy", app.lang), Modifier.weight(1f))
            }
        }
        item { SectionLabel(app.repo.string("bySubject", app.lang)) }
        items(stats, key = { it.key }) { (subjectId, stat) ->
            val subject = app.repo.subject(subjectId)
            Column {
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text(
                        "${subject?.icon ?: ""} ${subject?.let { app.b(it.short) } ?: subjectId}",
                        style = MaterialTheme.typography.bodyMedium,
                    )
                    Text(
                        "${app.n(stat.correct)}/${app.n(stat.attempted)} · ${app.n(stat.accuracy)}%",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
                ProgressBar(stat.correct.toFloat() / stat.attempted)
            }
        }
        item {
            OutlinedButton(
                onClick = { app.update { it.cleared() } },
                modifier = Modifier.fillMaxWidth(),
            ) {
                Text(app.repo.string("clearProgress", app.lang), color = MaterialTheme.colorScheme.error)
            }
        }
    }
}

@Composable
fun SavedScreen(openLesson: (String) -> Unit) {
    val app = appState()
    val lessons = app.progress.savedLessons.mapNotNull { app.repo.lesson(it) }
    val questions = app.progress.savedQuestions.mapNotNull { app.repo.question(it) }

    if (lessons.isEmpty() && questions.isEmpty()) {
        EmptyState("⭐", app.repo.string("nothingSaved", app.lang))
        return
    }

    LazyColumn(
        contentPadding = androidx.compose.foundation.layout.PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        item { Text(app.repo.string("navSaved", app.lang), style = MaterialTheme.typography.headlineMedium) }
        if (lessons.isNotEmpty()) {
            item { SectionLabel(app.repo.string("savedLessons", app.lang)) }
            items(lessons, key = { "l-${it.id}" }) { lesson ->
                Card(
                    onClick = { openLesson(lesson.id) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
                ) {
                    Column(Modifier.padding(14.dp)) {
                        Text(app.b(lesson.title), style = MaterialTheme.typography.titleMedium)
                        Text(
                            app.b(lesson.summary),
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                }
            }
        }
        if (questions.isNotEmpty()) {
            item { SectionLabel(app.repo.string("savedQuestions", app.lang)) }
            items(questions, key = { "q-${it.id}" }) { question ->
                Card(
                    Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
                ) {
                    Column(Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        Text(app.b(question.prompt), style = MaterialTheme.typography.titleMedium)
                        Text(
                            "${app.repo.string("correctAnswer", app.lang)}: ${app.b(question.options[question.answer])}",
                            style = MaterialTheme.typography.bodyMedium,
                        )
                        Callout("tip", null, app.b(question.explanation))
                        Button(onClick = { app.update { it.toggleSavedQuestion(question.id) } }) {
                            Text(app.repo.string("remove", app.lang))
                        }
                    }
                }
            }
        }
    }
}
