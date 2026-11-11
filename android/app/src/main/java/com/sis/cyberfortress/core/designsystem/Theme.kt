package com.sis.cyberfortress.core.designsystem

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.ColorScheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

// Official SIS CYBER FORTRESS SOC Palette
val DeepNavy = Color(0xFF101C2C)
val MidnightBlue = Color(0xFF17283B)
val Charcoal = Color(0xFF202B36)
val CardBackground = Color(0xFF152232)
val SecurityTeal = Color(0xFF20BFA9)
val CyanAccent = Color(0xFF32C5DD)
val SoftWhite = Color(0xFFF5F7FA)
val MutedGray = Color(0xFF94A3B8)
val DarkBorder = Color(0xFF2D3C4D)

// Status Colors
val StatusCritical = Color(0xFFEF4444) // Red
val StatusHigh = Color(0xFFF97316)     // Orange
val StatusMedium = Color(0xFFF59E0B)   // Amber
val StatusLow = Color(0xFF3B82F6)      // Blue
val StatusSuccess = Color(0xFF10B981)  // Emerald

private val DarkColorScheme = darkColorScheme(
    primary = SecurityTeal,
    onPrimary = DeepNavy,
    primaryContainer = MidnightBlue,
    onPrimaryContainer = CyanAccent,
    secondary = CyanAccent,
    onSecondary = DeepNavy,
    background = DeepNavy,
    onBackground = SoftWhite,
    surface = MidnightBlue,
    onSurface = SoftWhite,
    surfaceVariant = Charcoal,
    onSurfaceVariant = MutedGray,
    outline = DarkBorder,
    error = StatusCritical,
    onError = SoftWhite
)

private val LightColorScheme = lightColorScheme(
    primary = SecurityTeal,
    onPrimary = Color.White,
    primaryContainer = Color(0xFFE0F7F4),
    onPrimaryContainer = Color(0xFF0D524A),
    secondary = CyanAccent,
    onSecondary = Color.White,
    background = Color(0xFFF8FAFC),
    onBackground = Color(0xFF0F172A),
    surface = Color.White,
    onSurface = Color(0xFF0F172A),
    surfaceVariant = Color(0xFFF1F5F9),
    onSurfaceVariant = Color(0xFF64748B),
    outline = Color(0xFFCBD5E1),
    error = StatusCritical,
    onError = Color.White
)

@Composable
fun SISCyberFortressTheme(
    darkTheme: Boolean = true, // SOC command center defaults to dark theme
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as? Activity)?.window
            window?.let {
                it.statusBarColor = DeepNavy.toArgb()
                it.navigationBarColor = DeepNavy.toArgb()
                WindowCompat.getInsetsController(it, view).isAppearanceLightStatusBars = false
                WindowCompat.getInsetsController(it, view).isAppearanceLightNavigationBars = false
            }
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}
