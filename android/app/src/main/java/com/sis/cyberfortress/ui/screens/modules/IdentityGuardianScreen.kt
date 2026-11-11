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
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

data class BreachRecord(
    val breachSource: String,
    val exposedData: String,
    val date: String,
    val severity: String
)

@Composable
fun IdentityGuardianScreen(onBackClick: () -> Unit) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()

    var emailToScan by remember { mutableStateOf("admin@cyberfortress.io") }
    var isScanning by remember { mutableStateOf(false) }
    var breachRecords by remember {
        mutableStateOf(
            listOf(
                BreachRecord("Collection #1 Paste Dump", "Email, Salted SHA1 Password", "2024-03-12", "HIGH"),
                BreachRecord("Corporate Partner Breach", "Email, Full Name, Title", "2023-11-28", "LOW")
            )
        )
    }

    fun executeBreachScan() {
        if (emailToScan.isBlank()) return
        isScanning = true
        coroutineScope.launch {
            delay(1500)
            isScanning = false
            Toast.makeText(context, "Dark Web Intelligence scan completed for $emailToScan", Toast.LENGTH_SHORT).show()
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepNavy)
    ) {
        CyberTopAppBar(
            title = "Identity Guardian [M01]",
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
                        text = "DARK WEB & CREDENTIAL LEAK SCANNER",
                        color = SoftWhite,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Continuously cross-references corporate identities against dark web dumps, telegram markets, and paste sites.",
                        color = MutedGray,
                        fontSize = 11.sp
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    CyberTextField(
                        value = emailToScan,
                        onValueChange = { emailToScan = it },
                        label = "Identity / Email Address",
                        leadingIcon = Icons.Default.Email
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    CyberButton(
                        text = if (isScanning) "CROSS-REFERENCING FEEDS..." else "CHECK EXPOSURE",
                        onClick = { executeBreachScan() },
                        isLoading = isScanning,
                        icon = Icons.Default.Radar
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
                        text = "RECORDED EXPOSURES (${breachRecords.size})",
                        color = MutedGray,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold
                    )
                    StatusBadge(status = "ACTIVE DEFENSE")
                }
            }

            items(breachRecords) { record ->
                CyberCard(borderColor = if (record.severity == "HIGH") StatusHigh else StatusLow) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.Top
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = record.breachSource,
                                color = SoftWhite,
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = "Exposed Data: ${record.exposedData}",
                                color = MutedGray,
                                fontSize = 11.sp
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = "Detected: ${record.date}",
                                color = CyanAccent,
                                fontSize = 10.sp,
                                fontFamily = FontFamily.Monospace
                            )
                        }
                        StatusBadge(status = record.severity)
                    }
                }
            }
        }
    }
}
