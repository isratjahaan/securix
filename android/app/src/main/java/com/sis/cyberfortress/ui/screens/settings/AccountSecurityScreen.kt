package com.sis.cyberfortress.ui.screens.settings

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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sis.cyberfortress.core.datastore.SessionManager
import com.sis.cyberfortress.core.designsystem.*
import com.sis.cyberfortress.core.security.BiometricHelper

@Composable
fun AccountSecurityScreen(onBackClick: () -> Unit) {
    val context = LocalContext.current
    val sessionManager = remember { SessionManager.getInstance(context) }
    val biometricHelper = remember { BiometricHelper(context) }

    var isBiometricEnabled by remember { mutableStateOf(sessionManager.isBiometricEnabled) }
    var isBiometricSupported by remember { mutableStateOf(biometricHelper.isBiometricAvailable()) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepNavy)
    ) {
        CyberTopAppBar(
            title = "Account Security",
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
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "BIOMETRIC AUTHENTICATION",
                                color = SoftWhite,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = if (isBiometricSupported) "Use Android Fingerprint / Face Unlock for fast privilege elevation." else "Biometric hardware not available on current runtime.",
                                color = MutedGray,
                                fontSize = 11.sp
                            )
                        }

                        Switch(
                            checked = isBiometricEnabled,
                            onCheckedChange = { checked ->
                                isBiometricEnabled = checked
                                sessionManager.isBiometricEnabled = checked
                                Toast.makeText(context, if (checked) "Biometric Lock enabled." else "Biometric Lock disabled.", Toast.LENGTH_SHORT).show()
                            },
                            colors = SwitchDefaults.colors(
                                checkedThumbColor = DeepNavy,
                                checkedTrackColor = SecurityTeal
                            )
                        )
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
                            Text("Two-Factor Authentication (MFA)", color = SoftWhite, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                            Text("TOTP Authenticator & Hardware FIDO2 keys", color = MutedGray, fontSize = 11.sp)
                        }
                        StatusBadge(status = "ENFORCED")
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
                            Text("Hardware Android Keystore", color = SoftWhite, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                            Text("Master key protected by hardware TEE coprocessor", color = CyanAccent, fontSize = 11.sp)
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
                            Text("Inactivity Auto-Lock Timeout", color = SoftWhite, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                            Text("Lock command session after 15 minutes", color = MutedGray, fontSize = 11.sp)
                        }
                        StatusBadge(status = "15 MIN")
                    }
                }
            }
        }
    }
}
