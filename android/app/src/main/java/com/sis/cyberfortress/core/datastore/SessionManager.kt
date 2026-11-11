package com.sis.cyberfortress.core.datastore

import android.content.Context
import android.content.SharedPreferences
import com.google.gson.Gson
import com.sis.cyberfortress.core.network.UserDto

class SessionManager(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("sis_cyber_fortress_prefs", Context.MODE_PRIVATE)
    private val gson = Gson()

    companion object {
        private const val KEY_AUTH_TOKEN = "auth_token"
        private const val KEY_REFRESH_TOKEN = "refresh_token"
        private const val KEY_CURRENT_USER = "current_user"
        private const val KEY_BACKEND_URL = "backend_url"
        private const val KEY_BIOMETRIC_ENABLED = "biometric_enabled"
        private const val KEY_DARK_MODE = "dark_mode"
        private const val KEY_OFFLINE_MODE = "offline_mode"

        // Default Android Emulator loopback to host port 4000
        const val DEFAULT_BASE_URL = "http://10.0.2.2:4000/api/"
        const val LOCALHOST_BASE_URL = "http://localhost:4000/api/"

        @Volatile
        private var instance: SessionManager? = null

        fun getInstance(context: Context): SessionManager {
            return instance ?: synchronized(this) {
                instance ?: SessionManager(context.applicationContext).also { instance = it }
            }
        }
    }

    var authToken: String?
        get() = prefs.getString(KEY_AUTH_TOKEN, null)
        set(value) = prefs.edit().putString(KEY_AUTH_TOKEN, value).apply()

    var refreshToken: String?
        get() = prefs.getString(KEY_REFRESH_TOKEN, null)
        set(value) = prefs.edit().putString(KEY_REFRESH_TOKEN, value).apply()

    var backendUrl: String
        get() = prefs.getString(KEY_BACKEND_URL, DEFAULT_BASE_URL) ?: DEFAULT_BASE_URL
        set(value) {
            val formatted = if (value.endsWith("/")) value else "$value/"
            prefs.edit().putString(KEY_BACKEND_URL, formatted).apply()
        }

    var isBiometricEnabled: Boolean
        get() = prefs.getBoolean(KEY_BIOMETRIC_ENABLED, false)
        set(value) = prefs.edit().putBoolean(KEY_BIOMETRIC_ENABLED, value).apply()

    var isDarkMode: Boolean
        get() = prefs.getBoolean(KEY_DARK_MODE, true)
        set(value) = prefs.edit().putBoolean(KEY_DARK_MODE, value).apply()

    var currentUser: UserDto?
        get() {
            val json = prefs.getString(KEY_CURRENT_USER, null) ?: return null
            return try {
                gson.fromJson(json, UserDto::class.java)
            } catch (e: Exception) {
                null
            }
        }
        set(value) {
            val json = if (value != null) gson.toJson(value) else null
            prefs.edit().putString(KEY_CURRENT_USER, json).apply()
        }

    val isLoggedIn: Boolean
        get() = !authToken.isNullOrEmpty()

    fun clearSession() {
        prefs.edit()
            .remove(KEY_AUTH_TOKEN)
            .remove(KEY_REFRESH_TOKEN)
            .remove(KEY_CURRENT_USER)
            .apply()
    }
}
