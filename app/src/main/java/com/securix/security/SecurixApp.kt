package com.securix.security

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build

class SecurixApp : Application() {

    override fun onCreate() {
        super.onCreate()
        createNotificationChannels()
    }

    private fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val notificationManager = getSystemService(NotificationManager::class.java)

            val persistentChannel = NotificationChannel(
                CHANNEL_PERSISTENT,
                "SECURIX Shield Protection",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Shows real-time status of SECURIX anti-theft monitoring"
                setShowBadge(false)
            }

            val alarmChannel = NotificationChannel(
                CHANNEL_ALARM,
                "SECURIX Critical Security Alarm",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Critical alerts and remote siren triggers"
                enableVibration(true)
                setShowBadge(true)
            }

            notificationManager.createNotificationChannel(persistentChannel)
            notificationManager.createNotificationChannel(alarmChannel)
        }
    }

    companion object {
        const val CHANNEL_PERSISTENT = "securix_persistent_channel"
        const val CHANNEL_ALARM = "securix_critical_alarm_channel"
    }
}
