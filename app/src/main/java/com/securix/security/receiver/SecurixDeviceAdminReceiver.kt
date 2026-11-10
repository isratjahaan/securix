package com.securix.security.receiver

import android.app.admin.DeviceAdminReceiver
import android.app.admin.DevicePolicyManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.os.UserManager
import android.util.Log
import android.widget.Toast
import com.securix.security.data.local.SecureStorage
import com.securix.security.data.model.IntruderAlert
import com.securix.security.data.network.SecurixApiClient
import com.securix.security.service.SecurixForegroundService
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.util.UUID

class SecurixDeviceAdminReceiver : DeviceAdminReceiver() {

    override fun onEnabled(context: Context, intent: Intent) {
        super.onEnabled(context, intent)
        Log.i("SecurixDPM", "SECURIX Device Administrator activated.")
        Toast.makeText(context, "SECURIX Device Administrator Activated", Toast.LENGTH_SHORT).show()

        val dpm = context.getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
        val admin = getComponentName(context)

        // If enrolled as Device Owner, apply enterprise anti-theft lockdown restrictions!
        if (dpm.isDeviceOwnerApp(context.packageName)) {
            try {
                Log.i("SecurixDPM", "Enrolled as Enterprise Device Owner! Applying hardening policies.")
                // Prevent uninstallation
                dpm.setUninstallBlocked(admin, context.packageName, true)
                // Disallow factory reset
                dpm.addUserRestriction(admin, UserManager.DISALLOW_FACTORY_RESET)
                // Disallow safe boot (anti-power-off / anti-bypass protection)
                dpm.addUserRestriction(admin, UserManager.DISALLOW_SAFE_BOOT)
                // Disallow adding guest users
                dpm.addUserRestriction(admin, UserManager.DISALLOW_ADD_USER)
            } catch (e: Exception) {
                Log.e("SecurixDPM", "Failed to apply Device Owner policies: ${e.message}")
            }
        }
    }

    override fun onDisabled(context: Context, intent: Intent) {
        super.onDisabled(context, intent)
        Log.w("SecurixDPM", "SECURIX Device Administrator deactivated!")
        Toast.makeText(context, "SECURIX Device Administrator Deactivated", Toast.LENGTH_SHORT).show()
    }

    override fun onPasswordFailed(context: Context, intent: Intent) {
        super.onPasswordFailed(context, intent)
        val storage = SecureStorage(context)
        val attempts = storage.failedAttemptsCount + 1
        storage.failedAttemptsCount = attempts

        Log.w("SecurixDPM", "Failed screen unlock attempt detected! Count: $attempts")

        if (storage.isIntruderSelfieEnabled && attempts >= 2) {
            // Trigger emergency intruder broadcast / photo capture
            val serviceIntent = Intent(context, SecurixForegroundService::class.java).apply {
                action = SecurixForegroundService.ACTION_INTRUDER_CAPTURE
                putExtra("attempts", attempts)
                putExtra("reason", "FAILED_UNLOCK_PASSCODE")
            }
            context.startService(serviceIntent)
        }
    }

    override fun onPasswordSucceeded(context: Context, intent: Intent) {
        super.onPasswordSucceeded(context, intent)
        val storage = SecureStorage(context)
        storage.failedAttemptsCount = 0
        Log.i("SecurixDPM", "Device successfully unlocked by user. Failed count reset.")
    }

    companion object {
        fun getComponentName(context: Context): ComponentName {
            return ComponentName(context, SecurixDeviceAdminReceiver::class.java)
        }
    }
}
