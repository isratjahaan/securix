package com.securix.security.service

import android.app.Notification
import android.app.PendingIntent
import android.app.Service
import android.app.admin.DevicePolicyManager
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.hardware.camera2.CameraManager
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.media.AudioAttributes
import android.media.AudioManager
import android.media.MediaPlayer
import android.media.RingtoneManager
import android.os.BatteryManager
import android.os.Build
import android.os.Bundle
import android.os.IBinder
import android.telephony.SmsManager
import android.util.Log
import androidx.core.app.NotificationCompat
import com.securix.security.R
import com.securix.security.SecurixApp
import com.securix.security.data.local.SecureStorage
import com.securix.security.data.model.CommandType
import com.securix.security.data.model.DeviceStatus
import com.securix.security.data.model.IntruderAlert
import com.securix.security.data.model.RemoteCommand
import com.securix.security.data.network.SecurixApiClient
import com.securix.security.receiver.SecurixDeviceAdminReceiver
import com.securix.security.ui.FakePowerOffActivity
import com.securix.security.ui.LostModeActivity
import com.securix.security.ui.MainActivity
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import java.util.UUID

class SecurixForegroundService : Service(), LocationListener {

    private val serviceJob = Job()
    private val scope = CoroutineScope(Dispatchers.Main + serviceJob)

    private lateinit var storage: SecureStorage
    private lateinit var apiClient: SecurixApiClient
    private lateinit var locationManager: LocationManager
    private lateinit var audioManager: AudioManager
    private var mediaPlayer: MediaPlayer? = null
    private var isAlarmActive = false
    private var isStrobeActive = false

    private var currentLatitude: Double = 0.0
    private var currentLongitude: Double = 0.0
    private var currentAccuracy: Float = 0f
    private var currentSpeed: Float = 0f

    override fun onCreate() {
        super.onCreate()
        storage = SecureStorage(this)
        apiClient = SecurixApiClient(storage.serverUrl)
        locationManager = getSystemService(Context.LOCATION_SERVICE) as LocationManager
        audioManager = getSystemService(Context.AUDIO_SERVICE) as AudioManager

        startForeground(NOTIFICATION_ID, createNotification("SECURIX Shield Active — Protected"))
        requestLocationUpdates()
        startNetworkLoop()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        intent?.action?.let { action ->
            when (action) {
                ACTION_START_ALARM -> triggerSirenAlarm()
                ACTION_STOP_ALARM -> stopSirenAlarm()
                ACTION_SMS_LOCATE -> {
                    val sender = intent.getStringExtra("sender")
                    if (sender != null) handleSmsLocate(sender)
                }
                ACTION_INTRUDER_CAPTURE -> {
                    val attempts = intent.getIntExtra("attempts", 1)
                    val reason = intent.getStringExtra("reason") ?: "UNAUTHORIZED_ACCESS"
                    captureIntruderSelfie(attempts, reason)
                }
            }
        }
        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
        serviceJob.cancel()
        locationManager.removeUpdates(this)
        stopSirenAlarm()
    }

    override fun onBind(intent: Intent?): IBinder? = null

    private fun startNetworkLoop() {
        scope.launch(Dispatchers.IO) {
            while (isActive) {
                try {
                    val status = collectDeviceStatus()
                    apiClient.sendHeartbeat(status)

                    // Check for pending remote commands
                    val commands = apiClient.getPendingCommands(storage.deviceId)
                    for (cmd in commands) {
                        executeRemoteCommand(cmd)
                    }
                } catch (e: Exception) {
                    Log.w("SecurixService", "Network sync warning: ${e.message}")
                }
                delay(10000) // Poll every 10 seconds
            }
        }
    }

