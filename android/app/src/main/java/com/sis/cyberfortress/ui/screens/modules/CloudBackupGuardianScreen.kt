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

data class BackupRecord(
    val id: String,
    val target: String,
    val sizeMb: Int,
    val encrypted: Boolean,
    val status: String,
    val timestamp: String
)

@Composable
fun CloudBackupGuardianScreen(onBackClick: () -> Unit) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()

    var backups by remember {
        mutableStateOf(
            listOf(
                BackupRecord("BCK-104", "AWS S3 WORM Glacier Enclave (US-East)", 420, true, "VERIFIED", "2 hrs ago"),
                BackupRecord("BCK-103", "Azure Immutable Blob Vault (West-Europe)", 398, true, "VERIFIED", "Yesterday"),
                BackupRecord("BCK-102", "Air-Gapped Secondary Tape Mirror", 1240, true, "VERIFIED", "3 days ago")
            )
        )
    }
    var isExecutingBackup by remember { mutableStateOf(false) }

    fun triggerBackup() {
        isExecutingBackup = true
        coroutineScope.launch {
            delay(1500)
            backups = listOf(
                BackupRecord("BCK-${System.currentTimeMillis() % 1000}", "AWS S3 WORM Glacier Enclave", 435, true, "VERIFIED", "Just now")
            ) + backups
            isExecutingBackup = false
            Toast.makeText(context, "Encrypted snapshot successfully replicated and cryptographically sealed.", Toast.LENGTH_LONG).show()
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepNavy)
    ) {
        CyberTopAppBar(
            title = "Cloud Backup Guardian [M11]",
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
                        text = "IMMUTABLE CLOUD BACKUP & DISASTER RECOVERY",
                        color = SoftWhite,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "WORM (Write Once, Read Many) object locking ensures ransomware and malicious admins cannot purge or encrypt backup snapshots.",
                        color = MutedGray,
                        fontSize = 11.sp
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    CyberButton(
                        text = if (isExecutingBackup) "CREATING IMMUTABLE SNAPSHOT..." else "TRIGGER ENCRYPTED BACKUP NOW",
                        onClick = { triggerBackup() },
                        isLoading = isExecutingBackup,
                        icon = Icons.Default.CloudUpload
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
                        text = "BACKUP SNAPSHOT ARCHIVES (${backups.size})",
                        color = MutedGray,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold
                    )
                    StatusBadge(status = "WORM ENCRYPTED")
                }
            }

            items(backups) { item ->
                CyberCard(borderColor = DarkBorder) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(
                                    text = item.id,
                                    color = CyanAccent,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    fontFamily = FontFamily.Monospace
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                StatusBadge(status = "AES-256")
                            }
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = item.target,
                                color = SoftWhite,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.SemiBold
                            )
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = "Size: ${item.sizeMb} MB • Sealed ${item.timestamp}",
                                color = MutedGray,
                                fontSize = 11.sp
                            )
                        }

                        StatusBadge(status = item.status)
                    }
                }
            }
        }
    }
}
