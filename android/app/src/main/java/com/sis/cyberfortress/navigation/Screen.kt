package com.sis.cyberfortress.navigation

sealed class Screen(val route: String) {
    // Auth Routes
    object Splash : Screen("splash")
    object Onboarding : Screen("onboarding")
    object Login : Screen("login")
    object Register : Screen("register")
    object MfaVerify : Screen("mfa_verify/{sessionToken}") {
        fun createRoute(sessionToken: String) = "mfa_verify/$sessionToken"
    }
    object ForgotPassword : Screen("forgot_password")

    // Main Container
    object MainShell : Screen("main_shell")

    // 12 Cybersecurity Modules
    object IdentityGuardian : Screen("module_identity_guardian")
    object PhishingShield : Screen("module_phishing_shield")
    object EndpointGuardian : Screen("module_endpoint_guardian")
    object NetworkSentinel : Screen("module_network_sentinel")
    object VaultGuardian : Screen("module_vault_guardian")
    object RansomwareGuardian : Screen("module_ransomware_guardian")
    object WebShield : Screen("module_web_shield")
    object DigitalForensics : Screen("module_digital_forensics")
    object AccessGuardian : Screen("module_access_guardian")
    object ThreatIntelligence : Screen("module_threat_intelligence")
    object CloudBackupGuardian : Screen("module_cloud_backup_guardian")
    object CyberSoc : Screen("module_cyber_soc")

    // Operations & Management
    object DeviceManagement : Screen("device_management")
    object NotificationsCenter : Screen("notifications_center")
    object ReportsCompliance : Screen("reports_compliance")
    object AccountSecurity : Screen("account_security")
    object PrivacySettings : Screen("privacy_settings")
    object BackendSettings : Screen("backend_settings")
    object HelpFaq : Screen("help_faq")
    object About : Screen("about")
}
