package com.sis.cyberfortress.core.network

import retrofit2.Response
import retrofit2.http.*

interface ApiService {

    // --- Authentication ---
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>

    @POST("auth/mfa/verify")
    suspend fun verifyMfa(@Body request: MfaVerifyRequest): Response<LoginResponse>

    @POST("auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<LoginResponse>

    @GET("auth/me")
    suspend fun getCurrentUser(): Response<UserDto>

    @POST("auth/logout")
    suspend fun logout(): Response<Map<String, Any>>

    // --- Dashboard & KPIs ---
    @GET("dashboard/kpis")
    suspend fun getKpis(): Response<KpiResponse>

    @GET("dashboard/posture")
    suspend fun getPostureScore(): Response<PostureResponse>

    // --- Cybersecurity Modules ---
    @GET("modules")
    suspend fun getModules(): Response<List<ModuleDto>>

    @GET("modules/{id}")
    suspend fun getModuleById(@Path("id") id: String): Response<ModuleDto>

    @POST("modules/{id}/toggle")
    suspend fun toggleModule(@Path("id") id: String): Response<ToggleModuleResponse>

    // --- Security Operations & Alerts ---
    @GET("soc/alerts")
    suspend fun getAlerts(): Response<List<AlertDto>>

    @POST("soc/alerts/{id}/acknowledge")
    suspend fun acknowledgeAlert(@Path("id") id: String): Response<Map<String, Any>>

    @GET("soc/incidents")
    suspend fun getIncidents(): Response<List<IncidentDto>>

    @POST("soc/incidents")
    suspend fun createIncident(@Body request: CreateIncidentRequest): Response<IncidentDto>

    // --- Asset & Device Management ---
    @GET("devices")
    suspend fun getDevices(): Response<List<DeviceDto>>

    @POST("devices")
    suspend fun registerDevice(@Body request: RegisterDeviceRequest): Response<DeviceDto>

    @GET("devices/{id}/command-state")
    suspend fun getDeviceCommandState(@Path("id") id: String): Response<DeviceCommandState>

    @POST("devices/{id}/heartbeat")
    suspend fun sendDeviceHeartbeat(
        @Path("id") id: String,
        @Body request: DeviceHeartbeatRequest
    ): Response<DeviceCommandState>

    @POST("devices/{id}/lock")
    suspend fun lockDevice(
        @Path("id") id: String,
        @Body body: Map<String, String> = emptyMap()
    ): Response<Map<String, Any>>

    @POST("devices/{id}/unlock")
    suspend fun unlockDevice(@Path("id") id: String): Response<Map<String, Any>>

    @POST("devices/{id}/scan")
    suspend fun triggerRemoteScan(@Path("id") id: String): Response<ScanResultResponse>

    // --- Threat Intelligence ---
    @GET("threat-intelligence/indicators")
    suspend fun getThreatIndicators(): Response<List<ThreatIndicatorDto>>

    @GET("threat-intelligence/feeds")
    suspend fun getThreatFeeds(): Response<List<ThreatFeedDto>>

    // --- Digital Forensics ---
    @GET("forensics/cases")
    suspend fun getForensicCases(): Response<List<ForensicCaseDto>>

    // --- Vault & Cloud Backup ---
    @GET("vault/metadata")
    suspend fun getVaultMetadata(): Response<VaultMetadataDto>

    @GET("backups/jobs")
    suspend fun getBackupJobs(): Response<List<BackupJobDto>>

    @POST("backups/jobs/{id}/verify")
    suspend fun verifyBackupJob(@Path("id") id: String): Response<Map<String, Any>>

    // --- System & Integration Health ---
    @GET("health/system")
    suspend fun getSystemHealth(): Response<SystemHealthDto>
}
