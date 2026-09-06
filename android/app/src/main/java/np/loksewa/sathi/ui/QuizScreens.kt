package np.loksewa.sathi.ui

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.delay
import np.loksewa.sathi.core.AttemptRecord
import np.loksewa.sathi.core.AttemptSummary
import np.loksewa.sathi.core.MarkingScheme
import np.loksewa.sathi.core.Question
import np.loksewa.sathi.core.formatClock
import np.loksewa.sathi.core.scoreAttempt

private const val PRACTICE_SIZE = 10
private val OPTION_KEYS = listOf("A", "B", "C", "D", "E")

@Composable
fun PracticePickerScreen(startPractice: (String) -> Unit) {
    val app = appState()
    val level = app.level ?: return
    LazyColumn(
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        item { Text(app.repo.string("selectSubject", app.lang), style = MaterialTheme.typography.headlineMedium) }
        item {
            Card(
                onClick = { startPractice("all") },
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer),
            ) {
                Column(Modifier.padding(14.dp)) {
                    Text("🎲  ${app.repo.string("mixedPractice", app.lang)}", style = MaterialTheme.typography.titleMedium)
                    Text(
                        "${app.n(app.repo.questionsFor(level.id).size)} ${app.repo.string("questions", app.lang)}",
                        style = MaterialTheme.typography.labelSmall,
                    )
                }
            }
        }
        items(app.repo.subjectsFor(level.id), key = { it.id }) { subject ->
            val count = app.repo.questionsFor(level.id, subject.id).size
            if (count > 0) {
                Card(
                    onClick = { startPractice(subject.id) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
                ) {
                    Row(Modifier.padding(14.dp), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                        Text(subject.icon, style = MaterialTheme.typography.titleLarge)
                        Column {
                            Text(app.b(subject.name), style = MaterialTheme.typography.titleMedium)
                            Text(
                                "${app.n(count)} ${app.repo.string("questions", app.lang)}",
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun MockIntroScreen(start: () -> Unit) {
    val app = appState()
    val level = app.level ?: return
    val mock = level.mock
    LazyColumn(
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        item {
            Column {
                SectionLabel(app.b(level.name))
                Text(app.repo.string("fullMockTest", app.lang), style = MaterialTheme.typography.headlineMedium)
                Text(
                    app.repo.string("mockIntro", app.lang),
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }
        item {
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                StatTile(app.n(mock.questionCount), app.repo.string("questions", app.lang), Modifier.weight(1f))
                StatTile(app.n(mock.durationMinutes), app.repo.string("minutes", app.lang), Modifier.weight(1f))
                StatTile(app.n(mock.questionCount * mock.marksPerQuestion), app.repo.string("fullMarks", app.lang), Modifier.weight(1f))
            }
        }
        if (mock.negativePerWrong > 0) {
            item {
                Callout(
                    "warn",
                    app.repo.string("negativeMarking", app.lang),
                    "−${mock.negativePerWrong} ${app.repo.string("marks", app.lang)} ${app.repo.string("perWrongAnswer", app.lang)}",
                )
            }
        }
        item {
            Button(onClick = start, modifier = Modifier.fillMaxWidth()) {
                Text(app.repo.string("start", app.lang))
            }
        }
    }
}

/**
 * One quiz session. Practice reveals the answer as soon as it is chosen; a mock
 * test runs against the clock and only reveals everything at the end.
 */
@Composable
fun QuizScreen(
    questions: List<Question>,
    isMock: Boolean,
    subjectId: String?,
    onExit: () -> Unit,
) {
    val app = appState()
    val level = app.level ?: return

    if (questions.isEmpty()) {
        EmptyState("📭", app.repo.string("noQuestions", app.lang))
        return
    }

    val answers = remember(questions) { mutableStateListOf<Int?>().apply { repeat(questions.size) { add(null) } } }
    var index by remember(questions) { mutableIntStateOf(0) }
    var revealed by remember(questions) { mutableStateOf(false) }
    var finished by remember(questions) { mutableStateOf(false) }
    var secondsLeft by remember(questions) { mutableIntStateOf(level.mock.durationMinutes * 60) }
    var elapsed by remember(questions) { mutableIntStateOf(0) }

    val scheme = if (isMock) MarkingScheme.of(level.mock) else MarkingScheme.NO_PENALTY
    val summary = scoreAttempt(answers.toList(), questions, scheme)

    fun finish() {
        if (finished) return
        finished = true
        val answered = questions.mapIndexedNotNull { i, q ->
            answers[i]?.let { q.subjectId to (it == q.answer) }
        }
        val record = AttemptRecord(
            id = "${System.currentTimeMillis()}",
            levelId = level.id,
            mode = if (isMock) "mock" else "practice",
            subjectId = subjectId,
            total = questions.size,
            correct = summary.correct,
            wrong = summary.wrong,
            skipped = summary.skipped,
            score = summary.score,
            maxScore = summary.maxScore,
            seconds = elapsed,
            finishedAt = System.currentTimeMillis(),
        )
        app.update { it.withAttempt(record, answered) }
    }

    // One ticker drives both the elapsed counter and the mock countdown.
    LaunchedEffect(finished) {
        while (!finished) {
            delay(1000)
            elapsed += 1
            if (isMock) {
                secondsLeft -= 1
                if (secondsLeft <= 0) finish()
            }
        }
    }

    if (finished) {
        ResultView(questions, answers.toList(), summary, elapsed, level.mock.passPercent, onExit)
        return
    }

    val question = questions[index]
    val saved = question.id in app.progress.savedQuestions
    val isLast = index == questions.lastIndex

    LazyColumn(
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        item {
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Column {
                    SectionLabel(
                        "${app.repo.string("question", app.lang)} ${app.n(index + 1)} / ${app.n(questions.size)}",
                    )
                    app.repo.subject(question.subjectId)?.let {
                        Text(
                            app.b(it.short),
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                }
                if (isMock) {
                    Text(
                        app.n(formatClock(secondsLeft)),
                        style = MaterialTheme.typography.titleLarge,
                        color = if (secondsLeft <= 60) MaterialTheme.colorScheme.error
                        else MaterialTheme.colorScheme.onSurface,
                    )
                }
            }
        }
        item { ProgressBar((index + 1).toFloat() / questions.size) }

        item {
            Card(
                Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
            ) {
                Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text(
                            app.b(question.prompt),
                            style = MaterialTheme.typography.titleMedium,
                            modifier = Modifier.weight(1f),
                        )
                        TextButton(onClick = { app.update { it.toggleSavedQuestion(question.id) } }) {
                            Text(if (saved) "★" else "☆")
                        }
                    }

                    question.options.forEachIndexed { i, option ->
                        val chosen = answers[index] == i
                        val showAnswer = !isMock && revealed
                        val border = when {
                            showAnswer && i == question.answer -> Color(0xFF15803D)
                            showAnswer && chosen -> MaterialTheme.colorScheme.error
                            chosen -> MaterialTheme.colorScheme.primary
                            else -> MaterialTheme.colorScheme.outline
                        }
                        OutlinedButton(
                            onClick = {
                                if (showAnswer) return@OutlinedButton
                                answers[index] = i
                                if (!isMock) revealed = true
                            },
                            modifier = Modifier.fillMaxWidth(),
                            border = BorderStroke(1.5.dp, border),
                        ) {
                            Text(
                                "${OPTION_KEYS[i]}.  ${app.b(option)}",
                                modifier = Modifier.weight(1f),
                                textAlign = TextAlign.Start,
                            )
                        }
                    }

                    if (!isMock && revealed) {
                        Callout("tip", app.repo.string("explanation", app.lang), app.b(question.explanation))
                    }
                }
            }
        }

        item {
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                OutlinedButton(
                    onClick = { index -= 1; revealed = false },
                    enabled = index > 0,
                ) { Text(app.repo.string("previous", app.lang)) }

                if (isLast) {
                    Button(onClick = { finish() }) {
                        Text(
                            if (isMock) app.repo.string("submitTest", app.lang)
                            else app.repo.string("finish", app.lang),
                        )
                    }
                } else {
                    Button(onClick = { index += 1; revealed = false }) {
                        Text(app.repo.string("next", app.lang))
                    }
                }
            }
        }

        if (isMock) {
            item {
                Column {
                    SectionLabel("${app.n(answers.count { it != null })} / ${app.n(questions.size)}")
                    FlowRow(horizontalArrangement = Arrangement.spacedBy(5.dp)) {
                        questions.indices.forEach { i ->
                            val answered = answers[i] != null
                            TextButton(
                                onClick = { index = i; revealed = false },
                                modifier = Modifier
                                    .size(38.dp)
                                    .background(
                                        if (answered) MaterialTheme.colorScheme.primary else Color.Transparent,
                                        RoundedCornerShape(7.dp),
                                    ),
                            ) {
                                Text(
                                    app.n(i + 1),
                                    style = MaterialTheme.typography.labelSmall,
                                    color = if (answered) MaterialTheme.colorScheme.onPrimary
                                    else MaterialTheme.colorScheme.onSurfaceVariant,
                                )
                            }
                        }
                    }
                    Button(onClick = { finish() }, modifier = Modifier.fillMaxWidth()) {
                        Text(app.repo.string("submitTest", app.lang))
                    }
                }
            }
        }
    }
}

@Composable
private fun ResultView(
    questions: List<Question>,
    answers: List<Int?>,
    summary: AttemptSummary,
    seconds: Int,
    passPercent: Int,
    onExit: () -> Unit,
) {
    val app = appState()
    var showReview by remember { mutableStateOf(false) }
    val passed = summary.percent >= passPercent

    LazyColumn(
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        item {
            Card(
                Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
            ) {
                Column(
                    Modifier
                        .fillMaxWidth()
                        .padding(20.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    SectionLabel(app.repo.string("result", app.lang))
                    Text("${app.n(summary.percent)}%", style = MaterialTheme.typography.headlineMedium)
                    Text(
                        "${app.n(summary.score.toString())} / ${app.n(summary.maxScore)}",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                    Pill(
                        if (passed) app.repo.string("passed", app.lang) else app.repo.string("failed", app.lang),
                        if (passed) PillTone.Good else PillTone.Bad,
                    )
                }
            }
        }
        item {
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                StatTile(app.n(summary.correct), app.repo.string("correct", app.lang), Modifier.weight(1f), Color(0xFF15803D))
                StatTile(app.n(summary.wrong), app.repo.string("wrong", app.lang), Modifier.weight(1f), MaterialTheme.colorScheme.error)
                StatTile(app.n(summary.skipped), app.repo.string("skipped", app.lang), Modifier.weight(1f))
            }
        }
        item {
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                StatTile("${app.n(summary.accuracy)}%", app.repo.string("accuracy", app.lang), Modifier.weight(1f))
                StatTile(app.n(formatClock(seconds)), app.repo.string("timeTaken", app.lang), Modifier.weight(1f))
            }
        }
        item {
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                OutlinedButton(onClick = { showReview = !showReview }, modifier = Modifier.weight(1f)) {
                    Text(app.repo.string("reviewAnswers", app.lang))
                }
                Button(onClick = onExit, modifier = Modifier.weight(1f)) {
                    Text(app.repo.string("backToHome", app.lang))
                }
            }
        }

        if (showReview) {
            items(questions.size) { i ->
                val question = questions[i]
                val given = answers.getOrNull(i)
                val correct = given == question.answer
                Card(
                    Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
                ) {
                    Column(Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        Pill(
                            "${app.n(i + 1)} · " + when {
                                given == null -> app.repo.string("skipped", app.lang)
                                correct -> app.repo.string("correct", app.lang)
                                else -> app.repo.string("wrong", app.lang)
                            },
                            when {
                                given == null -> PillTone.Neutral
                                correct -> PillTone.Good
                                else -> PillTone.Bad
                            },
                        )
                        Text(app.b(question.prompt), style = MaterialTheme.typography.titleMedium)
                        if (given != null && !correct) {
                            Text(
                                "${app.repo.string("yourAnswer", app.lang)}: ${app.b(question.options[given])}",
                                style = MaterialTheme.typography.bodyMedium,
                            )
                        }
                        Text(
                            "${app.repo.string("correctAnswer", app.lang)}: ${app.b(question.options[question.answer])}",
                            style = MaterialTheme.typography.bodyMedium,
                        )
                        Callout("tip", null, app.b(question.explanation))
                    }
                }
            }
        }
    }
}

/** Draw a fresh paper. Kept here so both quiz entry points shuffle the same way. */
fun buildPaper(app: AppState, subjectId: String?, isMock: Boolean): List<Question> {
    val level = app.level ?: return emptyList()
    val count = if (isMock) level.mock.questionCount else PRACTICE_SIZE
    return app.repo.paperFor(level.id, subjectId, count)
}
