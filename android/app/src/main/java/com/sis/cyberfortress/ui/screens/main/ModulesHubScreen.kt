package com.sis.cyberfortress.ui.screens.main

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sis.cyberfortress.core.designsystem.*
import com.sis.cyberfortress.core.network.ApiClient
import com.sis.cyberfortress.core.network.ModuleDto
import kotlinx.coroutines.launch

data class ModuleItemMeta(
    val code: String,
    val name: String,
    val description: String,
    val category: String,
    val icon: ImageVector,
    val route: String
)

val ALL_12_MODULES = listOf(
    ModuleItemMeta("M01", "Identity Guardian", "Dark web breach & credential leak monitoring", "Threat Detection", Icons.Default.Badge, "module_identity_guardian"),
    ModuleItemMeta("M02", "Phishing Shield", "AI-driven zero-hour phishing & URL threat detection", "Threat Detection", Icons.Default.Phishing, "module_phishing_shield"),
    ModuleItemMeta("M03", "Endpoint Guardian", "Android device posture, root detection & anti-malware", "Threat Detection", Icons.Default.Smartphone, "module_endpoint_guardian"),
    ModuleItemMeta("M04", "Network Sentinel", "Wi-Fi MITM detection, SSL validation & VPN audit", "Network & Web", Icons.Default.Wifi, "module_network_sentinel"),
    ModuleItemMeta("M05", "Vault Guardian", "Zero-Knowledge client-encrypted password & note vault", "Access & Crypto", Icons.Default.Lock, "module_vault_guardian"),
    ModuleItemMeta("M06", "Ransomware Guardian", "Canary trap files, behavioral anomaly & file integrity", "Threat Detection", Icons.Default.Dangerous, "module_ransomware_guardian"),
    ModuleItemMeta("M07", "Web Shield", "Domain reputation, DNS-over-HTTPS & SSL cert audit", "Network & Web", Icons.Default.Language, "module_web_shield"),
    ModuleItemMeta("M08", "Digital Forensics", "Evidence acquisition, SHA-256 chain of custody logs", "SOC & Forensics", Icons.Default.Search, "module_digital_forensics"),
    ModuleItemMeta("M09", "Access Guardian", "Zero-Trust policy enforcement, PAM & session control", "Access & Crypto", Icons.Default.VpnKey, "module_access_guardian"),
    ModuleItemMeta("M10", "Threat Intelligence", "Global MISP, AlienVault, CISA feeds & IOC repository", "SOC & Forensics", Icons.Default.Radar, "module_threat_intelligence"),
    ModuleItemMeta("M11", "Cloud Backup Guardian", "Immutable snapshot scheduler & restore verification", "Access & Crypto", Icons.Default.CloudSync, "module_cloud_backup_guardian"),
    ModuleItemMeta("M12", "Cyber SOC", "Centralized security operations, alerts triage & response", "SOC & Forensics", Icons.Default.Shield, "module_cyber_soc")
)

@Composable
fun ModulesHubScreen(
    onNavigateToModule: (String) -> Unit
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()

    var searchQuery by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf("ALL") }
    var backendModules by remember { mutableStateOf<List<ModuleDto>>(emptyList()) }

    LaunchedEffect(Unit) {
        coroutineScope.launch {
            try {
                val response = ApiClient.getService(context).getModules()
                if (response.isSuccessful && response.body() != null) {
                    backendModules = response.body()!!
                }
            } catch (e: Exception) {
                // Keep default
            }
        }
    }

    val categories = listOf("ALL", "Threat Detection", "Network & Web", "Access & Crypto", "SOC & Forensics")

    val filteredModules = ALL_12_MODULES.filter { module ->
        (selectedCategory == "ALL" || module.category == selectedCategory) &&
        (module.name.contains(searchQuery, ignoreCase = true) || module.description.contains(searchQuery, ignoreCase = true))
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepNavy)
    ) {
        // Header
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = "12-IN-1 CYBERSECURITY MODULES",
                color = SoftWhite,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = "Complete enterprise defense grid with independent module boundaries.",
                color = MutedGray,
                fontSize = 12.sp
            )

            Spacer(modifier = Modifier.height(12.dp))

            // Search Bar
            CyberTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                label = "Search security modules...",
                leadingIcon = Icons.Default.Search,
                placeholder = "e.g. Identity, Vault, Phishing..."
            )

            Spacer(modifier = Modifier.height(10.dp))

            // Category Filter Pills
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                categories.take(3).forEach { cat ->
                    FilterChip(
                        selected = selectedCategory == cat,
                        onClick = { selectedCategory = cat },
                        label = { Text(cat, fontSize = 11.sp) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = SecurityTeal,
                            selectedLabelColor = DeepNavy,
                            containerColor = MidnightBlue,
                            labelColor = SoftWhite
                        )
                    )
                }
            }
        }

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            items(filteredModules) { item ->
                val backendMatch = backendModules.find { it.code == item.code }
                val status = backendMatch?.status ?: "ACTIVE"
                val healthPercent = backendMatch?.healthPercent ?: 100

                CyberCard(
                    borderColor = SecurityTeal.copy(alpha = 0.3f),
                    onClick = { onNavigateToModule(item.route) }
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(44.dp)
                                .background(MidnightBlue, RoundedCornerShape(10.dp)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = item.icon,
                                contentDescription = null,
                                tint = SecurityTeal,
                                modifier = Modifier.size(24.dp)
                            )
                        }

                        Column(modifier = Modifier.weight(1f)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(
                                    text = item.name,
                                    color = SoftWhite,
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = "[${item.code}]",
                                    color = CyanAccent,
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.SemiBold
                                )
                            }
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = item.description,
                                color = MutedGray,
                                fontSize = 11.sp,
                                maxLines = 2
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = "Health: $healthPercent% • ${item.category}",
                                color = StatusSuccess,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Medium
                            )
                        }

                        Column(horizontalAlignment = Alignment.End) {
                            StatusBadge(status = status)
                            Spacer(modifier = Modifier.height(8.dp))
                            Icon(
                                imageVector = Icons.Default.ChevronRight,
                                contentDescription = "Enter module",
                                tint = MutedGray,
                                modifier = Modifier.size(18.dp)
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
