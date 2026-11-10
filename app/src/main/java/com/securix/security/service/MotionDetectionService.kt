package com.securix.security.service

import android.app.Service
import android.content.Context
import android.content.Intent
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.os.IBinder
import android.util.Log
import com.securix.security.data.local.SecureStorage
import kotlin.math.sqrt

class MotionDetectionService : Service(), SensorEventListener {

    private lateinit var sensorManager: SensorManager
    private var accelerometer: Sensor? = null
    private var proximity: Sensor? = null
    private lateinit var storage: SecureStorage

    private var wasInPocket = false
    private var lastMovementTime = 0L

    override fun onCreate() {
        super.onCreate()
        storage = SecureStorage(this)
        sensorManager = getSystemService(Context.SENSOR_SERVICE) as SensorManager
        accelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
        proximity = sensorManager.getDefaultSensor(Sensor.TYPE_PROXIMITY)

        accelerometer?.let {
            sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_NORMAL)
        }
        proximity?.let {
            sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_NORMAL)
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        sensorManager.unregisterListener(this)
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onSensorChanged(event: SensorEvent?) {
        if (event == null || !storage.isArmed || !storage.isPocketSnatchEnabled) return

        when (event.sensor.type) {
            Sensor.TYPE_PROXIMITY -> {
                val distance = event.values[0]
                val maxRange = event.sensor.maximumRange
                val isNear = distance < maxRange

                if (isNear) {
                    wasInPocket = true
                } else if (wasInPocket) {
                    // Removed from pocket!
                    wasInPocket = false
                    Log.w("SecurixMotion", "Device removed from pocket while armed!")
                    // Trigger alert if needed
                }
            }

            Sensor.TYPE_ACCELEROMETER -> {
                val x = event.values[0]
                val y = event.values[1]
                val z = event.values[2]

                val acceleration = sqrt((x * x + y * y + z * z).toDouble()) - SensorManager.GRAVITY_EARTH
                if (acceleration > 15.0) { // Sudden snatch threshold
                    val now = System.currentTimeMillis()
                    if (now - lastMovementTime > 5000) {
                        lastMovementTime = now
                        Log.w("SecurixMotion", "Sudden snatch detected! Accel: $acceleration")
                        val serviceIntent = Intent(this, SecurixForegroundService::class.java).apply {
                            action = SecurixForegroundService.ACTION_START_ALARM
                        }
                        startService(serviceIntent)
                    }
                }
            }
        }
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}
}
