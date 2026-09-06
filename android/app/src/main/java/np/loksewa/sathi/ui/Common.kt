package np.loksewa.sathi.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp

@Composable
fun SectionLabel(text: String, modifier: Modifier = Modifier) {
    Text(
        text = text.uppercase(),
        style = MaterialTheme.typography.labelSmall,
        color = MaterialTheme.colorScheme.onSurfaceVariant,
        modifier = modifier.padding(bottom = 6.dp),
    )
}

@Composable
fun Pill(text: String, tone: PillTone = PillTone.Neutral) {
    val bg = when (tone) {
        PillTone.Neutral -> MaterialTheme.colorScheme.surfaceVariant
        PillTone.Accent -> MaterialTheme.colorScheme.primaryContainer
        PillTone.Good -> Color(0x2215803D)
        PillTone.Bad -> Color(0x22B91C1C)
    }
    val fg = when (tone) {
        PillTone.Neutral -> MaterialTheme.colorScheme.onSurfaceVariant
        PillTone.Accent -> MaterialTheme.colorScheme.onPrimaryContainer
        PillTone.Good -> Color(0xFF15803D)
        PillTone.Bad -> MaterialTheme.colorScheme.error
    }
    Box(
        Modifier
            .background(bg, RoundedCornerShape(999.dp))
            .padding(horizontal = 10.dp, vertical = 4.dp),
    ) {
        Text(text, style = MaterialTheme.typography.labelSmall, color = fg)
    }
}

enum class PillTone { Neutral, Accent, Good, Bad }

@Composable
fun StatTile(value: String, label: String, modifier: Modifier = Modifier, valueColor: Color? = null) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
    ) {
        Column(Modifier.padding(14.dp)) {
            Text(
                value,
                style = MaterialTheme.typography.headlineSmall,
                color = valueColor ?: MaterialTheme.colorScheme.onSurface,
            )
            Text(
                label,
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
    }
}

/** A left-ruled note. Tone maps to the same three kinds the lessons use. */
@Composable
fun Callout(tone: String, title: String?, body: String) {
    val accent = when (tone) {
        "tip" -> MaterialTheme.colorScheme.secondary
        "warn" -> Color(0xFFB45309)
        else -> MaterialTheme.colorScheme.primary
    }
    Row(
        Modifier
            .fillMaxWidth()
            .padding(vertical = 6.dp)
            .height(IntrinsicSize.Min)
            .background(accent.copy(alpha = 0.08f), RoundedCornerShape(4.dp, 10.dp, 10.dp, 4.dp)),
    ) {
        // The rule spans the callout's height, however tall the text runs.
        Box(
            Modifier
                .width(3.dp)
                .fillMaxHeight()
                .background(accent),
        )
        Column(Modifier.padding(12.dp)) {
            if (title != null) {
                Text(title, style = MaterialTheme.typography.labelLarge, color = accent)
            }
            Text(body, style = MaterialTheme.typography.bodyMedium)
        }
    }
}

@Composable
fun ProgressBar(fraction: Float, modifier: Modifier = Modifier) {
    LinearProgressIndicator(
        progress = { fraction.coerceIn(0f, 1f) },
        modifier = modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        trackColor = MaterialTheme.colorScheme.surfaceVariant,
    )
}

@Composable
fun EmptyState(icon: String, message: String) {
    Column(
        Modifier
            .fillMaxWidth()
            .padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        Text(icon, style = MaterialTheme.typography.headlineMedium)
        Text(
            message,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            textAlign = TextAlign.Center,
        )
    }
}
