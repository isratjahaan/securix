package com.securix.security.ui

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.net.Uri
import android.os.Bundle
import android.view.WindowManager
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.securix.security.data.local.SecureStorage
import com.securix.security.databinding.ActivityLostModeBinding

class LostModeActivity : AppCompatActivity() {

    private lateinit var binding: ActivityLostModeBinding
    private lateinit var storage: SecureStorage

    private val exitReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            finish()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLostModeBinding.inflate(layoutInflater)
        setContentView(binding.root)

        storage = SecureStorage(this)

        // Show over lockscreen and keep screen on
        window.addFlags(
            WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
                    WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD or
                    WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON or
                    WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
        )

        binding.tvCustomLostMsg.text = storage.lostMessage
        binding.btnCallOwner.text = "CALL OWNER (${storage.emergencyPhone})"

        binding.btnCallOwner.setOnClickListener {
            val phone = storage.emergencyPhone
            val callIntent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:$phone"))
            startActivity(callIntent)
        }

        binding.btnSubmitUnlockPin.setOnClickListener {
            val entered = binding.etUnlockPin.text?.toString() ?: ""
            if (storage.verifyPin(entered)) {
                storage.isLostModeActive = false
                Toast.makeText(this, "Device unlocked successfully", Toast.LENGTH_SHORT).show()
                finish()
            } else {
                Toast.makeText(this, "Incorrect Security PIN!", Toast.LENGTH_SHORT).show()
                binding.etUnlockPin.text?.clear()
            }
        }

        registerReceiver(exitReceiver, IntentFilter("com.securix.security.EXIT_LOST_MODE"))
    }

    override fun onDestroy() {
        super.onDestroy()
        unregisterReceiver(exitReceiver)
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        // Prevent dismissal via back button while locked
    }
}