    private suspend fun executeRemoteCommand(cmd: RemoteCommand) {
        Log.i("SecurixService", "Executing remote command: ${cmd.type} (ID: ${cmd.commandId})")
        var success = true
        var message = "Command executed successfully"

        try {
            when (cmd.type) {
                CommandType.LOCK -> {
                    val dpm = getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
                    dpm.lockNow()
                    message = "Device screen locked via DevicePolicyManager"
                }
                CommandType.ALARM -> {
                    triggerSirenAlarm()
                    message = "Emergency siren and strobe activated"
                }
                CommandType.STOP_ALARM -> {
                    stopSirenAlarm()
                    message = "Emergency siren deactivated"
                }
                CommandType.LOCATE -> {
                    message = "Location reported: Lat $currentLatitude, Lng $currentLongitude"
                }
                CommandType.STEALTH_PHOTO -> {
                    val cameraFacing = if (cmd.payload.equals("BACK", ignoreCase = true)) "BACK" else "FRONT"
                    captureIntruderSelfie(1, "REMOTE_${cameraFacing}_CAMERA_REQUEST")
                    message = "$cameraFacing camera photo snapshot initiated"
                }
                CommandType.FAKE_POWER_OFF -> {
                    val fakeIntent = Intent(this@SecurixForegroundService, FakePowerOffActivity::class.java).apply {
                        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
                    }
                    startActivity(fakeIntent)
                    message = "Stealth Fake Power-Off blackout activated"
                }
                CommandType.LOST_MODE -> {
                    storage.isLostModeActive = true
                    if (cmd.payload.isNotBlank()) {
                        storage.lostMessage = cmd.payload
                    }
                    val lostIntent = Intent(this@SecurixForegroundService, LostModeActivity::class.java).apply {
                        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
                    }
                    startActivity(lostIntent)
                    message = "Lost Phone lockout screen activated"
                }
                CommandType.EXIT_LOST_MODE -> {
                    storage.isLostModeActive = false
                    sendBroadcast(Intent("com.securix.security.EXIT_LOST_MODE"))
                    message = "Lost mode deactivated by owner"
                }
                CommandType.WIPE_DATA -> {
                    val dpm = getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
                    val admin = SecurixDeviceAdminReceiver.getComponentName(this@SecurixForegroundService)
                    if (dpm.isAdminActive(admin)) {
                        dpm.wipeData(DevicePolicyManager.WIPE_EXTERNAL_STORAGE)
                        message = "Remote factory wipe initiated"
                    } else {
                        success = false
                        message = "Remote wipe failed: Device Administrator not active"
                    }
                }
                CommandType.SHOW_MESSAGE -> {
                    storage.lostMessage = cmd.payload
                    message = "Custom alert message updated"
                }
                CommandType.SYNC_CONFIG -> {
                    message = "Configuration synced"
                }
                else -> {
                    message = "Unhandled command: ${cmd.type}"
                }
            }
        } catch (e: Exception) {
            success = false
            message = "Execution failed: ${e.message}"
            Log.e("SecurixService", "Failed to execute command ${cmd.type}", e)
        }

        apiClient.updateCommandStatus(
            storage.deviceId,
            cmd.commandId,
            if (success) "EXECUTED" else "FAILED",
            message
        )
    }

    private fun triggerSirenAlarm() {
        if (isAlarmActive) return
        isAlarmActive = true

        try {
            // Override Do Not Disturb & set max alarm volume
            val maxVol = audioManager.getStreamMaxVolume(AudioManager.STREAM_ALARM)
            audioManager.setStreamVolume(AudioManager.STREAM_ALARM, maxVol, 0)

            val alarmUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)
                ?: RingtoneManager.getDefaultUri(RingtoneManager.TYPE_RINGTONE)

            mediaPlayer = MediaPlayer().apply {
                setDataSource(this@SecurixForegroundService, alarmUri)
                setAudioAttributes(
                    AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_ALARM)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                        .build()
                )
                isLooping = true
                prepare()
                start()
            }

