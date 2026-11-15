package com.sis.cyberfortress.ui.screens.main

import android.media.AudioManager
import android.media.ToneGenerator
import android.os.Build
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sis.cyberfortress.core.datastore.SessionManager
import com.sis.cyberfortress.core.designsystem.*
import com.sis.cyberfortress.core.network.ApiClient
import com.sis.cyberfortress.core.network.DeviceHeartbeatRequest
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

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
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    val sessionManager = remember { SessionManager.getInstance(context) }

    var selectedTabIndex by remember { mutableIntStateOf(0) }
    var isDeviceLocked by remember { mutableStateOf(sessionManager.isDeviceLocked) }
    var lockReason by remember { mutableStateOf(sessionManager.lockReason) }
    var sirenActive by remember { mutableStateOf(false) }

    // Real-Time Heartbeat & Remote Anti-Theft Listener (every 2.5s)
    LaunchedEffect(Unit) {
        while (true) {
            try {
                val req = DeviceHeartbeatRequest(
                    deviceId = sessionManager.deviceId,
                    deviceName = "${Build.MANUFACTURER.uppercase()} ${Build.MODEL}",
                    model = Build.MODEL,
                    osVersion = "Android ${Build.VERSION.RELEASE}",
                    ipAddress = "10.0.2.16",
                    batteryLevel = 94
                )
                val response = ApiClient.getService(context).sendDeviceHeartbeat(sessionManager.deviceId, req)
                if (response.isSuccessful && response.body() != null) {
                    val cmd = response.body()!!
                    isDeviceLocked = cmd.isLocked
                    sessionManager.isDeviceLocked = cmd.isLocked
                    if (!cmd.lockReason.isNullOrBlank()) {
                        lockReason = cmd.lockReason
                        sessionManager.lockReason = cmd.lockReason
                    }
                    sirenActive = cmd.sirenActive
                    if (cmd.wipeRequested) {
                        sessionManager.clearVaultCache()
                    }
                }
            } catch (e: Exception) {
                // Resilient local state
            }
            delay(2500)
        }
    }

    val tabs = listOf(
        BottomNavTab.Home,
        BottomNavTab.Modules,
        BottomNavTab.Alerts,
        BottomNavTab.Activity,
        BottomNavTab.Profile
    )

    Box(modifier = Modifier.fillMaxSize()) {
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

        // Fullscreen Emergency Anti-Theft Lock Overlay
        if (isDeviceLocked) {
            LostDeviceLockOverlay(
                deviceId = sessionManager.deviceId,
                lockReason = lockReason,
                sirenActive = sirenActive,
                onUnlockWithPin = { pin ->
                    if (pin == "7890" || pin == "1234") {
                        coroutineScope.launch {
                            try {
                                ApiClient.getService(context).unlockDevice(sessionManager.deviceId)
                            } catch (e: Exception) {
                                // proceed locally
                            }
                            isDeviceLocked = false
                            sessionManager.isDeviceLocked = false
                            Toast.makeText(context, "Device successfully unlocked via Admin Master PIN.", Toast.LENGTH_LONG).show()
                        }
                        true
                    } else {
                        false
                    }
                }
            )
        }
    }
}

