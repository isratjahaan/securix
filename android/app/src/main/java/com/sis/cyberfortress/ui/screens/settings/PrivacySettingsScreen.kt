package com.sis.cyberfortress.ui.screens.settings

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.PrivacyTip
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sis.cyberfortress.core.designsystem.*

@Composable
fun PrivacySettingsScreen(onBackClick: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepNavy)
    ) {
        CyberTopAppBar(
            title = "Privacy & Disclosures",
            onBackClick = onBackClick
        )

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            item {
                CyberCard(borderColor = SecurityTeal) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.PrivacyTip,
                            contentDescription = null,
                            tint = SecurityTeal,
                            modifier = Modifier.size(32.dp)
                        )
                        Column {
                            Text(
                                text = "ZERO-KNOWLEDGE PRIVACY CHARTER",
                                color = SoftWhite,
                                fontSize = 13.sp,
                                fontWeight = androidx.compose.ui.text.font.FontWeight.Bold
                            )
                            Text(
                                text = "SIS CYBER FORTRESS operates under strict Zero-Knowledge principles. Plaintext passwords, private encryption keys, and confidential vault data are NEVER transmitted, decrypted, or logged by the backend or central administrators.",
                                color = MutedGray,
                                fontSize = 11.sp,
                                lineHeight = 15.sp
                            )
                        }
                    }
                }
            }

            item {
                CyberCard {
                    Text(
                        text = "Authorized Scope & Telemetry",
                        color = SoftWhite,
                        fontSize = 13.sp,
                        fontWeight = androidx.compose.ui.text.font.FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "All security assessments, packet integrity audits, and port health scans are strictly confined to authorized enterprise assets and user-owned mobile nodes. No external or unauthorized probing is ever conducted.",
                        color = MutedGray,
                        fontSize = 11.sp,
                        lineHeight = 15.sp
                    )
                }
            }

            item {
                CyberCard {
                    Text(
                        text = "Local Enclave Key Storage",
                        color = SoftWhite,
                        fontSize = 13.sp,
                        fontWeight = androidx.compose.ui.text.font.FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Cryptographic keys generated on this device reside exclusively in the Android Hardware Keystore StrongBox / TEE enclave and never leave this physical hardware boundary.",
                        color = MutedGray,
                        fontSize = 11.sp,
                        lineHeight = 15.sp
                    )
                }
            }
        }
    }
}
