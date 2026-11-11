package com.sis.cyberfortress.ui.screens.modules

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.Text
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

data class MonitoredDomain(
    val domain: String,
    val sslExpiryDays: Int,
    val status: String,
    val grade: String
)

@Composable
fun WebShieldScreen(onBackClick: () -> Unit) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()

    var domains by remember {
        mutableStateOf(
            listOf(
                MonitoredDomain("cyberfortress.internal", 184, "HEALTHY", "A+"),
                MonitoredDomain("api.cyberfortress.io", 42, "HEALTHY", "A+"),
                MonitoredDomain("auth.cyberfortress-cloud.com", 14, "WARNING", "B"),
                MonitoredDomain("partner-portal.cyberfortress.net", 92, "HEALTHY", "A")
            )
        )
    }
    var isChecking by remember { mutableStateOf(false) }

    fun refreshWebShield() {
        isChecking = true
        coroutineScope.launch {
            delay(1100)
            isChecking = false
            Toast.makeText(context, "SSL & Security Header checks updated.", Toast.LENGTH_SHORT).show()
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepNavy)
    ) {
        CyberTopAppBar(
            title = "Web Shield [M07]",
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
                        text = "ORGANIZATION DOMAIN & TLS SHIELD",
                        color = SoftWhite,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Continuous monitoring of enterprise external perimeter, SSL/TLS certificate chains, and HSTS/CSP compliance.",
                        color = MutedGray,
                        fontSize = 11.sp
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    CyberButton(
                        text = if (isChecking) "CHECKING CERTIFICATES..." else "AUDIT PERIMETER",
                        onClick = { refreshWebShield() },
                        isLoading = isChecking,
                        icon = Icons.Default.Language
                    )
                }
            }

            item {
                Text(
                    text = "MONITORED WEB DOMAINS (${domains.size})",
                    color = MutedGray,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold
                )
            }

            items(domains) { item ->
                CyberCard(borderColor = if (item.sslExpiryDays < 30) StatusMedium else DarkBorder) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = item.domain,
                                color = SoftWhite,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                fontFamily = FontFamily.Monospace
                            )
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = "SSL Expiry: in ${item.sslExpiryDays} days • Grade ${item.grade}",
                                color = if (item.sslExpiryDays < 30) StatusMedium else MutedGray,
                                fontSize = 11.sp
                            )
                        }
                        StatusBadge(status = item.status)
                    }
                }
            }
        }
    }
}
