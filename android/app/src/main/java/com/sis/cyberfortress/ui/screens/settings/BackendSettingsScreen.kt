package com.sis.cyberfortress.ui.screens.settings

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
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
import com.sis.cyberfortress.core.datastore.SessionManager
import com.sis.cyberfortress.core.designsystem.*
import com.sis.cyberfortress.core.network.ApiClient
import com.sis.cyberfortress.core.network.SystemHealthDto
import kotlinx.coroutines.launch

@Composable
fun BackendSettingsScreen(onBackClick: () -> Unit) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    val sessionManager = remember { SessionManager.getInstance(context) }

    var urlInput by remember { mutableStateOf(sessionManager.backendUrl) }
    var isPinging by remember { mutableStateOf(false) }
    var healthInfo by remember { mutableStateOf<SystemHealthDto?>(null) }
    var pingError by remember { mutableStateOf<String?>(null) }

    fun pingBackend() {
        isPinging = true
        pingError = null
        healthInfo = null

        coroutineScope.launch {
            try {
                val start = System.currentTimeMillis()
                val response = ApiClient.getService(context).getSystemHealth()
                val latency = (System.currentTimeMillis() - start).toInt()

                if (response.isSuccessful && response.body() != null) {
                    healthInfo = response.body()!!.copy(apiLatencyMs = latency)
                    Toast.makeText(context, "Backend Connected! Latency: ${latency}ms", Toast.LENGTH_SHORT).show()
                } else {
                    pingError = "Backend reachable but returned HTTP ${response.code()}"
                }
            } catch (e: Exception) {
                pingError = "Connection failed: ${e.message}"
            } finally {
                isPinging = false
            }
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepNavy)
    ) {
        CyberTopAppBar(
            title = "Backend & Diagnostics",
            onBackClick = onBackClick
        )

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            CyberCard(borderColor = CyanAccent.copy(alpha = 0.5f)) {
                Text(
                    text = "BACKEND API ENDPOINT CONFIGURATION",
                    color = SoftWhite,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "Select or enter the NestJS backend API root URL. Android emulator accesses host on 10.0.2.2:4000/api/",
                    color = MutedGray,
                    fontSize = 11.sp
                )

                Spacer(modifier = Modifier.height(14.dp))

                CyberTextField(
                    value = urlInput,
                    onValueChange = { urlInput = it },
                    label = "API Base URL",
                    leadingIcon = Icons.Default.SettingsEthernet
                )

                Spacer(modifier = Modifier.height(12.dp))

                // Presets
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Button(
                        onClick = {
                            urlInput = SessionManager.DEFAULT_BASE_URL
                            sessionManager.backendUrl = urlInput
                            Toast.makeText(context, "Set to Emulator Host (10.0.2.2:4000)", Toast.LENGTH_SHORT).show()
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = MidnightBlue),
                        modifier = Modifier.weight(1f).height(36.dp)
                    ) {
                        Text("10.0.2.2:4000", color = SecurityTeal, fontSize = 10.sp, fontFamily = FontFamily.Monospace)
                    }

                    Button(
                        onClick = {
                            urlInput = SessionManager.LOCALHOST_BASE_URL
                            sessionManager.backendUrl = urlInput
                            Toast.makeText(context, "Set to Localhost:4000", Toast.LENGTH_SHORT).show()
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = MidnightBlue),
                        modifier = Modifier.weight(1f).height(36.dp)
                    ) {
                        Text("localhost:4000", color = CyanAccent, fontSize = 10.sp, fontFamily = FontFamily.Monospace)
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                CyberButton(
                    text = "SAVE ENDPOINT URL",
                    onClick = {
                        sessionManager.backendUrl = urlInput.trim()
                        Toast.makeText(context, "Endpoint saved: ${sessionManager.backendUrl}", Toast.LENGTH_SHORT).show()
                    },
                    icon = Icons.Default.Save
                )
            }

            // Diagnostics & Ping Card
            CyberCard(borderColor = SecurityTeal.copy(alpha = 0.5f)) {
                Text(
                    text = "LIVE BACKEND DIAGNOSTICS",
                    color = SoftWhite,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.height(10.dp))

                CyberButton(
                    text = if (isPinging) "PROBING BACKEND HEALTH..." else "PING BACKEND DIAGNOSTICS",
                    onClick = { pingBackend() },
                    isLoading = isPinging,
                    icon = Icons.Default.Speed
                )

                if (healthInfo != null) {
                    Spacer(modifier = Modifier.height(14.dp))
                    Text("SYSTEM TELEMETRY SUMMARY", color = SecurityTeal, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text("Status: ${healthInfo!!.status}", color = SoftWhite, fontSize = 12.sp)
                    Text("API Latency: ${healthInfo!!.apiLatencyMs} ms", color = CyanAccent, fontSize = 12.sp, fontFamily = FontFamily.Monospace)
                    Text("Database: ${healthInfo!!.database}", color = StatusSuccess, fontSize = 12.sp)
                    Text("Uptime: ${healthInfo!!.uptime} seconds", color = MutedGray, fontSize = 11.sp)
                }

                if (pingError != null) {
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = pingError!!,
                        color = StatusCritical,
                        fontSize = 12.sp
                    )
                }
            }
        }
    }
}
