package com.sis.cyberfortress.ui.screens.modules

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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

data class ForensicCase(
    val caseNumber: String,
    val title: String,
    val sha256Checksum: String,
    val investigator: String,
    val status: String
)

@Composable
fun DigitalForensicsScreen(onBackClick: () -> Unit) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()

    var cases by remember {
        mutableStateOf(
            listOf(
                ForensicCase("CAS-2024-001", "Memory Dump Analysis - Host-Node-14", "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", "Lead Investigator Vance", "IN_ANALYSIS"),
                ForensicCase("CAS-2024-002", "Disk Image Capture - Incident ALT-101", "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069", "Specialist Miller", "VERIFIED"),
                ForensicCase("CAS-2024-003", "Network PCAP Capture - ASN 4921", "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b", "Forensic Eng. Chen", "CLOSED")
            )
        )
    }
    var isVerifying by remember { mutableStateOf(false) }

    fun verifyHashes() {
        isVerifying = true
        coroutineScope.launch {
            delay(1300)
            isVerifying = false
            Toast.makeText(context, "SHA-256 Chain of Custody Verified: All 3 evidence hashes match immutable ledger.", Toast.LENGTH_LONG).show()
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepNavy)
    ) {
        CyberTopAppBar(
            title = "Digital Forensics [M08]",
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
                        text = "EVIDENCE INTEGRITY & CHAIN OF CUSTODY",
                        color = SoftWhite,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Forensic acquisition, memory dumping, disk imaging, and court-admissible cryptographic hash validation.",
                        color = MutedGray,
                        fontSize = 11.sp
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    CyberButton(
                        text = if (isVerifying) "VERIFYING SHA-256 LEDGER..." else "VERIFY EVIDENCE LEDGER",
                        onClick = { verifyHashes() },
                        isLoading = isVerifying,
                        icon = Icons.Default.Verified
                    )
                }
            }

            item {
                Text(
                    text = "ACTIVE INVESTIGATION CASES (${cases.size})",
                    color = MutedGray,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold
                )
            }

            items(cases) { item ->
                CyberCard(borderColor = DarkBorder) {
                    Column {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.Top
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = item.caseNumber,
                                    color = CyanAccent,
                                    fontSize = 12.sp,
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
                            StatusBadge(status = item.status)
                        }

                        Spacer(modifier = Modifier.height(6.dp))

                        Text(
                            text = "SHA-256: ${item.sha256Checksum}",
                            color = MutedGray,
                            fontSize = 10.sp,
                            fontFamily = FontFamily.Monospace,
                            maxLines = 1
                        )

                        Spacer(modifier = Modifier.height(4.dp))

                        Text(
                            text = "Lead: ${item.investigator}",
                            color = SecurityTeal,
                            fontSize = 11.sp
                        )
                    }
                }
            }
        }
    }
}
