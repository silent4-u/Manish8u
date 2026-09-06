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
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.delay
import np.loksewa.sathi.core.OptionState
import np.loksewa.sathi.core.QuizSession
import np.loksewa.sathi.core.formatClock

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
 * Renders a [QuizSession]. All the rules — reveal behaviour, navigation limits,
 * the countdown, marking — live in the core module and are unit-tested; this
 * only draws the current state and forwards taps.
 */
@Composable
fun QuizScreen(
    initial: QuizSession,
    subjectId: String?,
    onExit: () -> Unit,
) {
    val app = appState()
    val level = app.level ?: return

    if (initial.isEmpty) {
        EmptyState("\uD83D\uDCED", app.repo.string("noQuestions", app.lang))
        return
    }

    var session by remember(initial) { mutableStateOf(initial) }

    // One ticker drives the elapsed counter and, for a mock, the countdown.
    // The session finishes itself at zero, so nothing here has to watch for it.
    LaunchedEffect(session.finished) {
        while (!session.finished) {
            delay(1000)
            session = session.tick()
        }
    }

    // Record exactly once, however the session ended — submitted or timed out.
    LaunchedEffect(session.finished) {
        if (session.finished) {
            val record = session.toRecord(level.id, subjectId, System.currentTimeMillis())
            val answered = session.answeredSubjects()
            app.update { it.withAttempt(record, answered) }
        }
    }

    if (session.finished) {
        ResultView(session, level.mock.passPercent, onExit)
        return
    }

    val question = session.current ?: return
    val saved = question.id in app.progress.savedQuestions

    LazyColumn(
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        item {
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Column {
                    SectionLabel(
                        "${app.repo.string("question", app.lang)} " +
                            "${app.n(session.index + 1)} / ${app.n(session.questions.size)}",
                    )
                    app.repo.subject(question.subjectId)?.let {
                        Text(
                            app.b(it.short),
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                }
                if (session.isMock) {
                    Text(
                        app.n(formatClock(session.secondsLeft)),
                        style = MaterialTheme.typography.titleLarge,
                        color = if (session.secondsLeft <= 60) MaterialTheme.colorScheme.error
                        else MaterialTheme.colorScheme.onSurface,
                    )
                }
            }
        }
        item { ProgressBar((session.index + 1).toFloat() / session.questions.size) }

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
                            Text(if (saved) "\u2605" else "\u2606")
                        }
                    }

                    question.options.forEachIndexed { i, option ->
                        val border = when (session.optionState(i)) {
                            OptionState.CORRECT -> Color(0xFF15803D)
                            OptionState.WRONG -> MaterialTheme.colorScheme.error
                            OptionState.CHOSEN -> MaterialTheme.colorScheme.primary
                            OptionState.NEUTRAL -> MaterialTheme.colorScheme.outline
                        }
                        OutlinedButton(
                            onClick = { session = session.choose(i) },
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

                    if (session.revealed && !session.isMock) {
                        Callout("tip", app.repo.string("explanation", app.lang), app.b(question.explanation))
                    }
                }
            }
        }

        item {
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                OutlinedButton(
                    onClick = { session = session.previous() },
                    enabled = session.index > 0,
                ) { Text(app.repo.string("previous", app.lang)) }

                if (session.isLast) {
                    Button(onClick = { session = session.finish() }) {
                        Text(
                            if (session.isMock) app.repo.string("submitTest", app.lang)
                            else app.repo.string("finish", app.lang),
                        )
                    }
                } else {
                    Button(onClick = { session = session.next() }) {
                        Text(app.repo.string("next", app.lang))
                    }
                }
            }
        }

        if (session.isMock) {
            item {
                Column {
                    SectionLabel("${app.n(session.answeredCount)} / ${app.n(session.questions.size)}")
                    FlowRow(horizontalArrangement = Arrangement.spacedBy(5.dp)) {
                        session.questions.indices.forEach { i ->
                            val answered = session.isAnswered(i)
                            TextButton(
                                onClick = { session = session.goTo(i) },
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
                    Button(onClick = { session = session.finish() }, modifier = Modifier.fillMaxWidth()) {
                        Text(app.repo.string("submitTest", app.lang))
                    }
                }
            }
        }
    }
}

@Composable
private fun ResultView(session: QuizSession, passPercent: Int, onExit: () -> Unit) {
    val app = appState()
    var showReview by remember { mutableStateOf(false) }
    val summary = session.summary
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
                StatTile(app.n(formatClock(session.elapsed)), app.repo.string("timeTaken", app.lang), Modifier.weight(1f))
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
            items(session.questions.size) { i ->
                val question = session.questions[i]
                val given = session.answers.getOrNull(i)
                val correct = given == question.answer
                Card(
                    Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
                ) {
                    Column(Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        Pill(
                            "${app.n(i + 1)} \u00B7 " + when {
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