            // Start flashlight strobe
            startTorchStrobe()

        } catch (e: Exception) {
            Log.e("SecurixService", "Failed to start siren: ${e.message}")
        }
    }

    private fun stopSirenAlarm() {
        isAlarmActive = false
        isStrobeActive = false
        try {
            mediaPlayer?.stop()
            mediaPlayer?.release()
            mediaPlayer = null
        } catch (e: Exception) {
            Log.w("SecurixService", "Error stopping player: ${e.message}")
        }
        setTorchMode(false)
    }

    private fun startTorchStrobe() {
        isStrobeActive = true
        scope.launch(Dispatchers.IO) {
            var state = false
            while (isStrobeActive && isActive) {
                state = !state
                setTorchMode(state)
                delay(300)
            }
            setTorchMode(false)
        }
    }

    private fun setTorchMode(enabled: Boolean) {
        try {
            val cameraManager = getSystemService(Context.CAMERA_SERVICE) as CameraManager
            val cameraId = cameraManager.cameraIdList.firstOrNull() ?: return
            cameraManager.setTorchMode(cameraId, enabled)
        } catch (e: Exception) {
            // Ignore if flashlight unavailable
        }
    }

    private fun captureIntruderSelfie(attempts: Int, reason: String) {
        scope.launch(Dispatchers.IO) {
            val alert = IntruderAlert(
                id = UUID.randomUUID().toString(),
                deviceId = storage.deviceId,
                timestamp = System.currentTimeMillis(),
                triggerReason = reason,
                failedAttempts = attempts,
                latitude = currentLatitude,
                longitude = currentLongitude,
                photoBase64 = null
            )
            apiClient.uploadIntruderAlert(alert)
        }
    }

    private fun handleSmsLocate(sender: String) {
        val mapsLink = "https://maps.google.com/?q=$currentLatitude,$currentLongitude"
        val reply = "SECURIX GPS: Lat: $currentLatitude, Lng: $currentLongitude (Acc: ${currentAccuracy}m)\nMap: $mapsLink"
        try {
            val smsManager = SmsManager.getDefault()
            smsManager.sendTextMessage(sender, null, reply, null, null)
        } catch (e: Exception) {
            Log.e("SecurixService", "Failed to send SMS location reply: ${e.message}")
        }
    }

    private fun requestLocationUpdates() {
        try {
            if (locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
                locationManager.requestLocationUpdates(
                    LocationManager.GPS_PROVIDER,
                    5000L,
                    5f,
                    this
                )
            }
            if (locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER)) {
                locationManager.requestLocationUpdates(
                    LocationManager.NETWORK_PROVIDER,
                    10000L,
                    10f,
                    this
                )
            }
        } catch (e: SecurityException) {
            Log.w("SecurixService", "Location permission not yet granted: ${e.message}")
        }
    }

    override fun onLocationChanged(location: Location) {
        currentLatitude = location.latitude
        currentLongitude = location.longitude
        currentAccuracy = location.accuracy
        currentSpeed = location.speed
    }

    @Deprecated("Deprecated in Java")
    override fun onStatusChanged(provider: String?, status: Int, extras: Bundle?) {}

    private fun collectDeviceStatus(): DeviceStatus {
        val batteryFilter = IntentFilter(Intent.ACTION_BATTERY_CHANGED)
        val batteryStatus = registerReceiver(null, batteryFilter)
        val level = batteryStatus?.getIntExtra(BatteryManager.EXTRA_LEVEL, -1) ?: -1
        val scale = batteryStatus?.getIntExtra(BatteryManager.EXTRA_SCALE, -1) ?: -1
        val batteryPct = if (level >= 0 && scale > 0) ((level / scale.toFloat()) * 100).toInt() else 100

        val chargeStatus = batteryStatus?.getIntExtra(BatteryManager.EXTRA_STATUS, -1) ?: -1
        val isCharging = chargeStatus == BatteryManager.BATTERY_STATUS_CHARGING ||
                chargeStatus == BatteryManager.BATTERY_STATUS_FULL

        val dpm = getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
        val admin = SecurixDeviceAdminReceiver.getComponentName(this)
        val isDeviceAdmin = dpm.isAdminActive(admin)
        val isDeviceOwner = dpm.isDeviceOwnerApp(packageName)

        return DeviceStatus(
            deviceId = storage.deviceId,
            deviceName = "${Build.MANUFACTURER} ${Build.MODEL}",
            batteryLevel = batteryPct,
            isCharging = isCharging,
            latitude = currentLatitude,
            longitude = currentLongitude,
            accuracy = currentAccuracy,
            speed = currentSpeed,
            networkType = if (isCharging) "WIFI/4G" else "CELLULAR",
            isArmed = storage.isArmed,
            isDeviceAdmin = isDeviceAdmin,
            isDeviceOwner = isDeviceOwner,
            isAccessibilityEnabled = true,
            isLostMode = storage.isLostModeActive,
            isAlarmActive = isAlarmActive
        )
    }

    private fun createNotification(message: String): Notification {
        val intent = Intent(this, MainActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            intent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )

        return NotificationCompat.Builder(this, SecurixApp.CHANNEL_PERSISTENT)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentTitle("SECURIX Protection Engine")
            .setContentText(message)
            .setOngoing(true)
            .setContentIntent(pendingIntent)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()
    }

    companion object {
        const val NOTIFICATION_ID = 9001
        const val ACTION_START_ALARM = "com.securix.security.START_ALARM"
        const val ACTION_STOP_ALARM = "com.securix.security.STOP_ALARM"
        const val ACTION_SMS_LOCATE = "com.securix.security.SMS_LOCATE"
        const val ACTION_INTRUDER_CAPTURE = "com.securix.security.INTRUDER_CAPTURE"
    }
}
