package np.loksewa.sathi.ui

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Typography
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import androidx.core.view.WindowCompat

// Crimson is Nepal's national colour and carries the whole identity; every
// other surface stays quiet so it reads as deliberate rather than decorative.
private val Crimson = Color(0xFFC8102E)
private val CrimsonDark = Color(0xFF9B0C23)
private val CrimsonLight = Color(0xFFFF5670)

private val LightColors = lightColorScheme(
    primary = Crimson,
    onPrimary = Color.White,
    primaryContainer = Color(0xFFFDECEF),
    onPrimaryContainer = CrimsonDark,
    secondary = Color(0xFF0F766E),
    onSecondary = Color.White,
    background = Color(0xFFF6F5F2),
    onBackground = Color(0xFF1B1A17),
    surface = Color(0xFFFFFFFF),
    onSurface = Color(0xFF1B1A17),
    surfaceVariant = Color(0xFFFBFAF8),
    onSurfaceVariant = Color(0xFF6B6558),
    outline = Color(0xFFCFC9BE),
    error = Color(0xFFB91C1C),
)

private val DarkColors = darkColorScheme(
    primary = CrimsonLight,
    onPrimary = Color(0xFF37181F),
    primaryContainer = Color(0xFF37181F),
    onPrimaryContainer = CrimsonLight,
    secondary = Color(0xFF5EEAD4),
    onSecondary = Color(0xFF0B2F2B),
    background = Color(0xFF131417),
    onBackground = Color(0xFFECEAE5),
    surface = Color(0xFF1B1D21),
    onSurface = Color(0xFFECEAE5),
    surfaceVariant = Color(0xFF212429),
    onSurfaceVariant = Color(0xFFA7A29A),
    outline = Color(0xFF3D424A),
    error = Color(0xFFFCA5A5),
)

/**
 * Devanagari needs more vertical room than Latin at the same point size, so
 * line heights here are looser than Material's defaults across the board.
 */
private val AppTypography = Typography(
    headlineMedium = TextStyle(fontSize = 26.sp, lineHeight = 36.sp, fontWeight = FontWeight.Bold),
    headlineSmall = TextStyle(fontSize = 21.sp, lineHeight = 30.sp, fontWeight = FontWeight.Bold),
    titleLarge = TextStyle(fontSize = 19.sp, lineHeight = 28.sp, fontWeight = FontWeight.SemiBold),
    titleMedium = TextStyle(fontSize = 16.sp, lineHeight = 25.sp, fontWeight = FontWeight.SemiBold),
    bodyLarge = TextStyle(fontSize = 16.sp, lineHeight = 27.sp),
    bodyMedium = TextStyle(fontSize = 14.sp, lineHeight = 24.sp),
    labelLarge = TextStyle(fontSize = 14.sp, lineHeight = 20.sp, fontWeight = FontWeight.SemiBold),
    labelSmall = TextStyle(fontSize = 12.sp, lineHeight = 17.sp, fontWeight = FontWeight.Medium),
)

@Composable
fun LokSewaTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit,
) {
    val colors = if (darkTheme) DarkColors else LightColors
    val context = LocalContext.current

    SideEffect {
        // Edge-to-edge paints the bars, so only the icon contrast needs setting.
        (context as? Activity)?.window?.let { window ->
            WindowCompat.getInsetsController(window, window.decorView)
                .isAppearanceLightStatusBars = !darkTheme
        }
    }

    MaterialTheme(colorScheme = colors, typography = AppTypography, content = content)
}
