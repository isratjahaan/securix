package com.securix.security.data.network

import android.util.Log
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.securix.security.data.model.DeviceStatus
import com.securix.security.data.model.IntruderAlert
import com.securix.security.data.model.RemoteCommand
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import java.util.concurrent.TimeUnit

class SecurixApiClient(private val baseUrl: String) {

    private val gson = Gson()
    private val client = OkHttpClient.Builder()
        .connectTimeout(10, TimeUnit.SECONDS)
        .readTimeout(10, TimeUnit.SECONDS)
        .writeTimeout(10, TimeUnit.SECONDS)
        .build()

    private val jsonMediaType = "application/json; charset=utf-8".toMediaType()

    suspend fun sendHeartbeat(status: DeviceStatus): Boolean = withContext(Dispatchers.IO) {
        try {
            val json = gson.toJson(status)
            val request = Request.Builder()
                .url("$baseUrl/api/device/heartbeat")
                .post(json.toRequestBody(jsonMediaType))
                .build()

            client.newCall(request).execute().use { response ->
                response.isSuccessful
            }
        } catch (e: Exception) {
            Log.w("SecurixApiClient", "Heartbeat error: ${e.message}")
            false
        }
    }

    suspend fun getPendingCommands(deviceId: String): List<RemoteCommand> = withContext(Dispatchers.IO) {
        try {
            val request = Request.Builder()
                .url("$baseUrl/api/device/$deviceId/commands")
                .get()
                .build()

            client.newCall(request).execute().use { response ->
                if (response.isSuccessful) {
                    val body = response.body?.string() ?: return@use emptyList()
                    val listType = object : TypeToken<List<RemoteCommand>>() {}.type
                    gson.fromJson<List<RemoteCommand>>(body, listType) ?: emptyList()
                } else {
                    emptyList()
                }
            }
        } catch (e: Exception) {
            Log.w("SecurixApiClient", "Fetch commands error: ${e.message}")
            emptyList()
        }
    }

    suspend fun updateCommandStatus(
        deviceId: String,
        commandId: String,
        status: String,
        resultMessage: String
    ): Boolean = withContext(Dispatchers.IO) {
        try {
            val payload = mapOf(
                "deviceId" to deviceId,
                "commandId" to commandId,
                "status" to status,
                "resultMessage" to resultMessage
            )
            val json = gson.toJson(payload)
            val request = Request.Builder()
                .url("$baseUrl/api/device/command-result")
                .post(json.toRequestBody(jsonMediaType))
                .build()

            client.newCall(request).execute().use { response ->
                response.isSuccessful
            }
        } catch (e: Exception) {
            Log.w("SecurixApiClient", "Update command status error: ${e.message}")
            false
        }
    }

    suspend fun uploadIntruderAlert(alert: IntruderAlert): Boolean = withContext(Dispatchers.IO) {
        try {
            val json = gson.toJson(alert)
            val request = Request.Builder()
                .url("$baseUrl/api/device/intruder-alert")
                .post(json.toRequestBody(jsonMediaType))
                .build()

            client.newCall(request).execute().use { response ->
                response.isSuccessful
            }
        } catch (e: Exception) {
            Log.w("SecurixApiClient", "Upload intruder alert error: ${e.message}")
            false
        }
    }
}
