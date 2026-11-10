package com.securix.security.ui

import android.content.Context
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.os.VibrationEffect
import android.os.Vibrator
import android.view.View
import android.view.WindowManager
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.securix.security.databinding.ActivityFakePowerOffBinding

class FakePowerOffActivity : AppCompatActivity() {

    private lateinit var binding: ActivityFakePowerOffBinding
    private var tapCount = 0
    private var lastTapTime = 0L

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityFakePowerOffBinding.inflate(layoutInflater)
        setContentView(binding.root)

        window.addFlags(
            WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
                    WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD or
                    WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
        )

        // Show fake "Shutting down..." animation for 2.2 seconds then blackout
        Handler(Looper.getMainLooper()).postDelayed({
            binding.layoutShuttingDown.visibility = View.GONE
            vibrateShutdownBuzz()
            dimScreenToZero()
        }, 2200)

        // Secret escape sequence: 4 quick taps on the bottom right corner
        binding.secretEscapeZone.setOnClickListener {
            val now = System.currentTimeMillis()
            if (now - lastTapTime < 600) {
                tapCount++
            } else {
                tapCount = 1
            }
            lastTapTime = now

            if (tapCount >= 4) {
                Toast.makeText(this, "SECURIX: Fake Power-Off Exited", Toast.LENGTH_SHORT).show()
                finish()
            }
        }
    }

    private fun dimScreenToZero() {
        val lp = window.attributes
        lp.screenBrightness = 0.01f
        window.attributes = lp
    }

    private fun vibrateShutdownBuzz() {
        val vibrator = getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            vibrator.vibrate(VibrationEffect.createOneShot(300, VibrationEffect.DEFAULT_AMPLITUDE))
        } else {
            vibrator.vibrate(300)
        }
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        // Block back button
    }
}