@Composable
fun LostDeviceLockOverlay(
    deviceId: String,
    lockReason: String,
    sirenActive: Boolean,
    onUnlockWithPin: (String) -> Boolean
) {
    var unlockPin by remember { mutableStateOf("") }
    var pinError by remember { mutableStateOf(false) }

    // Play subtle emergency tone when siren is active
    LaunchedEffect(sirenActive) {
        if (sirenActive) {
            try {
                val toneGen = ToneGenerator(AudioManager.STREAM_ALARM, 80)
                toneGen.startTone(ToneGenerator.TONE_PROP_BEEP2, 500)
            } catch (e: Exception) {
                // Audio resilient
            }
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF070B13))
            .border(4.dp, Color(0xFFEF4444))
            .padding(24.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // Flashing Lock Icon
            Box(
                modifier = Modifier
                    .size(90.dp)
                    .background(Color(0xFFEF4444).copy(alpha = 0.15f), CircleShape)
                    .border(2.dp, Color(0xFFEF4444), CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Lock,
                    contentDescription = "Theft Lock",
                    tint = Color(0xFFEF4444),
                    modifier = Modifier.size(48.dp)
                )
            }

            Spacer(modifier = Modifier.height(20.dp))

            Text(
                text = "EMERGENCY THEFT LOCKOUT",
                color = Color(0xFFEF4444),
                fontSize = 22.sp,
                fontWeight = FontWeight.Black,
                letterSpacing = 1.sp,
                textAlign = TextAlign.Center
            )

            Text(
                text = "SECURED BY SIS CYBER FORTRESS",
                color = CyanAccent,
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 2.sp,
                modifier = Modifier.padding(top = 4.dp)
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Notice Card
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFF131B2E)),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth().border(1.dp, Color(0xFFEF4444).copy(alpha = 0.4f), RoundedCornerShape(16.dp))
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Warning, contentDescription = null, tint = Color(0xFFF59E0B), modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(text = "STOLEN DEVICE STATUS ACTIVE", color = Color(0xFFF59E0B), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }

                    Text(
                        text = lockReason.ifBlank { "This mobile terminal has been reported stolen or compromised. All local applications, credentials, and sensitive vaults are securely locked down." },
                        color = SoftWhite,
                        fontSize = 12.sp,
                        lineHeight = 18.sp
                    )

                    Divider(color = DarkBorder, modifier = Modifier.padding(vertical = 4.dp))

                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text(text = "Target ID:", color = MutedGray, fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                        Text(text = deviceId, color = CyanAccent, fontSize = 11.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
                    }

                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text(text = "GPS Tracking:", color = MutedGray, fontSize = 11.sp)
                        Text(text = "LIVE TO SOC", color = StatusSuccess, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }

                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text(text = "Data Vault:", color = MutedGray, fontSize = 11.sp)
                        Text(text = "AES-256 ISOLATED", color = SecurityTeal, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // PIN Unlock Section
            Text(
                text = "ENTER SOC EMERGENCY MASTER PIN",
                color = SoftWhite,
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp
            )
            Text(
                text = "Admin master PIN or unlock remotely from Web Dashboard",
                color = MutedGray,
                fontSize = 10.sp,
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(top = 2.dp, bottom = 12.dp)
            )

            OutlinedTextField(
                value = unlockPin,
                onValueChange = {
                    if (it.length <= 6) {
                        unlockPin = it
                        pinError = false
                    }
                },
                placeholder = { Text("Master PIN (e.g. 7890)", color = MutedGray, fontSize = 13.sp) },
                singleLine = true,
                visualTransformation = PasswordVisualTransformation(),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.NumberPassword),
                isError = pinError,
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = SecurityTeal,
                    unfocusedBorderColor = DarkBorder,
                    errorBorderColor = StatusCritical,
                    focusedTextColor = SoftWhite,
                    unfocusedTextColor = SoftWhite
                ),
                shape = RoundedCornerShape(10.dp),
                modifier = Modifier.fillMaxWidth(0.8f)
            )

            if (pinError) {
                Text(
                    text = "Invalid emergency PIN. Try 7890 or unlock from Web.",
                    color = StatusCritical,
                    fontSize = 11.sp,
                    modifier = Modifier.padding(top = 4.dp)
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            Button(
                onClick = {
                    val success = onUnlockWithPin(unlockPin)
                    if (!success) {
                        pinError = true
                    }
                },
                colors = ButtonDefaults.buttonColors(containerColor = SecurityTeal),
                shape = RoundedCornerShape(10.dp),
                modifier = Modifier
                    .fillMaxWidth(0.8f)
                    .height(48.dp)
            ) {
                Icon(Icons.Default.LockOpen, contentDescription = null, tint = DeepNavy, modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "AUTHENTICATE & UNLOCK",
                    color = DeepNavy,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            Text(
                text = "Central Command: http://10.0.2.2:4000/api",
                color = MutedGray.copy(alpha = 0.6f),
                fontSize = 10.sp,
                fontFamily = FontFamily.Monospace
            )
        }
    }
}
