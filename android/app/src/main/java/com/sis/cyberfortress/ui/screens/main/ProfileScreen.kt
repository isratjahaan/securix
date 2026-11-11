package com.sis.cyberfortress.ui.screens.main

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sis.cyberfortress.core.datastore.SessionManager
import com.sis.cyberfortress.core.designsystem.*

@Composable
fun ProfileScreen(
    onNavigateToDevices: () -> Unit,
    onNavigateToNotifications: () -> Unit,
    onNavigateToReports: () -> Unit,
    onNavigateToSecurity: () -> Unit,
    onNavigateToPrivacy: () -> Unit,
    onNavigateToBackendSettings: () -> Unit,
    onNavigateToHelp: () -> Unit,
    onNavigateToAbout: () -> Unit,
    onLogout: () -> Unit
) {
    val context = LocalContext.current
    val sessionManager = remember { SessionManager.getInstance(context) }
    val user = sessionManager.currentUser

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepNavy)
            .padding(16.dp)
            .verticalScroll(rememberScrollState())
    ) {
        Text(
            text = "OPERATOR PROFILE",
            color = SoftWhite,
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Profile Badge Card
        CyberCard {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(56.dp)
                        .clip(CircleShape)
                        .background(SecurityTeal.copy(alpha = 0.2f)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Shield,
                        contentDescription = null,
                        tint = SecurityTeal,
                        modifier = Modifier.size(32.dp)
                    )
                }

                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = user?.name ?: "Alex Vance",
                        color = SoftWhite,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = user?.email ?: "admin@cyberfortress.io",
                        color = MutedGray,
                        fontSize = 12.sp
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        StatusBadge(status = user?.role ?: "SUPER_ADMIN")
                        StatusBadge(status = "ACTIVE")
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        Text(
            text = "SYSTEM & MANAGEMENT",
            color = MutedGray,
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            letterSpacing = 0.5.sp
        )

        Spacer(modifier = Modifier.height(8.dp))

        // Management Menu List
        ProfileMenuItem("Device Management", "Register and audit connected enterprise endpoints", Icons.Default.Smartphone, onNavigateToDevices)
        ProfileMenuItem("Notification Center", "Real-time SOC alert subscriptions & triggers", Icons.Default.Notifications, onNavigateToNotifications)
        ProfileMenuItem("Reports & Compliance", "SOC 2, ISO 27001, and NIST audit exports", Icons.Default.Assessment, onNavigateToReports)
        ProfileMenuItem("Account Security", "Biometrics, MFA authentication & key rotation", Icons.Default.Security, onNavigateToSecurity)
        ProfileMenuItem("Backend & Network", "Configure host API endpoint & ping diagnostics", Icons.Default.SettingsEthernet, onNavigateToBackendSettings)
        ProfileMenuItem("Privacy & Disclosures", "Zero-Knowledge guarantees & data boundaries", Icons.Default.PrivacyTip, onNavigateToPrivacy)
        ProfileMenuItem("SOC Knowledge Base", "Incident playbooks, triage FAQs & manuals", Icons.Default.Help, onNavigateToHelp)
        ProfileMenuItem("About SIS Cyber Fortress", "System version, architecture manifest & license", Icons.Default.Info, onNavigateToAbout)

        Spacer(modifier = Modifier.height(16.dp))

        CyberButton(
            text = "SECURE LOGOUT",
            onClick = {
                sessionManager.clearSession()
                Toast.makeText(context, "Session terminated securely.", Toast.LENGTH_SHORT).show()
                onLogout()
            },
            isDanger = true,
            icon = Icons.Default.Logout
        )

        Spacer(modifier = Modifier.height(24.dp))
    }
}

@Composable
fun ProfileMenuItem(
    title: String,
    subtitle: String,
    icon: ImageVector,
    onClick: () -> Unit
) {
    CyberCard(
        modifier = Modifier.padding(bottom = 8.dp),
        onClick = onClick
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .clip(CircleShape)
                    .background(MidnightBlue),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = SecurityTeal,
                    modifier = Modifier.size(18.dp)
                )
            }
            Column(modifier = Modifier.weight(1f)) {
                Text(text = title, color = SoftWhite, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                Text(text = subtitle, color = MutedGray, fontSize = 11.sp)
            }
            Icon(
                imageVector = Icons.Default.ChevronRight,
                contentDescription = null,
                tint = MutedGray,
                modifier = Modifier.size(16.dp)
            )
        }
    }
}
