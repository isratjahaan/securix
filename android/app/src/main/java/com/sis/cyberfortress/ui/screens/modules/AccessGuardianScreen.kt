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

data class ActiveSession(
    val sessionId: String,
    val userEmail: String,
    val ipAddress: String,
    val device: String,
    val mfaMethod: String
)

@Composable
fun AccessGuardianScreen(onBackClick: () -> Unit) {
    val context = LocalContext.current

    var sessions by remember {
        mutableStateOf(
            listOf(
                ActiveSession("SES-9912", "admin@cyberfortress.io", "10.0.2.16", "Android Mobile Client", "FIDO2 / Hardware Token"),
                ActiveSession("SES-9908", "soc-analyst-1@cyberfortress.io", "192.168.1.104", "Linux SOC Workstation", "TOTP Authenticator"),
                ActiveSession("SES-9892", "cloud-eng@cyberfortress.io", "172.16.4.55", "macOS Terminal", "WebAuthn Biometric")
            )
        )
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepNavy)
    ) {
        CyberTopAppBar(
            title = "Access Guardian [M09]",
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
                        text = "ZERO-TRUST ACCESS & PRIVILEGED SESSIONS",
                        color = SoftWhite,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Continuous context-aware evaluation of operator identity, device posture, location, and session risk scores.",
                        color = MutedGray,
                        fontSize = 11.sp
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
                        text = "AUTHENTICATED SESSIONS (${sessions.size})",
                        color = MutedGray,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold
                    )
                    StatusBadge(status = "ZERO-TRUST ENFORCED")
                }
            }

            items(sessions) { item ->
                CyberCard(borderColor = DarkBorder) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = item.userEmail,
                                color = SoftWhite,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = "${item.device} • ${item.ipAddress}",
                                color = CyanAccent,
                                fontSize = 11.sp,
                                fontFamily = FontFamily.Monospace
                            )
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = "MFA: ${item.mfaMethod}",
                                color = MutedGray,
                                fontSize = 10.sp
                            )
                        }

                        Button(
                            onClick = {
                                sessions = sessions.filter { it.sessionId != item.sessionId }
                                Toast.makeText(context, "Session ${item.sessionId} revoked immediately.", Toast.LENGTH_SHORT).show()
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = StatusCritical.copy(alpha = 0.2f)),
                            border = ButtonDefaults.outlinedButtonBorder().copy(brush = androidx.compose.ui.graphics.Brush.linearGradient(listOf(StatusCritical, StatusCritical))),
                            modifier = Modifier.height(32.dp)
                        ) {
                            Text("REVOKE", color = StatusCritical, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }
    }
}
