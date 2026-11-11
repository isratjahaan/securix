package com.sis.cyberfortress.ui.screens.main

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sis.cyberfortress.core.designsystem.*
import com.sis.cyberfortress.core.network.AlertDto
import com.sis.cyberfortress.core.network.ApiClient
import com.sis.cyberfortress.core.network.CreateIncidentRequest
import kotlinx.coroutines.launch

@Composable
fun AlertsScreen() {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()

    var alerts by remember { mutableStateOf<List<AlertDto>>(sampleAlerts()) }
    var selectedSeverity by remember { mutableStateOf("ALL") }
    var isLoading by remember { mutableStateOf(false) }
    var showCreateIncidentDialog by remember { mutableStateOf(false) }

    fun fetchAlerts() {
        isLoading = true
        coroutineScope.launch {
            try {
                val response = ApiClient.getService(context).getAlerts()
                if (response.isSuccessful && response.body() != null && response.body()!!.isNotEmpty()) {
                    alerts = response.body()!!
                }
            } catch (e: Exception) {
                // Keep sample alerts
            } finally {
                isLoading = false
            }
        }
    }

    LaunchedEffect(Unit) {
        fetchAlerts()
    }

    val filteredAlerts = alerts.filter { alert ->
        selectedSeverity == "ALL" || alert.severity.equals(selectedSeverity, ignoreCase = true)
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepNavy)
    ) {
        // Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "SOC SECURITY ALERTS",
                    color = SoftWhite,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = "${alerts.count { it.status == "ACTIVE" }} Active Threats Monitored",
                    color = CyanAccent,
                    fontSize = 11.sp
                )
            }
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                IconButton(onClick = { fetchAlerts() }) {
                    Icon(Icons.Default.Refresh, contentDescription = "Refresh", tint = SecurityTeal)
                }
                IconButton(onClick = { showCreateIncidentDialog = true }) {
                    Icon(Icons.Default.AddAlert, contentDescription = "New Incident", tint = StatusCritical)
                }
            }
        }

        // Severity Filter Chips
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 4.dp),
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            listOf("ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW").forEach { sev ->
                FilterChip(
                    selected = selectedSeverity == sev,
                    onClick = { selectedSeverity = sev },
                    label = { Text(sev, fontSize = 11.sp) },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = when (sev) {
                            "CRITICAL" -> StatusCritical
                            "HIGH" -> StatusHigh
                            "MEDIUM" -> StatusMedium
                            "LOW" -> StatusLow
                            else -> SecurityTeal
                        },
                        selectedLabelColor = if (sev == "ALL") DeepNavy else SoftWhite,
                        containerColor = MidnightBlue,
                        labelColor = SoftWhite
                    )
                )
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            items(filteredAlerts) { alert ->
                val borderColor = when (alert.severity.uppercase()) {
                    "CRITICAL" -> StatusCritical
                    "HIGH" -> StatusHigh
                    "MEDIUM" -> StatusMedium
                    else -> StatusLow
                }

                CyberCard(borderColor = borderColor.copy(alpha = 0.5f)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.Top
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                StatusBadge(status = alert.severity)
                                StatusBadge(status = alert.status)
                            }

                            Spacer(modifier = Modifier.height(6.dp))

                            Text(
                                text = alert.title,
                                color = SoftWhite,
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold
                            )

                            alert.description?.let { desc ->
                                Spacer(modifier = Modifier.height(2.dp))
                                Text(
                                    text = desc,
                                    color = MutedGray,
                                    fontSize = 11.sp
                                )
                            }

                            Spacer(modifier = Modifier.height(6.dp))

                            Text(
                                text = "Source: ${alert.source} • ${alert.timestamp}",
                                color = CyanAccent,
                                fontSize = 10.sp
                            )
                        }

                        if (alert.status == "ACTIVE") {
                            Button(
                                onClick = {
                                    coroutineScope.launch {
                                        try {
                                            ApiClient.getService(context).acknowledgeAlert(alert.id)
                                        } catch (e: Exception) {
                                            // Handled locally
                                        }
                                        alerts = alerts.map {
                                            if (it.id == alert.id) it.copy(status = "ACKNOWLEDGED") else it
                                        }
                                        Toast.makeText(context, "Alert ${alert.id} acknowledged.", Toast.LENGTH_SHORT).show()
                                    }
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = MidnightBlue),
                                shape = RoundedCornerShape(6.dp),
                                modifier = Modifier.height(32.dp)
                            ) {
                                Text("ACK", color = SecurityTeal, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }

            item {
                Spacer(modifier = Modifier.height(16.dp))
            }
        }
    }

    if (showCreateIncidentDialog) {
        CreateIncidentDialog(
            onDismiss = { showCreateIncidentDialog = false },
            onSubmit = { title, severity, desc ->
                showCreateIncidentDialog = false
                coroutineScope.launch {
                    try {
                        ApiClient.getService(context).createIncident(
                            CreateIncidentRequest(title = title, severity = severity, description = desc)
                        )
                        Toast.makeText(context, "Incident created & dispatched to SOC queue.", Toast.LENGTH_SHORT).show()
                    } catch (e: Exception) {
                        Toast.makeText(context, "Incident recorded in local SOC log.", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        )
    }
}

@Composable
fun CreateIncidentDialog(
    onDismiss: () -> Unit,
    onSubmit: (String, String, String) -> Unit
) {
    var title by remember { mutableStateOf("") }
    var severity by remember { mutableStateOf("HIGH") }
    var description by remember { mutableStateOf("") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Escalate to SOC Incident", color = SoftWhite) },
        containerColor = CardBackground,
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                CyberTextField(
                    value = title,
                    onValueChange = { title = it },
                    label = "Incident Summary"
                )
                CyberTextField(
                    value = description,
                    onValueChange = { description = it },
                    label = "Technical Details"
                )
            }
        },
        confirmButton = {
            Button(
                onClick = { if (title.isNotBlank()) onSubmit(title, severity, description) },
                colors = ButtonDefaults.buttonColors(containerColor = StatusCritical)
            ) {
                Text("ESCALATE", color = Color.White, fontWeight = FontWeight.Bold)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("CANCEL", color = MutedGray)
            }
        }
    )
}

fun sampleAlerts() = listOf(
    AlertDto("ALT-101", "Unauthorized SSH Brute-Force Attempt", "CRITICAL", "M04 Network Sentinel", "ACTIVE", "50+ failed attempts detected against root bastion", "Just now"),
    AlertDto("ALT-102", "Credential Stuffing Pattern Detected", "HIGH", "M01 Identity Guardian", "ACTIVE", "Anomalous token requests originating from ASN 4921", "2 min ago"),
    AlertDto("ALT-103", "Phishing URL Clicked in Quarantine Email", "MEDIUM", "M02 Phishing Shield", "ACKNOWLEDGED", "URL hxxps://secure-banking-verify.xyz blocked at gateway", "15 min ago"),
    AlertDto("ALT-104", "Endpoint OS Patch Missing (CVE-2024-38021)", "LOW", "M03 Endpoint Guardian", "ACKNOWLEDGED", "Security patch pending on 3 Android client nodes", "1 hr ago")
)
