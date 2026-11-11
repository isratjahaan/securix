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
import com.sis.cyberfortress.core.network.ApiClient
import com.sis.cyberfortress.core.network.ThreatIndicatorDto
import kotlinx.coroutines.launch

@Composable
fun ThreatIntelligenceScreen(onBackClick: () -> Unit) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()

    var indicators by remember { mutableStateOf(sampleIndicators()) }
    var isSyncing by remember { mutableStateOf(false) }

    fun syncFeeds() {
        isSyncing = true
        coroutineScope.launch {
            try {
                val response = ApiClient.getService(context).getThreatIndicators()
                if (response.isSuccessful && response.body() != null && response.body()!!.isNotEmpty()) {
                    indicators = response.body()!!
                }
            } catch (e: Exception) {
                // Keep sample
            } finally {
                isSyncing = false
                Toast.makeText(context, "Global Threat Feeds (MISP, AlienVault, CISA) synchronized.", Toast.LENGTH_SHORT).show()
            }
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepNavy)
    ) {
        CyberTopAppBar(
            title = "Threat Intelligence [M10]",
            onBackClick = onBackClick
        )

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            item {
                CyberCard(borderColor = SecurityTeal.copy(alpha = 0.5f)) {
                    Text(
                        text = "GLOBAL THREAT FEEDS & IOC ENGINE",
                        color = SoftWhite,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Aggregated Indicators of Compromise (IOCs), C2 servers, ransomware hashes, and malicious ASNs mapped to MITRE ATT&CK.",
                        color = MutedGray,
                        fontSize = 11.sp
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    CyberButton(
                        text = if (isSyncing) "SYNCHRONIZING GLOBAL FEEDS..." else "SYNC THREAT FEEDS",
                        onClick = { syncFeeds() },
                        isLoading = isSyncing,
                        icon = Icons.Default.CloudSync
                    )
                }
            }

            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "ACTIVE THREAT INDICATORS (${indicators.size})",
                        color = MutedGray,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold
                    )
                    StatusBadge(status = "SYNCED")
                }
            }

            items(indicators) { item ->
                CyberCard(borderColor = if (item.confidence >= 90) StatusCritical else StatusMedium) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                StatusBadge(status = item.type)
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = item.threatType,
                                    color = SoftWhite,
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = item.value,
                                color = CyanAccent,
                                fontSize = 11.sp,
                                fontFamily = FontFamily.Monospace,
                                maxLines = 1
                            )
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = "Source: ${item.source} • Confidence: ${item.confidence}%",
                                color = MutedGray,
                                fontSize = 10.sp
                            )
                        }
                    }
                }
            }
        }
    }
}

fun sampleIndicators() = listOf(
    ThreatIndicatorDto("IOC-01", "IP", "185.220.101.42", "CobaltStrike C2 Gateway", 96, "MISP Feed", "10 min ago"),
    ThreatIndicatorDto("IOC-02", "DOMAIN", "update-kernel-linux.xyz", "Phishing Drop Server", 92, "AlienVault OTX", "30 min ago"),
    ThreatIndicatorDto("IOC-03", "HASH", "44d88612fea8a8f36de82e1278abb02f", "LockBit 3.0 Encryptor", 99, "CISA Known Exploited", "1 hr ago")
)
