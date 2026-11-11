package com.sis.cyberfortress.ui.screens.main

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sis.cyberfortress.core.designsystem.*

data class AuditLogEntry(
    val action: String,
    val actor: String,
    val module: String,
    val status: String,
    val timestamp: String,
    val icon: ImageVector
)

@Composable
fun ActivityLogScreen() {
    val auditLogs = listOf(
        AuditLogEntry("ADMIN_LOGIN_SUCCESS", "admin@cyberfortress.io", "AUTH_SVC", "SUCCESS", "Just now", Icons.Default.Login),
        AuditLogEntry("ENDPOINT_SCAN_TRIGGERED", "Android Client Pixel 8", "M03_ENDPOINT", "COMPLIANT", "3 min ago", Icons.Default.Security),
        AuditLogEntry("VAULT_CREDENTIAL_RETRIEVED", "zk-init-1 (AES-256)", "M05_VAULT", "DECRYPTED", "12 min ago", Icons.Default.Key),
        AuditLogEntry("THREAT_FEED_SYNC", "MISP / AlienVault OTX", "M10_INTEL", "SYNCED", "24 min ago", Icons.Default.CloudDownload),
        AuditLogEntry("ALERT_ACKNOWLEDGED", "ALT-102 (Alex Vance)", "M12_SOC", "ACKNOWLEDGED", "1 hr ago", Icons.Default.CheckCircle),
        AuditLogEntry("BACKUP_IMMUTABLE_SNAPSHOT", "S3 Glacial Vault #49", "M11_BACKUP", "VERIFIED", "2 hrs ago", Icons.Default.Backup)
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepNavy)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = "AUDIT & ACTIVITY LOG",
                color = SoftWhite,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = "Immutable SOC event trail with tamper-evident cryptographic sequencing.",
                color = MutedGray,
                fontSize = 12.sp
            )
        }

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            items(auditLogs) { log ->
                CyberCard {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(38.dp)
                                .clip(CircleShape)
                                .background(SecurityTeal.copy(alpha = 0.15f)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = log.icon,
                                contentDescription = null,
                                tint = SecurityTeal,
                                modifier = Modifier.size(20.dp)
                            )
                        }

                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = log.action,
                                color = SoftWhite,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                fontFamily = FontFamily.Monospace
                            )
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = "${log.actor} • ${log.module}",
                                color = MutedGray,
                                fontSize = 11.sp
                            )
                        }

                        Column(horizontalAlignment = Alignment.End) {
                            StatusBadge(status = log.status)
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = log.timestamp,
                                color = CyanAccent,
                                fontSize = 10.sp
                            )
                        }
                    }
                }
            }

            item {
                Spacer(modifier = Modifier.height(16.dp))
            }
        }
    }
}
