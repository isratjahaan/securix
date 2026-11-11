package com.sis.cyberfortress.core.network

import com.google.gson.annotations.SerializedName

// --- Authentication ---
data class LoginRequest(
    @SerializedName("email") val email: String,
    @SerializedName("password") val password: String
)

data class LoginResponse(
    @SerializedName("success") val success: Boolean,
    @SerializedName("token") val token: String?,
    @SerializedName("refreshToken") val refreshToken: String?,
    @SerializedName("mfaRequired") val mfaRequired: Boolean = false,
    @SerializedName("sessionToken") val sessionToken: String? = null,
    @SerializedName("user") val user: UserDto? = null,
    @SerializedName("message") val message: String? = null
)

data class MfaVerifyRequest(
    @SerializedName("sessionToken") val sessionToken: String,
    @SerializedName("code") val code: String
)

data class RegisterRequest(
    @SerializedName("email") val email: String,
    @SerializedName("name") val name: String,
    @SerializedName("password") val password: String,
    @SerializedName("organization") val organization: String? = null
)

data class UserDto(
    @SerializedName("id") val id: String,
    @SerializedName("email") val email: String,
    @SerializedName("name") val name: String,
    @SerializedName("role") val role: String,
    @SerializedName("mfaEnabled") val mfaEnabled: Boolean = false,
    @SerializedName("status") val status: String = "ACTIVE",
    @SerializedName("department") val department: String? = null,
    @SerializedName("avatarUrl") val avatarUrl: String? = null,
    @SerializedName("createdAt") val createdAt: String? = null
)

// --- Dashboard & KPIs ---
data class KpiResponse(
    @SerializedName("totalUsers") val totalUsers: Int = 0,
    @SerializedName("activeUsers") val activeUsers: Int = 0,
    @SerializedName("registeredDevices") val registeredDevices: Int = 0,
    @SerializedName("onlineDevices") val onlineDevices: Int = 0,
    @SerializedName("totalModules") val totalModules: Int = 12,
    @SerializedName("activeModules") val activeModules: Int = 12,
    @SerializedName("securityAlerts") val securityAlerts: Int = 0,
    @SerializedName("criticalIncidents") val criticalIncidents: Int = 0,
    @SerializedName("openIncidents") val openIncidents: Int = 0,
    @SerializedName("resolvedIncidents") val resolvedIncidents: Int = 0,
    @SerializedName("threatIndicators") val threatIndicators: Int = 0,
    @SerializedName("backupJobs") val backupJobs: Int = 0,
    @SerializedName("failedBackupJobs") val failedBackupJobs: Int = 0,
    @SerializedName("postureScore") val postureScore: Int = 92,
    @SerializedName("postureGrade") val postureGrade: String = "A"
)

data class PostureResponse(
    @SerializedName("score") val score: Int,
    @SerializedName("grade") val grade: String,
    @SerializedName("breakdown") val breakdown: Map<String, Int>? = null
)

// --- Modules ---
data class ModuleDto(
    @SerializedName("id") val id: String,
    @SerializedName("code") val code: String,
    @SerializedName("name") val name: String,
    @SerializedName("description") val description: String,
    @SerializedName("status") val status: String, // ACTIVE, DISABLED, DEGRADED
    @SerializedName("version") val version: String,
    @SerializedName("healthPercent") val healthPercent: Int = 100,
    @SerializedName("iconName") val iconName: String? = null,
    @SerializedName("category") val category: String? = null,
    @SerializedName("lastHeartbeat") val lastHeartbeat: String? = null
)

data class ToggleModuleResponse(
    @SerializedName("success") val success: Boolean,
    @SerializedName("module") val module: ModuleDto? = null
)

// --- Security Alerts & Incidents ---
data class AlertDto(
    @SerializedName("id") val id: String,
    @SerializedName("title") val title: String,
    @SerializedName("severity") val severity: String, // CRITICAL, HIGH, MEDIUM, LOW
    @SerializedName("source") val source: String,
    @SerializedName("status") val status: String, // ACTIVE, ACKNOWLEDGED, RESOLVED
    @SerializedName("description") val description: String? = null,
    @SerializedName("timestamp") val timestamp: String,
    @SerializedName("acknowledgedBy") val acknowledgedBy: String? = null
)

