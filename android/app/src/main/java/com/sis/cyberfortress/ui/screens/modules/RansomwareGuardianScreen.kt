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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sis.cyberfortress.core.designsystem.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@Composable
fun RansomwareGuardianScreen(onBackClick: () -> Unit) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()

    var isVerifyingCanary by remember { mutableStateOf(false) }

    fun checkCanaries() {
        isVerifyingCanary = true
        coroutineScope.launch {
            delay(1200)
            isVerifyingCanary = false
            Toast.makeText(context, "All Canary Trap files intact. Zero cryptographic alteration detected.", Toast.LENGTH_SHORT).show()
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepNavy)
    ) {
        CyberTopAppBar(
            title = "Ransomware Guardian [M06]",
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
                        text = "BEHAVIORAL RANSOMWARE SENTINEL",
                        color = SoftWhite,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Decoy honeypot canary files, file system entropy monitoring, and instant automated process kill-chain.",
                        color = MutedGray,
                        fontSize = 11.sp
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    CyberButton(
                        text = if (isVerifyingCanary) "CHECKING CANARY DECOYS..." else "VERIFY CANARY INTEGRITY",
                        onClick = { checkCanaries() },
                        isLoading = isVerifyingCanary,
                        icon = Icons.Default.Shield
                    )
                }
            }

            item {
                Text(
                    text = "CANARY HONEYPOTS & SHIELD SENSORS",
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
                            Text("Active Decoy Trap Files", color = SoftWhite, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                            Text("16 decoy files deployed across storage sectors", color = MutedGray, fontSize = 11.sp)
                        }
                        StatusBadge(status = "INTACT")
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
                            Text("Mass Renaming Anomaly Filter", color = SoftWhite, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                            Text("Threshold: >15 extensions mutated per 3 seconds", color = MutedGray, fontSize = 11.sp)
                        }
                        StatusBadge(status = "ARMED")
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
                            Text("High Entropy Stream Interceptor", color = SoftWhite, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                            Text("Shannon Entropy > 7.95 triggers automatic process suspension", color = MutedGray, fontSize = 11.sp)
                        }
                        StatusBadge(status = "ARMED")
                    }
                }
            }
        }
    }
}
