package com.sis.cyberfortress.ui.screens.main

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sis.cyberfortress.core.designsystem.*

sealed class BottomNavTab(
    val title: String,
    val icon: ImageVector,
    val selectedIcon: ImageVector
) {
    object Home : BottomNavTab("Home", Icons.Default.Dashboard, Icons.Default.Dashboard)
    object Modules : BottomNavTab("Modules", Icons.Default.Hub, Icons.Default.Hub)
    object Alerts : BottomNavTab("Alerts", Icons.Default.Warning, Icons.Default.Warning)
    object Activity : BottomNavTab("Activity", Icons.Default.ListAlt, Icons.Default.ListAlt)
    object Profile : BottomNavTab("Profile", Icons.Default.AccountCircle, Icons.Default.AccountCircle)
}

@Composable
fun MainShellScreen(
    onNavigateToModule: (String) -> Unit,
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
    var selectedTabIndex by remember { mutableIntStateOf(0) }

    val tabs = listOf(
        BottomNavTab.Home,
        BottomNavTab.Modules,
        BottomNavTab.Alerts,
        BottomNavTab.Activity,
        BottomNavTab.Profile
    )

    Scaffold(
        modifier = Modifier.fillMaxSize(),
        bottomBar = {
            NavigationBar(
                containerColor = MidnightBlue,
                tonalElevation = 8.dp
            ) {
                tabs.forEachIndexed { index, tab ->
                    NavigationBarItem(
                        selected = selectedTabIndex == index,
                        onClick = { selectedTabIndex = index },
                        icon = {
                            Icon(
                                imageVector = if (selectedTabIndex == index) tab.selectedIcon else tab.icon,
                                contentDescription = tab.title
                            )
                        },
                        label = {
                            Text(
                                text = tab.title,
                                fontSize = 11.sp
                            )
                        },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = DeepNavy,
                            selectedTextColor = SecurityTeal,
                            indicatorColor = SecurityTeal,
                            unselectedIconColor = MutedGray,
                            unselectedTextColor = MutedGray
                        )
                    )
                }
            }
        }
    ) { paddingValues ->
        Surface(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(DeepNavy)
        ) {
            when (selectedTabIndex) {
                0 -> HomeScreen(
                    onNavigateToModule = onNavigateToModule,
                    onNavigateToAlerts = { selectedTabIndex = 2 },
                    onNavigateToDevices = onNavigateToDevices,
                    onNavigateToVault = { onNavigateToModule("module_vault_guardian") }
                )
                1 -> ModulesHubScreen(
                    onNavigateToModule = onNavigateToModule
                )
                2 -> AlertsScreen()
                3 -> ActivityLogScreen()
                4 -> ProfileScreen(
                    onNavigateToDevices = onNavigateToDevices,
                    onNavigateToNotifications = onNavigateToNotifications,
                    onNavigateToReports = onNavigateToReports,
                    onNavigateToSecurity = onNavigateToSecurity,
                    onNavigateToPrivacy = onNavigateToPrivacy,
                    onNavigateToBackendSettings = onNavigateToBackendSettings,
                    onNavigateToHelp = onNavigateToHelp,
                    onNavigateToAbout = onNavigateToAbout,
                    onLogout = onLogout
                )
            }
        }
    }
}
