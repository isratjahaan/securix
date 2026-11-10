package com.securix.security.data.model

enum class CommandType {
    LOCK,
    UNLOCK,
    ALARM,
    STOP_ALARM,
    LOCATE,
    STEALTH_PHOTO,
    FAKE_POWER_OFF,
    LOST_MODE,
    EXIT_LOST_MODE,
    WIPE_DATA,
    SHOW_MESSAGE,
    SYNC_CONFIG
}

enum class CommandStatus {
    PENDING,
    ACKNOWLEDGED,
    EXECUTED,
    FAILED
}

data class RemoteCommand(
    val commandId: String,
    val type: CommandType,
    val status: CommandStatus = CommandStatus.PENDING,
    val payload: String = "",
    val timestamp: Long = System.currentTimeMillis(),
    val signature: String = "",
    val resultMessage: String? = null
)