data class IncidentDto(
    @SerializedName("id") val id: String,
    @SerializedName("title") val title: String,
    @SerializedName("severity") val severity: String,
    @SerializedName("status") val status: String, // OPEN, INVESTIGATING, MITIGATED, RESOLVED
    @SerializedName("assignedTo") val assignedTo: String? = null,
    @SerializedName("description") val description: String? = null,
    @SerializedName("createdAt") val createdAt: String
)

data class CreateIncidentRequest(
    @SerializedName("title") val title: String,
    @SerializedName("severity") val severity: String,
    @SerializedName("description") val description: String,
    @SerializedName("assignedTo") val assignedTo: String? = null
)

// --- Devices ---
data class DeviceDto(
    @SerializedName("id") val id: String,
    @SerializedName("name") val name: String,
    @SerializedName("platform") val platform: String, // ANDROID, WINDOWS, LINUX, MACOS
    @SerializedName("osVersion") val osVersion: String,
    @SerializedName("status") val status: String, // ONLINE, OFFLINE, QUARANTINED
    @SerializedName("ipAddress") val ipAddress: String? = null,
    @SerializedName("macAddress") val macAddress: String? = null,
    @SerializedName("complianceStatus") val complianceStatus: String = "COMPLIANT",
    @SerializedName("lastSeen") val lastSeen: String? = null,
    @SerializedName("userEmail") val userEmail: String? = null
)

data class RegisterDeviceRequest(
    @SerializedName("name") val name: String,
    @SerializedName("platform") val platform: String = "ANDROID",
    @SerializedName("osVersion") val osVersion: String,
    @SerializedName("ipAddress") val ipAddress: String? = null,
    @SerializedName("macAddress") val macAddress: String? = null
)

// --- Threat Intelligence ---
data class ThreatIndicatorDto(
    @SerializedName("id") val id: String,
    @SerializedName("type") val type: String, // IP, DOMAIN, HASH, URL
    @SerializedName("value") val value: String,
    @SerializedName("threatType") val threatType: String,
    @SerializedName("confidence") val confidence: Int,
    @SerializedName("source") val source: String,
    @SerializedName("createdAt") val createdAt: String
)

data class ThreatFeedDto(
    @SerializedName("id") val id: String,
    @SerializedName("name") val name: String,
    @SerializedName("status") val status: String,
    @SerializedName("indicatorsCount") val indicatorsCount: Int,
    @SerializedName("lastSyncedAt") val lastSyncedAt: String? = null
)

// --- Digital Forensics ---
data class ForensicCaseDto(
    @SerializedName("id") val id: String,
    @SerializedName("caseNumber") val caseNumber: String,
    @SerializedName("title") val title: String,
    @SerializedName("status") val status: String,
    @SerializedName("leadInvestigator") val leadInvestigator: String,
    @SerializedName("evidenceCount") val evidenceCount: Int = 0,
    @SerializedName("createdAt") val createdAt: String
)

// --- Vault & Cloud Backup ---
data class VaultMetadataDto(
    @SerializedName("totalItems") val totalItems: Int = 0,
    @SerializedName("lastSynced") val lastSynced: String? = null,
    @SerializedName("encryptedKeyChecksum") val encryptedKeyChecksum: String? = null,
    @SerializedName("zeroKnowledgeNotice") val zeroKnowledgeNotice: String = "Server has zero access to encryption keys or plaintext."
)

data class BackupJobDto(
    @SerializedName("id") val id: String,
    @SerializedName("target") val target: String,
    @SerializedName("status") val status: String, // SUCCESS, IN_PROGRESS, FAILED
    @SerializedName("sizeBytes") val sizeBytes: Long = 0,
    @SerializedName("encrypted") val encrypted: Boolean = true,
    @SerializedName("timestamp") val timestamp: String
)

// --- System Health ---
data class SystemHealthDto(
    @SerializedName("status") val status: String,
    @SerializedName("uptime") val uptime: Long = 0,
    @SerializedName("database") val database: String = "CONNECTED",
    @SerializedName("apiLatencyMs") val apiLatencyMs: Int = 12,
    @SerializedName("memoryUsagePercent") val memoryUsagePercent: Int = 42,
    @SerializedName("cpuUsagePercent") val cpuUsagePercent: Int = 18
)
