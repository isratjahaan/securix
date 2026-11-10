package com.securix.security.data.model

data class DeviceStatus(
    val deviceId: String,
    val deviceName: String,
    val batteryLevel: Int,
    val isCharging: Boolean,
    val latitude: Double,
    val longitude: Double,
    val accuracy: Float,
    val speed: Float,
    val networkType: String,
    val isArmed: Boolean,
    val isDeviceAdmin: Boolean,
    val isDeviceOwner: Boolean,
    val isAccessibilityEnabled: Boolean,
    val isLostMode: Boolean,
    val isAlarmActive: Boolean,
    val lastSeenTimestamp: Long = System.currentTimeMillis()
)
