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

data class NotificationItem(
    val id: String,
    val title: String,
    val message: String,
    val category: String,
    val timestamp: String,
    val isRead: Boolean
)

@Composable
fun NotificationsCenterScreen(onBackClick: () -> Unit) {
    val context = LocalContext.current

    var notifications by remember {
        mutableStateOf(
            listOf(
                NotificationItem("NOTIF-1", "CRITICAL ALERT: Unauthorized SSH Bastion Attempt", "Failed authentication threshold exceeded on gateway node 10.0.2.1", "ALERT", "2 min ago", false),
                NotificationItem("NOTIF-2", "Zero-Knowledge Vault Backup Completed", "Client encrypted keystore backup snapshot safely archived.", "SYSTEM", "1 hr ago", false),
                NotificationItem("NOTIF-3", "Threat Feed Synchronized", "MISP & AlienVault indicators synchronized with 96% confidence score.", "SECURITY", "3 hrs ago", true)
            )
        )
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepNavy)
    ) {
        CyberTopAppBar(
            title = "Notification Center",
            onBackClick = onBackClick,
            actions = {
                TextButton(onClick = {
                    notifications = notifications.map { it.copy(isRead = true) }
                    Toast.makeText(context, "All notifications marked as read.", Toast.LENGTH_SHORT).show()
                }) {
                    Text("Read All", color = SecurityTeal, fontSize = 12.sp)
                }
            }
        )

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            items(notifications) { item ->
                CyberCard(borderColor = if (!item.isRead) SecurityTeal.copy(alpha = 0.6f) else DarkBorder) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.Top
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                StatusBadge(status = item.category)
                                if (!item.isRead) {
                                    StatusBadge(status = "NEW")
                                }
                            }
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = item.title,
                                color = SoftWhite,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = item.message,
                                color = MutedGray,
                                fontSize = 11.sp
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = item.timestamp,
                                color = CyanAccent,
                                fontSize = 10.sp
                            )
                        }
                    }
                }
            }
        }
    }
}
