package com.securix.security.receiver

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log
import com.securix.security.service.MotionDetectionService
import com.securix.security.service.SecurixForegroundService

class BootReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        val action = intent.action
        Log.i("SecurixBoot", "Received boot event: $action")

        val serviceIntent = Intent(context, SecurixForegroundService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startForegroundService(serviceIntent)
        } else {
            context.startService(serviceIntent)
        }

        // Start motion guard if enabled
        val motionIntent = Intent(context, MotionDetectionService::class.java)
        context.startService(motionIntent)
    }
}
