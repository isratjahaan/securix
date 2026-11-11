package com.sis.cyberfortress.ui.screens.settings

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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sis.cyberfortress.core.designsystem.*

data class ComplianceReportItem(
    val code: String,
    val title: String,
    val standard: String,
    val scorePercent: Int,
    val status: String
)

@Composable
fun ReportsComplianceScreen(onBackClick: () -> Unit) {
    val context = LocalContext.current

    val reports = listOf(
        ComplianceReportItem("REP-SOC2", "SOC 2 Type II Security & Availability Audit", "AICPA Trust Services Criteria", 98, "COMPLIANT"),
        ComplianceReportItem("REP-ISO", "ISO/IEC 27001:2022 ISMS Controls Assessment", "ISO Standard Controls", 95, "CERTIFIED"),
        ComplianceReportItem("REP-NIST", "NIST Cybersecurity Framework (CSF 2.0)", "Identify, Protect, Detect, Respond, Recover", 92, "COMPLIANT"),
        ComplianceReportItem("REP-HIPAA", "HIPAA Security Rule Administrative & Technical Safeguards", "Health Insurance Portability & Accountability", 100, "AUDITED")
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepNavy)
    ) {
        CyberTopAppBar(
            title = "Compliance & Reports",
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
                        text = "CONTINUOUS REGULATORY COMPLIANCE",
                        color = SoftWhite,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Automated continuous evidence collection mapped to major cybersecurity frameworks with cryptographically signed audit logs.",
                        color = MutedGray,
                        fontSize = 11.sp
                    )
                }
            }

            item {
                Text(
                    text = "FRAMEWORK AUDIT ATTESTATIONS",
                    color = MutedGray,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold
                )
            }

            items(reports) { item ->
                CyberCard(borderColor = DarkBorder) {
                    Column {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.Top
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = item.title,
                                    color = SoftWhite,
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Bold
                                )
                                Spacer(modifier = Modifier.height(2.dp))
                                Text(
                                    text = item.standard,
                                    color = MutedGray,
                                    fontSize = 11.sp
                                )
                            }
                            StatusBadge(status = item.status)
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "Compliance Score: ${item.scorePercent}%",
                                color = SecurityTeal,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold
                            )

                            Button(
                                onClick = {
                                    Toast.makeText(context, "Exporting signed report (${item.code})...", Toast.LENGTH_SHORT).show()
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = MidnightBlue),
                                modifier = Modifier.height(32.dp)
                            ) {
                                Icon(Icons.Default.Download, contentDescription = "Export", tint = SecurityTeal, modifier = Modifier.size(14.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("EXPORT", color = SecurityTeal, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }
        }
    }
}
