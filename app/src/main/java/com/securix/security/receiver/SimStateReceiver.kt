package com.securix.security.receiver

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.telephony.SmsManager
import android.telephony.TelephonyManager
import android.util.Log
import com.securix.security.data.local.SecureStorage

class SimStateReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action != "android.intent.action.SIM_STATE_CHANGED") return

        val storage = SecureStorage(context)
        if (!storage.isArmed || !storage.isSimGuardEnabled) return

        val tm = context.getSystemService(Context.TELEPHONY_SERVICE) as? TelephonyManager ?: return
        val state = tm.simState

        if (state == TelephonyManager.SIM_STATE_ABSENT || state == TelephonyManager.SIM_STATE_READY) {
            val carrier = tm.networkOperatorName
            val message = "SECURIX ALERT: SIM card state change detected on your device! Carrier: $carrier. Device ID: ${storage.deviceId}"
            Log.w("SecurixSIM", message)

            val emergency = storage.emergencyPhone
            if (emergency.isNotBlank()) {
                try {
                    val smsManager = SmsManager.getDefault()
                    smsManager.sendTextMessage(emergency, null, message, null, null)
                } catch (e: Exception) {
                    Log.e("SecurixSIM", "Failed to alert emergency contact: ${e.message}")
                }
            }
        }
    }
}
