package np.loksewa.sathi.ui

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import np.loksewa.sathi.core.LessonBlock

@Composable
fun SubjectListScreen(openSubject: (String) -> Unit) {
    val app = appState()
    val level = app.level ?: return
    val subjects = app.repo.subjectsFor(level.id)

    LazyColumn(
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        item { Text(app.repo.string("subjects", app.lang), style = MaterialTheme.typography.headlineMedium) }
        items(subjects, key = { it.id }) { subject ->
            val lessonCount = app.repo.lessonsFor(level.id, subject.id).size
            val questionCount = app.repo.questionsFor(level.id, subject.id).size
            Card(
                onClick = { openSubject(subject.id) },
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
            ) {
                Row(
                    Modifier.padding(14.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                ) {
                    Text(subject.icon, style = MaterialTheme.typography.titleLarge)
                    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        Text(app.b(subject.name), style = MaterialTheme.typography.titleMedium)
                        Text(
                            app.b(subject.description),
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                        Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            Pill("${app.n(lessonCount)} ${app.repo.string("lessons", app.lang)}")
                            Pill("${app.n(questionCount)} ${app.repo.string("questions", app.lang)}")
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun LessonListScreen(subjectId: String, openLesson: (String) -> Unit, practise: (String) -> Unit) {
    val app = appState()
    val level = app.level ?: return
    val subject = app.repo.subject(subjectId) ?: return
    val lessons = app.repo.lessonsFor(level.id, subjectId)

    LazyColumn(
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        item {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text("${subject.icon}  ${app.b(subject.name)}", style = MaterialTheme.typography.headlineSmall)
                Text(
                    app.b(subject.description),
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                Button(onClick = { practise(subjectId) }) {
                    Text(app.repo.string("practiceThisSubject", app.lang))
                }
            }
        }
        if (lessons.isEmpty()) {
            item { EmptyState("📄", app.repo.string("noLessonsYet", app.lang)) }
        }
        items(lessons, key = { it.id }) { lesson ->
            Card(
                onClick = { openLesson(lesson.id) },
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
            ) {
                Column(Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text(app.b(lesson.title), style = MaterialTheme.typography.titleMedium)
                    Text(
                        app.b(lesson.summary),
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                    Pill("${app.n(lesson.readMinutes)} ${app.repo.string("minutes", app.lang)} ${app.repo.string("readTime", app.lang)}")
                }
            }
        }
    }
}

@Composable
fun LessonScreen(lessonId: String, practise: (String) -> Unit) {
    val app = appState()
    val lesson = app.repo.lesson(lessonId) ?: return
    val saved = lesson.id in app.progress.savedLessons

    LazyColumn(
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        item {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(app.b(lesson.title), style = MaterialTheme.typography.headlineSmall)
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
                    Pill("${app.n(lesson.readMinutes)} ${app.repo.string("minutes", app.lang)}")
                    OutlinedButton(onClick = { app.update { it.toggleSavedLesson(lesson.id) } }) {
                        Text(
                            if (saved) "★ ${app.repo.string("saved", app.lang)}"
                            else "☆ ${app.repo.string("save", app.lang)}",
                        )
                    }
                }
            }
        }
        items(lesson.blocks.size) { index -> LessonBlockView(lesson.blocks[index]) }
        item {
            Button(onClick = { practise(lesson.subjectId) }, modifier = Modifier.fillMaxWidth()) {
                Text(app.repo.string("practiceThisSubject", app.lang))
            }
        }
    }
}

/** Renders one authored block. Mirrors the web app's block renderer exactly. */
@Composable
private fun LessonBlockView(block: LessonBlock) {
    val app = appState()
    when (block) {
        is LessonBlock.Heading ->
            Text(
                app.b(block.text),
                style = MaterialTheme.typography.titleLarge,
                modifier = Modifier.padding(top = 12.dp),
            )

        is LessonBlock.Para ->
            Text(app.b(block.text), style = MaterialTheme.typography.bodyLarge)

        is LessonBlock.Listing ->
            Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                block.items.forEachIndexed { i, item ->
                    val marker = if (block.ordered) "${app.n(i + 1)}." else "•"
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text(marker, style = MaterialTheme.typography.bodyLarge)
                        Text(app.b(item), style = MaterialTheme.typography.bodyLarge)
                    }
                }
            }

        is LessonBlock.Facts ->
            Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                block.items.forEach { fact ->
                    Column(
                        Modifier
                            .fillMaxWidth()
                            .background(MaterialTheme.colorScheme.surfaceVariant, RoundedCornerShape(9.dp))
                            .padding(10.dp),
                    ) {
                        Text(
                            app.b(fact.label),
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                        Text(app.b(fact.value), style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold)
                    }
                }
            }

        // Wide tables scroll horizontally rather than squeezing the page.
        is LessonBlock.Table ->
            Column(Modifier.horizontalScroll(rememberScrollState())) {
                Row(Modifier.background(MaterialTheme.colorScheme.surfaceVariant)) {
                    block.headers.forEach { header ->
                        Text(
                            app.b(header),
                            style = MaterialTheme.typography.labelSmall,
                            modifier = Modifier
                                .width(160.dp)
                                .padding(8.dp),
                        )
                    }
                }
                block.rows.forEach { row ->
                    Row {
                        row.forEach { cell ->
                            Text(
                                app.b(cell),
                                style = MaterialTheme.typography.bodyMedium,
                                modifier = Modifier
                                    .width(160.dp)
                                    .padding(8.dp),
                            )
                        }
                    }
                }
            }

        is LessonBlock.Callout -> {
            val title = when (block.tone) {
                "tip" -> app.repo.string("tip", app.lang)
                "warn" -> app.repo.string("watchOut", app.lang)
                else -> app.repo.string("keyPoint", app.lang)
            }
            Callout(block.tone, title, app.b(block.text))
        }
    }
}
