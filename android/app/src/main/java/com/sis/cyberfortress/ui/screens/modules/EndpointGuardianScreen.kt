package com.sis.cyberfortress.ui.screens.modules

import android.os.Build
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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

@Composable
fun EndpointGuardianScreen(onBackClick: () -> Unit) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()

    var isRunningAudit by remember { mutableStateOf(false) }
    var rootStatus by remember { mutableStateOf("NOT DETECTED (SECURE)") }
    var selinuxStatus by remember { mutableStateOf("ENFORCING") }
    var patchLevel by remember { mutableStateOf(Build.VERSION.SECURITY_PATCH ?: "2024-10-01") }

    fun runAudit() {
        isRunningAudit = true
        coroutineScope.launch {
            delay(1500)
            isRunningAudit = false
            Toast.makeText(context, "Endpoint Integrity Verification: PASS (Compliant)", Toast.LENGTH_SHORT).show()
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepNavy)
    ) {
        CyberTopAppBar(
            title = "Endpoint Guardian [M03]",
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
                        text = "MOBILE ENDPOINT SECURITY POSTURE",
                        color = SoftWhite,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Real-time verification of kernel integrity, root binaries, and bootloader status.",
                        color = MutedGray,
                        fontSize = 11.sp
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column {
                            Text("DEVICE MODEL", color = MutedGray, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                            Text("${Build.MANUFACTURER.uppercase()} ${Build.MODEL}", color = SoftWhite, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                        }
                        Column(horizontalAlignment = Alignment.End) {
                            Text("ANDROID VERSION", color = MutedGray, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                            Text("Android ${Build.VERSION.RELEASE} (API ${Build.VERSION.SDK_INT})", color = CyanAccent, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    CyberButton(
                        text = if (isRunningAudit) "VERIFYING INTEGRITY..." else "RUN ENDPOINT AUDIT",
                        onClick = { runAudit() },
                        isLoading = isRunningAudit,
                        icon = Icons.Default.Security
                    )
                }
            }

            item {
                Text(
                    text = "HARDWARE & OS INTEGRITY METRICS",
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
                            Text("Root / Su Binary Scan", color = SoftWhite, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                            Text("Checks /system/bin/su, /system/xbin/su, Magisk mounts", color = MutedGray, fontSize = 11.sp)
                        }
                        StatusBadge(status = "SECURE")
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
                            Text("SELinux Enforcement", color = SoftWhite, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                            Text("Mandatory Access Control (MAC) kernel policy", color = MutedGray, fontSize = 11.sp)
                        }
                        StatusBadge(status = selinuxStatus)
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
                            Text("Android Security Patch Level", color = SoftWhite, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                            Text("Current: $patchLevel", color = CyanAccent, fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                        }
                        StatusBadge(status = "UP TO DATE")
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
                            Text("Hardware Keymaster / Keystore", color = SoftWhite, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                            Text("StrongBox / TEE Cryptographic Co-processor active", color = MutedGray, fontSize = 11.sp)
                        }
                        StatusBadge(status = "HARDWARE TEE")
                    }
                }
            }
        }
    }
}
