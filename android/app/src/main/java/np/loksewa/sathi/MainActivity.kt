package np.loksewa.sathi

import android.os.Bundle
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.CompositionLocalProvider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import kotlinx.coroutines.launch
import np.loksewa.sathi.core.ContentRepository
import np.loksewa.sathi.core.Lang
import np.loksewa.sathi.core.ProgressState
import np.loksewa.sathi.data.ProgressStore
import np.loksewa.sathi.ui.*

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        // Parsed once; the corpus is bundled so there is nothing to fetch.
        val repo = ContentRepository.load()
        val store = ProgressStore(applicationContext)

        setContent {
            LokSewaTheme {
                val context = LocalContext.current
                val scope = rememberCoroutineScope()
                // null means "not read from disk yet", which is different from
                // "read, and the learner has not chosen a level".
                val stored by store.state.collectAsStateWithLifecycle(initialValue = null)
                var lang by remember { mutableStateOf(currentLanguage(context)) }

                val progress = stored
                if (progress == null) {
                    Surface(Modifier.fillMaxSize(), color = MaterialTheme.colorScheme.background) {}
                    return@LokSewaTheme
                }

                val app = AppState(
                    repo = repo,
                    lang = lang,
                    progress = progress,
                    setLevel = { id -> scope.launch { store.update { it.withLevel(id) } } },
                    setLang = { next ->
                        lang = next
                        applyLanguage(next)
                    },
                    update = { transform -> scope.launch { store.update(transform) } },
                )

                CompositionLocalProvider(LocalAppState provides app) {
                    AppScaffold(app)
                }
            }
        }
    }
}

@Composable
private fun AppScaffold(app: AppState) {
    val nav = rememberNavController()
    val entry by nav.currentBackStackEntryAsState()
    val route = entry?.destination?.route

    // The start destination below already handles a first run. This only
    // catches a level being cleared while the app is open.
    LaunchedEffect(app.progress.levelId) {
        if (app.progress.levelId == null && route != null && route != Routes.LEVELS) {
            nav.navigate(Routes.LEVELS) { popUpTo(0) }
        }
    }

    val onLevels = route == Routes.LEVELS || route == null && app.progress.levelId == null

    Scaffold(
        topBar = { AppTopBar(app) },
        bottomBar = { if (!onLevels) AppBottomBar(app, nav, route) },
    ) { padding ->
        NavHost(
            navController = nav,
            startDestination = if (app.progress.levelId == null) Routes.LEVELS else Routes.HOME,
            modifier = Modifier.padding(padding),
        ) {
            composable(Routes.LEVELS) {
                LevelSelectScreen(onChosen = { nav.navigate(Routes.HOME) { popUpTo(0) } })
            }
            composable(Routes.HOME) { HomeScreen(navigate = { nav.navigate(it) }) }
            composable(Routes.SYLLABUS) { SyllabusScreen() }
            composable(Routes.STUDY) {
                SubjectListScreen(openSubject = { nav.navigate(Routes.subject(it)) })
            }
            composable(Routes.SUBJECT) { backStack ->
                LessonListScreen(
                    subjectId = backStack.arguments?.getString("subjectId").orEmpty(),
                    openLesson = { nav.navigate(Routes.lesson(it)) },
                    practise = { nav.navigate(Routes.practiceQuiz(it)) },
                )
            }
            composable(Routes.LESSON) { backStack ->
                LessonScreen(
                    lessonId = backStack.arguments?.getString("lessonId").orEmpty(),
                    practise = { nav.navigate(Routes.practiceQuiz(it)) },
                )
            }
            composable(Routes.PRACTICE) {
                PracticePickerScreen(startPractice = { nav.navigate(Routes.practiceQuiz(it)) })
            }
            composable(Routes.PRACTICE_QUIZ) { backStack ->
                val raw = backStack.arguments?.getString("subjectId").orEmpty()
                val subjectId = raw.takeIf { it != "all" }
                // remember keyed on the entry so returning re-draws the same paper.
                val paper = remember(backStack.id) { buildPaper(app, subjectId, isMock = false) }
                QuizScreen(paper, isMock = false, subjectId = subjectId, onExit = { nav.popBackStack() })
            }
            composable(Routes.MOCK) { MockIntroScreen(start = { nav.navigate(Routes.MOCK_RUN) }) }
            composable(Routes.MOCK_RUN) { backStack ->
                val paper = remember(backStack.id) { buildPaper(app, null, isMock = true) }
                QuizScreen(paper, isMock = true, subjectId = null, onExit = { nav.popBackStack() })
            }
            composable(Routes.PROGRESS) { ProgressScreen() }
            composable(Routes.SAVED) { SavedScreen(openLesson = { nav.navigate(Routes.lesson(it)) }) }
            composable(Routes.AFFAIRS) { AffairsScreen() }
        }
    }
}

@Composable
private fun AppTopBar(app: AppState) {
    TopAppBar(
        title = {
            Text(app.repo.string("appName", app.lang), style = MaterialTheme.typography.titleMedium)
        },
        actions = {
            Row(horizontalArrangement = Arrangement.spacedBy(2.dp)) {
                TextButton(onClick = { app.setLang(Lang.NE) }) {
                    Text(
                        "नेपाली",
                        color = if (app.lang == Lang.NE) MaterialTheme.colorScheme.primary
                        else MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
                TextButton(onClick = { app.setLang(Lang.EN) }) {
                    Text(
                        "EN",
                        color = if (app.lang == Lang.EN) MaterialTheme.colorScheme.primary
                        else MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }
        },
        colors = TopAppBarDefaults.topAppBarColors(
            containerColor = MaterialTheme.colorScheme.surface,
        ),
    )
}

@Composable
private fun AppBottomBar(app: AppState, nav: NavHostController, route: String?) {
    NavigationBar(containerColor = MaterialTheme.colorScheme.surface) {
        BOTTOM_TABS.forEach { (dest, icon, key) ->
            NavigationBarItem(
                selected = route == dest,
                onClick = {
                    if (route != dest) {
                        nav.navigate(dest) {
                            popUpTo(Routes.HOME) { saveState = true }
                            launchSingleTop = true
                            restoreState = true
                        }
                    }
                },
                icon = { Text(icon) },
                label = {
                    Text(app.repo.string(key, app.lang), style = MaterialTheme.typography.labelSmall)
                },
            )
        }
    }
}
