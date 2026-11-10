package com.securix.security.data.local

import android.content.Context
import android.content.SharedPreferences
import java.security.MessageDigest
import java.util.UUID

class SecureStorage(context: Context) {

    private val prefs: SharedPreferences = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    companion object {
        private const val PREFS_NAME = "securix_secure_prefs"
        private const val KEY_DEVICE_ID = "device_id"
        private const val KEY_PIN_HASH = "pin_hash"
        private const val KEY_EMERGENCY_PHONE = "emergency_phone"
        private const val KEY_LOST_MESSAGE = "lost_message"
        private const val KEY_SERVER_URL = "server_url"
        private const val KEY_IS_ARMED = "is_armed"
        private const val KEY_ANTI_POWER_OFF = "anti_power_off"
        private const val KEY_POCKET_SNATCH = "pocket_snatch"
        private const val KEY_SIM_GUARD = "sim_guard"
        private const val KEY_INTRUDER_SELFIE = "intruder_selfie"
        private const val KEY_LOST_MODE_ACTIVE = "lost_mode_active"
        private const val KEY_FAILED_ATTEMPTS = "failed_attempts"
    }

    var deviceId: String
        get() {
            var id = prefs.getString(KEY_DEVICE_ID, null)
            if (id == null) {
                id = "SEC-" + UUID.randomUUID().toString().substring(0, 8).uppercase()
                prefs.edit().putString(KEY_DEVICE_ID, id).apply()
            }
            return id
        }
        set(value) = prefs.edit().putString(KEY_DEVICE_ID, value).apply()

    var serverUrl: String
        get() = prefs.getString(KEY_SERVER_URL, "http://10.0.2.2:4000") ?: "http://10.0.2.2:4000"
        set(value) = prefs.edit().putString(KEY_SERVER_URL, value).apply()

    var emergencyPhone: String
        get() = prefs.getString(KEY_EMERGENCY_PHONE, "+18005550199") ?: "+18005550199"
        set(value) = prefs.edit().putString(KEY_EMERGENCY_PHONE, value).apply()

    var lostMessage: String
        get() = prefs.getString(KEY_LOST_MESSAGE, "THIS PHONE IS REPORTED LOST OR STOLEN. PLEASE RETURN TO OWNER.") ?: "THIS PHONE IS REPORTED LOST OR STOLEN. PLEASE RETURN TO OWNER."
        set(value) = prefs.edit().putString(KEY_LOST_MESSAGE, value).apply()

    var isArmed: Boolean
        get() = prefs.getBoolean(KEY_IS_ARMED, true)
        set(value) = prefs.edit().putBoolean(KEY_IS_ARMED, value).apply()

    var isAntiPowerOffEnabled: Boolean
        get() = prefs.getBoolean(KEY_ANTI_POWER_OFF, true)
        set(value) = prefs.edit().putBoolean(KEY_ANTI_POWER_OFF, value).apply()

    var isPocketSnatchEnabled: Boolean
        get() = prefs.getBoolean(KEY_POCKET_SNATCH, true)
        set(value) = prefs.edit().putBoolean(KEY_POCKET_SNATCH, value).apply()

    var isSimGuardEnabled: Boolean
        get() = prefs.getBoolean(KEY_SIM_GUARD, true)
        set(value) = prefs.edit().putBoolean(KEY_SIM_GUARD, value).apply()

    var isIntruderSelfieEnabled: Boolean
        get() = prefs.getBoolean(KEY_INTRUDER_SELFIE, true)
        set(value) = prefs.edit().putBoolean(KEY_INTRUDER_SELFIE, value).apply()

    var isLostModeActive: Boolean
        get() = prefs.getBoolean(KEY_LOST_MODE_ACTIVE, false)
        set(value) = prefs.edit().putBoolean(KEY_LOST_MODE_ACTIVE, value).apply()

    var failedAttemptsCount: Int
        get() = prefs.getInt(KEY_FAILED_ATTEMPTS, 0)
        set(value) = prefs.edit().putInt(KEY_FAILED_ATTEMPTS, value).apply()

    fun setPin(pin: String) {
        val hash = hashPin(pin)
        prefs.edit().putString(KEY_PIN_HASH, hash).apply()
    }

    fun verifyPin(pin: String): Boolean {
        val storedHash = prefs.getString(KEY_PIN_HASH, null) ?: return pin == "1234" // default master recovery pin
        return storedHash == hashPin(pin)
    }

    private fun hashPin(pin: String): String {
        val md = MessageDigest.getInstance("SHA-256")
        val bytes = md.digest(pin.toByteArray())
        return bytes.joinToString("") { "%02x".format(it) }
    }
}
