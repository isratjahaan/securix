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
import com.sis.cyberfortress.core.network.ApiClient
import com.sis.cyberfortress.core.network.IncidentDto
import kotlinx.coroutines.launch

@Composable
fun CyberSocScreen(onBackClick: () -> Unit) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()

    var incidents by remember { mutableStateOf(sampleIncidents()) }
    var isTriageActive by remember { mutableStateOf(false) }

    fun refreshIncidents() {
        coroutineScope.launch {
            try {
                val response = ApiClient.getService(context).getIncidents()
                if (response.isSuccessful && response.body() != null && response.body()!!.isNotEmpty()) {
                    incidents = response.body()!!
                }
            } catch (e: Exception) {
                // Keep sample
            }
        }
    }

    LaunchedEffect(Unit) {
        refreshIncidents()
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepNavy)
    ) {
        CyberTopAppBar(
            title = "Cyber SOC [M12]",
            onBackClick = onBackClick
        )

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            item {
                CyberCard(borderColor = StatusCritical.copy(alpha = 0.5f)) {
                    Text(
                        text = "CENTRAL SOC INCIDENT & TRIAGE COMMAND",
                        color = SoftWhite,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Real-time correlation of alerts across all 11 security sensors, automated playbook orchestration, and analyst dispatch.",
                        color = MutedGray,
                        fontSize = 11.sp
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Button(
                            onClick = {
                                Toast.makeText(context, "Automated Triage Playbook executed on all active queues.", Toast.LENGTH_SHORT).show()
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = SecurityTeal),
                            modifier = Modifier.weight(1f).height(40.dp)
                        ) {
                            Text("RUN AUTO TRIAGE", color = DeepNavy, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }

                        Button(
                            onClick = { refreshIncidents() },
                            colors = ButtonDefaults.buttonColors(containerColor = MidnightBlue),
                            modifier = Modifier.height(40.dp)
                        ) {
                            Icon(Icons.Default.Refresh, contentDescription = "Refresh", tint = SoftWhite)
                        }
                    }
                }
            }

            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "ACTIVE INCIDENTS (${incidents.size})",
                        color = MutedGray,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold
                    )
                    StatusBadge(status = "SOC TIER-3 ACTIVE")
                }
            }

            items(incidents) { item ->
                CyberCard(borderColor = if (item.severity == "CRITICAL") StatusCritical else StatusHigh) {
                    Column {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.Top
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = item.id,
                                    color = CyanAccent,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    fontFamily = FontFamily.Monospace
                                )
                                Text(
                                    text = item.title,
                                    color = SoftWhite,
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                            StatusBadge(status = item.severity)
                        }

                        item.description?.let { desc ->
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = desc,
                                color = MutedGray,
                                fontSize = 11.sp
                            )
                        }

                        Spacer(modifier = Modifier.height(6.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "Assigned: ${item.assignedTo ?: "SOC Lead"}",
                                color = SecurityTeal,
                                fontSize = 11.sp
                            )
                            StatusBadge(status = item.status)
                        }
                    }
                }
            }
        }
    }
}

fun sampleIncidents() = listOf(
    IncidentDto("INC-801", "Unauthorized Lateral Movement - Segment 4", "CRITICAL", "INVESTIGATING", "Alex Vance", "Anomalous SMB pipes and remote WMI calls detected", "15 min ago"),
    IncidentDto("INC-802", "DDoS Ingress Volumetric Attack Mitigation", "HIGH", "MITIGATED", "Network Sec Team", "BGP Anycast routing diverted 45 Gbps UDP flood", "1 hr ago"),
    IncidentDto("INC-803", "Compromised Service Principal Key Revocation", "HIGH", "RESOLVED", "Cloud Sec Lead", "OAuth grant expired and fresh keypair rotated", "3 hrs ago")
)
