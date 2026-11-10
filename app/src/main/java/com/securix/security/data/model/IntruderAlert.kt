package com.securix.security.data.model

data class IntruderAlert(
    val id: String,
    val deviceId: String,
    val timestamp: Long = System.currentTimeMillis(),
    val triggerReason: String,
    val failedAttempts: Int,
    val latitude: Double,
    val longitude: Double,
    val photoBase64: String? = null
)
