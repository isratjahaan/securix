package com.securix.security.ui

import android.Manifest
import android.app.admin.DevicePolicyManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import com.securix.security.R
import com.securix.security.data.local.SecureStorage
import com.securix.security.databinding.ActivityMainBinding
import com.securix.security.receiver.SecurixDeviceAdminReceiver
import com.securix.security.service.SecurixForegroundService

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var storage: SecureStorage

    private val permissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        val allGranted = permissions.entries.all { it.value }
        if (allGranted) {
            startSecurityEngine()
        } else {
            Toast.makeText(this, "Permissions required for anti-theft defense", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        storage = SecureStorage(this)

        setupUI()
        checkPermissionsAndStart()
    }

    override fun onResume() {
        super.onResume()
        updateStatusCards()
    }

    private fun setupUI() {
        binding.tvDeviceTelemetry.text = "Device ID: ${storage.deviceId} • Ready"

        binding.switchAntiPowerOff.isChecked = storage.isAntiPowerOffEnabled
        binding.switchAntiPowerOff.setOnCheckedChangeListener { _, isChecked ->
            storage.isAntiPowerOffEnabled = isChecked
        }

        binding.switchPocketSnatch.isChecked = storage.isPocketSnatchEnabled
        binding.switchPocketSnatch.setOnCheckedChangeListener { _, isChecked ->
            storage.isPocketSnatchEnabled = isChecked
        }

        binding.switchIntruderSelfie.isChecked = storage.isIntruderSelfieEnabled
        binding.switchIntruderSelfie.setOnCheckedChangeListener { _, isChecked ->
            storage.isIntruderSelfieEnabled = isChecked
        }

        binding.switchSimGuard.isChecked = storage.isSimGuardEnabled
        binding.switchSimGuard.setOnCheckedChangeListener { _, isChecked ->
            storage.isSimGuardEnabled = isChecked
        }

        binding.btnToggleArm.setOnClickListener {
            storage.isArmed = !storage.isArmed
            updateStatusCards()
        }

        binding.btnLockNow.setOnClickListener {
            val dpm = getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
            val admin = SecurixDeviceAdminReceiver.getComponentName(this)
            if (dpm.isAdminActive(admin)) {
                dpm.lockNow()
            } else {
                requestDeviceAdmin()
            }
        }

        binding.btnSoundAlarm.setOnClickListener {
            val serviceIntent = Intent(this, SecurixForegroundService::class.java).apply {
                action = SecurixForegroundService.ACTION_START_ALARM
            }
            startService(serviceIntent)
            Toast.makeText(this, "Alarm siren activated!", Toast.LENGTH_SHORT).show()
        }

        binding.btnFakePowerOff.setOnClickListener {
            val fakeIntent = Intent(this, FakePowerOffActivity::class.java)
            startActivity(fakeIntent)
        }

        binding.btnLostMode.setOnClickListener {
            val lostIntent = Intent(this, LostModeActivity::class.java)
            startActivity(lostIntent)
        }

        binding.btnViewEnrollment.setOnClickListener {
            val enrollIntent = Intent(this, EnrollmentActivity::class.java)
            startActivity(enrollIntent)
        }
    }

    private fun updateStatusCards() {
        val dpm = getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
        val isDO = dpm.isDeviceOwnerApp(packageName)

        if (isDO) {
            binding.tvModeBadge.text = "MODE B: DEVICE OWNER"
            binding.tvModeBadge.setTextColor(ContextCompat.getColor(this, R.color.primary_emerald))
        } else {
            binding.tvModeBadge.text = "MODE A: STANDARD"
            binding.tvModeBadge.setTextColor(ContextCompat.getColor(this, R.color.accent_cyan))
        }

        if (storage.isArmed) {
            binding.tvShieldStatus.text = "SYSTEM FULLY ARMED"
            binding.tvShieldStatus.setTextColor(ContextCompat.getColor(this, R.color.primary_emerald))
            binding.btnToggleArm.text = "DISARM ANTI-THEFT"
            binding.btnToggleArm.setBackgroundColor(ContextCompat.getColor(this, R.color.primary_emerald))
            binding.cardSecurityStatus.strokeColor = ContextCompat.getColor(this, R.color.primary_emerald)
        } else {
            binding.tvShieldStatus.text = "SYSTEM DISARMED"
            binding.tvShieldStatus.setTextColor(ContextCompat.getColor(this, R.color.warning_amber))
            binding.btnToggleArm.text = "ARM ANTI-THEFT SHIELD"
            binding.btnToggleArm.setBackgroundColor(ContextCompat.getColor(this, R.color.warning_amber))
            binding.cardSecurityStatus.strokeColor = ContextCompat.getColor(this, R.color.warning_amber)
        }
    }

    private fun checkPermissionsAndStart() {
        val needed = mutableListOf(
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_COARSE_LOCATION,
            Manifest.permission.CAMERA,
            Manifest.permission.RECORD_AUDIO
        )

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            needed.add(Manifest.permission.POST_NOTIFICATIONS)
        }

        val missing = needed.filter {
            ContextCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED
        }

        if (missing.isNotEmpty()) {
            permissionLauncher.launch(missing.toTypedArray())
        } else {
            startSecurityEngine()
        }

        // Check Device Admin
        val dpm = getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
        val admin = SecurixDeviceAdminReceiver.getComponentName(this)
        if (!dpm.isAdminActive(admin)) {
            requestDeviceAdmin()
        }
    }

    private fun requestDeviceAdmin() {
        val admin = SecurixDeviceAdminReceiver.getComponentName(this)
        val intent = Intent(DevicePolicyManager.ACTION_ADD_DEVICE_ADMIN).apply {
            putExtra(DevicePolicyManager.EXTRA_DEVICE_ADMIN, admin)
            putExtra(
                DevicePolicyManager.EXTRA_ADD_EXPLANATION,
                "SECURIX requires Device Administrator permissions to enforce remote lock, anti-theft wipe, and failed password attempt tracking."
            )
        }
        startActivity(intent)
    }

    private fun startSecurityEngine() {
        val serviceIntent = Intent(this, SecurixForegroundService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(serviceIntent)
        } else {
            startService(serviceIntent)
        }
    }
}
