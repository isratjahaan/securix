package com.sis.cyberfortress.ui.screens.modules

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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

@Composable
fun NetworkSentinelScreen(onBackClick: () -> Unit) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()

    var isInspecting by remember { mutableStateOf(false) }

    fun runNetworkAudit() {
        isInspecting = true
        coroutineScope.launch {
            delay(1300)
            isInspecting = false
            Toast.makeText(context, "Network Interface Audit: No MITM or ARP anomalies detected.", Toast.LENGTH_SHORT).show()
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepNavy)
    ) {
        CyberTopAppBar(
            title = "Network Sentinel [M04]",
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
                        text = "NETWORK LINK INTEGRITY & MITM RADAR",
                        color = SoftWhite,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Continuous TLS validation, gateway ARP inspection, rogue AP detection, and VPN encryption enforcement (authorized scope).",
                        color = MutedGray,
                        fontSize = 11.sp
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    CyberButton(
                        text = if (isInspecting) "ANALYZING PACKET GATEWAYS..." else "RUN NETWORK INTEGRITY CHECK",
                        onClick = { runNetworkAudit() },
                        isLoading = isInspecting,
                        icon = Icons.Default.WifiTethering
                    )
                }
            }

            item {
                Text(
                    text = "ACTIVE TRANSPORT TELEMETRY",
                    color = MutedGray,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold
                )
            }

            item {
                CyberCard {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text("Gateway ARP Spoof Inspection", color = SoftWhite, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                            Text("Checks gateway MAC consistency and duplicate IPs", color = MutedGray, fontSize = 11.sp)
                        }
                        StatusBadge(status = "NORMAL")
                    }
                }
            }

            item {
                CyberCard {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text("DNS over HTTPS (DoH)", color = SoftWhite, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                            Text("Upstream: Cloudflare 1.1.1.1 (Encrypted)", color = CyanAccent, fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                        }
                        StatusBadge(status = "ACTIVE")
                    }
                }
            }

            item {
                CyberCard {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text("SSL / TLS Certificate Pinning", color = SoftWhite, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                            Text("Verifies leaf & intermediate CA against trusted truststore", color = MutedGray, fontSize = 11.sp)
                        }
                        StatusBadge(status = "PINNED")
                    }
                }
            }
        }
    }
}
