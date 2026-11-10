package com.securix.security.service

import android.accessibilityservice.AccessibilityService
import android.content.Intent
import android.util.Log
import android.view.accessibility.AccessibilityEvent
import com.securix.security.data.local.SecureStorage
import com.securix.security.ui.FakePowerOffActivity

class SecurixAccessibilityService : AccessibilityService() {

    private lateinit var storage: SecureStorage

    override fun onCreate() {
        super.onCreate()
        storage = SecureStorage(this)
        Log.i("SecurixA11y", "SECURIX Accessibility Watchdog created.")
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event == null) return

        val pkgName = event.packageName?.toString() ?: ""
        val className = event.className?.toString() ?: ""

        // 1. Anti-Power-Off Protection: Intercept system power dialog
        if (storage.isArmed && storage.isAntiPowerOffEnabled) {
            val isPowerDialog = className.contains("GlobalActions", ignoreCase = true) ||
                    className.contains("PowerDialog", ignoreCase = true) ||
                    className.contains("ShutdownActivity", ignoreCase = true) ||
                    (pkgName == "android" && className.contains("Dialog", ignoreCase = true))

            if (isPowerDialog) {
                Log.w("SecurixA11y", "Unauthorized Power-off dialog intercepted! Blocking.")
                // Dismiss system power dialog immediately
                performGlobalAction(GLOBAL_ACTION_BACK)

                // Launch stealth fake power-off screen to fool the thief
                val fakeIntent = Intent(this, FakePowerOffActivity::class.java).apply {
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
                }
                startActivity(fakeIntent)
                return
            }
        }

        // 2. Anti-Uninstall Protection: Intercept Settings application trying to uninstall SECURIX
        if (storage.isArmed) {
            val isSettingsPkg = pkgName.contains("com.android.settings", ignoreCase = true)
            if (isSettingsPkg) {
                // Check if current text contains Securix or Device Admin deactivation
                val textList = event.text.map { it.toString().lowercase() }
                val hasSecurix = textList.any { it.contains("securix") || it.contains("com.securix.security") }
                val isDeactivateAdmin = textList.any { it.contains("deactivate") || it.contains("uninstall") || it.contains("force stop") }

                if (hasSecurix && isDeactivateAdmin) {
                    Log.w("SecurixA11y", "Unauthorized attempt to uninstall or deactivate SECURIX intercepted!")
                    // Block access by navigating back immediately
                    performGlobalAction(GLOBAL_ACTION_BACK)
                    performGlobalAction(GLOBAL_ACTION_HOME)
                }
            }
        }
    }

    override fun onInterrupt() {
        Log.w("SecurixA11y", "SECURIX Accessibility Service interrupted.")
    }
}
