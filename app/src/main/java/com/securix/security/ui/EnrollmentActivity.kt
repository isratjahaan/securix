package com.securix.security.ui

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.securix.security.databinding.ActivityEnrollmentBinding

class EnrollmentActivity : AppCompatActivity() {

    private lateinit var binding: ActivityEnrollmentBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityEnrollmentBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.btnCopyAdb.setOnClickListener {
            val cmd = binding.tvAdbCommand.text.toString()
            val clipboard = getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
            clipboard.setPrimaryClip(ClipData.newPlainText("Securix ADB Command", cmd))
            Toast.makeText(this, "ADB Command copied to clipboard!", Toast.LENGTH_SHORT).show()
        }
    }
}
