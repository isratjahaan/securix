package com.securix.security.receiver

import android.app.admin.DevicePolicyManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.provider.Telephony
import android.telephony.SmsManager
import android.util.Log
import com.securix.security.data.local.SecureStorage
import com.securix.security.service.SecurixForegroundService
import com.securix.security.ui.FakePowerOffActivity
import com.securix.security.ui.LostModeActivity

class SmsCommandReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action != Telephony.Sms.Intents.SMS_RECEIVED_ACTION) return

        val messages = Telephony.Sms.Intents.getMessagesFromIntent(intent)
        val storage = SecureStorage(context)

        for (sms in messages) {
            val body = sms.displayMessageBody?.trim() ?: continue
            val sender = sms.displayOriginatingAddress ?: continue

            if (body.startsWith("#SECURIX#", ignoreCase = true)) {
                Log.i("SecurixSMS", "Intercepted SECURIX SMS command from $sender: $body")

                val parts = body.split("#").filter { it.isNotBlank() }
                // Expected format: ["SECURIX", "COMMAND", "PIN"]
                if (parts.size >= 3) {
                    val cmd = parts[1].uppercase()
                    val pin = parts[2]

                    if (!storage.verifyPin(pin)) {
                        Log.w("SecurixSMS", "Invalid PIN received in SMS command from $sender")
                        sendSmsReply(sender, "SECURIX: Access Denied. Invalid PIN.")
                        continue
                    }

                    when (cmd) {
                        "LOCK" -> {
                            val dpm = context.getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
                            try {
                                dpm.lockNow()
                                sendSmsReply(sender, "SECURIX: Device locked successfully.")
                            } catch (e: Exception) {
                                sendSmsReply(sender, "SECURIX: Lock failed (Device Admin not granted).")
                            }
                        }
                        "ALARM" -> {
                            val serviceIntent = Intent(context, SecurixForegroundService::class.java).apply {
                                action = SecurixForegroundService.ACTION_START_ALARM
                            }
                            context.startService(serviceIntent)
                            sendSmsReply(sender, "SECURIX: Emergency siren triggered.")
                        }
                        "STOP" -> {
                            val serviceIntent = Intent(context, SecurixForegroundService::class.java).apply {
                                action = SecurixForegroundService.ACTION_STOP_ALARM
                            }
                            context.startService(serviceIntent)
                            sendSmsReply(sender, "SECURIX: Siren stopped.")
                        }
                        "LOST" -> {
                            storage.isLostModeActive = true
                            val lostIntent = Intent(context, LostModeActivity::class.java).apply {
                                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
                            }
                            context.startActivity(lostIntent)
                            sendSmsReply(sender, "SECURIX: Lost mode screen locked.")
                        }
                        "FAKE_POWER" -> {
                            val fakeIntent = Intent(context, FakePowerOffActivity::class.java).apply {
                                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
                            }
                            context.startActivity(fakeIntent)
                            sendSmsReply(sender, "SECURIX: Stealth fake power-off activated.")
                        }
                        "LOCATE" -> {
                            val serviceIntent = Intent(context, SecurixForegroundService::class.java).apply {
                                action = SecurixForegroundService.ACTION_SMS_LOCATE
                                putExtra("sender", sender)
                            }
                            context.startService(serviceIntent)
                        }
                        else -> {
                            sendSmsReply(sender, "SECURIX: Unknown command. Supported: LOCK, ALARM, STOP, LOST, FAKE_POWER, LOCATE")
                        }
                    }
                }
            }
        }
    }

    private fun sendSmsReply(destination: String, text: String) {
        try {
            val smsManager = SmsManager.getDefault()
            smsManager.sendTextMessage(destination, null, text, null, null)
        } catch (e: Exception) {
            Log.e("SecurixSMS", "Could not send SMS reply: ${e.message}")
        }
    }
}
