package com.securix.security.receiver

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
import com.securix.security.data.local.SecureStorage
import com.securix.security.service.SecurixForegroundService

class PowerConnectionReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        val receivedAction = intent.action
        val storage = SecureStorage(context)

        if (!storage.isArmed || !storage.isPocketSnatchEnabled) return

        if (receivedAction == Intent.ACTION_POWER_DISCONNECTED) {
            Log.w("SecurixPower", "Charger disconnected while Armed! Triggering Anti-Snatch alert.")
            val serviceIntent = Intent(context, SecurixForegroundService::class.java).apply {
                this.action = SecurixForegroundService.ACTION_START_ALARM
            }
            context.startService(serviceIntent)
        }
    }
}
