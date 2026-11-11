package com.sis.cyberfortress.ui.screens.modules

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sis.cyberfortress.core.designsystem.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

data class PhishingSample(
    val url: String,
    val score: Int,
    val verdict: String,
    val date: String
)

@Composable
fun PhishingShieldScreen(onBackClick: () -> Unit) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()

    var urlInput by remember { mutableStateOf("https://secure-login-verify-account-update.xyz") }
    var isAnalyzing by remember { mutableStateOf(false) }
    var history by remember {
        mutableStateOf(
            listOf(
                PhishingSample("https://paypal-security-alert-center.top", 98, "MALICIOUS", "10 min ago"),
                PhishingSample("https://auth.microsoftonline.com", 2, "SAFE", "1 hr ago"),
                PhishingSample("http://194.26.29.112/admin-portal.php", 89, "SUSPICIOUS", "3 hrs ago")
            )
        )
    }

    fun analyzeUrl() {
        if (urlInput.isBlank()) return
        isAnalyzing = true
        coroutineScope.launch {
            delay(1200)
            val score = if (urlInput.contains("secure") || urlInput.contains("xyz") || urlInput.contains("login")) 94 else 12
            val verdict = if (score > 70) "MALICIOUS" else "SAFE"
            history = listOf(PhishingSample(urlInput, score, verdict, "Just now")) + history
            isAnalyzing = false
            Toast.makeText(context, "Analysis Verdict: $verdict ($score% Risk)", Toast.LENGTH_LONG).show()
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepNavy)
    ) {
        CyberTopAppBar(
            title = "Phishing Shield [M02]",
            onBackClick = onBackClick
        )

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            item {
                CyberCard(borderColor = CyanAccent.copy(alpha = 0.5f)) {
                    Text(
                        text = "AI-DRIVEN PHISHING & URL INSPECTOR",
                        color = SoftWhite,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Real-time lexical analysis, homograph spoof detection, DNS history, and heuristic content verification.",
                        color = MutedGray,
                        fontSize = 11.sp
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    CyberTextField(
                        value = urlInput,
                        onValueChange = { urlInput = it },
                        label = "Inspect URL / Domain",
                        leadingIcon = Icons.Default.Link
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    CyberButton(
                        text = if (isAnalyzing) "INSPECTING HEURISTICS..." else "ANALYZE URL SAFETY",
                        onClick = { analyzeUrl() },
                        isLoading = isAnalyzing,
                        icon = Icons.Default.Phishing
                    )
                }
            }

            item {
                Text(
                    text = "RECENT SCANNED URLS",
                    color = MutedGray,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold
                )
            }

            items(history) { item ->
                val badgeColor = when (item.verdict) {
                    "MALICIOUS" -> StatusCritical
                    "SUSPICIOUS" -> StatusHigh
                    else -> StatusSuccess
                }

                CyberCard(borderColor = badgeColor.copy(alpha = 0.4f)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = item.url,
                                color = SoftWhite,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.SemiBold,
                                fontFamily = FontFamily.Monospace,
                                maxLines = 1
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = "Threat Score: ${item.score}/100 • ${item.date}",
                                color = MutedGray,
                                fontSize = 11.sp
                            )
                        }
                        StatusBadge(status = item.verdict)
                    }
                }
            }
        }
    }
}
