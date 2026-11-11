package com.sis.cyberfortress.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.sis.cyberfortress.ui.screens.auth.*
import com.sis.cyberfortress.ui.screens.main.MainShellScreen
import com.sis.cyberfortress.ui.screens.modules.*
import com.sis.cyberfortress.ui.screens.settings.*

@Composable
fun AppNavGraph(
    navController: NavHostController = rememberNavController()
) {
    NavHost(
        navController = navController,
        startDestination = Screen.Splash.route
    ) {
        // --- Auth Flows ---
        composable(Screen.Splash.route) {
            SplashScreen(
                onNavigateToLogin = {
                    navController.navigate(Screen.Login.route) {
                        popUpTo(Screen.Splash.route) { inclusive = true }
                    }
                },
                onNavigateToHome = {
                    navController.navigate(Screen.MainShell.route) {
                        popUpTo(Screen.Splash.route) { inclusive = true }
                    }
                }
            )
        }

        composable(Screen.Onboarding.route) {
            OnboardingScreen(
                onNavigateToLogin = {
                    navController.navigate(Screen.Login.route) {
                        popUpTo(Screen.Onboarding.route) { inclusive = true }
                    }
                }
            )
        }

        composable(Screen.Login.route) {
            LoginScreen(
                onNavigateToHome = {
                    navController.navigate(Screen.MainShell.route) {
                        popUpTo(Screen.Login.route) { inclusive = true }
                    }
                },
                onNavigateToRegister = {
                    navController.navigate(Screen.Register.route)
                },
                onNavigateToForgotPassword = {
                    navController.navigate(Screen.ForgotPassword.route)
                },
                onNavigateToBackendSettings = {
                    navController.navigate(Screen.BackendSettings.route)
                },
                onNavigateToMfa = { sessionToken ->
                    navController.navigate(Screen.MfaVerify.createRoute(sessionToken))
                }
            )
        }

        composable(Screen.Register.route) {
            RegisterScreen(
                onNavigateToLogin = { navController.popBackStack() }
            )
        }

        composable(
            route = Screen.MfaVerify.route,
            arguments = listOf(navArgument("sessionToken") { type = NavType.StringType })
        ) { backStackEntry ->
            val sessionToken = backStackEntry.arguments?.getString("sessionToken") ?: ""
            MfaVerifyScreen(
                sessionToken = sessionToken,
                onNavigateToHome = {
                    navController.navigate(Screen.MainShell.route) {
                        popUpTo(Screen.Login.route) { inclusive = true }
                    }
                },
                onBackClick = { navController.popBackStack() }
            )
        }

        composable(Screen.ForgotPassword.route) {
            ForgotPasswordScreen(
                onBackClick = { navController.popBackStack() }
            )
        }

        // --- Main Shell Container ---
        composable(Screen.MainShell.route) {
            MainShellScreen(
                onNavigateToModule = { route -> navController.navigate(route) },
                onNavigateToDevices = { navController.navigate(Screen.DeviceManagement.route) },
                onNavigateToNotifications = { navController.navigate(Screen.NotificationsCenter.route) },
                onNavigateToReports = { navController.navigate(Screen.ReportsCompliance.route) },
                onNavigateToSecurity = { navController.navigate(Screen.AccountSecurity.route) },
                onNavigateToPrivacy = { navController.navigate(Screen.PrivacySettings.route) },
                onNavigateToBackendSettings = { navController.navigate(Screen.BackendSettings.route) },
                onNavigateToHelp = { navController.navigate(Screen.HelpFaq.route) },
                onNavigateToAbout = { navController.navigate(Screen.About.route) },
                onLogout = {
                    navController.navigate(Screen.Login.route) {
                        popUpTo(Screen.MainShell.route) { inclusive = true }
                    }
                }
            )
        }

        // --- 12 Cybersecurity Modules ---
        composable(Screen.IdentityGuardian.route) {
            IdentityGuardianScreen(onBackClick = { navController.popBackStack() })
        }
        composable(Screen.PhishingShield.route) {
            PhishingShieldScreen(onBackClick = { navController.popBackStack() })
        }
        composable(Screen.EndpointGuardian.route) {
            EndpointGuardianScreen(onBackClick = { navController.popBackStack() })
        }
        composable(Screen.NetworkSentinel.route) {
            NetworkSentinelScreen(onBackClick = { navController.popBackStack() })
        }
        composable(Screen.VaultGuardian.route) {
            VaultGuardianScreen(onBackClick = { navController.popBackStack() })
        }
        composable(Screen.RansomwareGuardian.route) {
            RansomwareGuardianScreen(onBackClick = { navController.popBackStack() })
        }
        composable(Screen.WebShield.route) {
            WebShieldScreen(onBackClick = { navController.popBackStack() })
        }
        composable(Screen.DigitalForensics.route) {
            DigitalForensicsScreen(onBackClick = { navController.popBackStack() })
        }
        composable(Screen.AccessGuardian.route) {
            AccessGuardianScreen(onBackClick = { navController.popBackStack() })
        }
        composable(Screen.ThreatIntelligence.route) {
            ThreatIntelligenceScreen(onBackClick = { navController.popBackStack() })
        }
        composable(Screen.CloudBackupGuardian.route) {
            CloudBackupGuardianScreen(onBackClick = { navController.popBackStack() })
        }
        composable(Screen.CyberSoc.route) {
            CyberSocScreen(onBackClick = { navController.popBackStack() })
        }

        // --- Settings & Operations ---
        composable(Screen.DeviceManagement.route) {
            DeviceManagementScreen(onBackClick = { navController.popBackStack() })
        }
        composable(Screen.NotificationsCenter.route) {
            NotificationsCenterScreen(onBackClick = { navController.popBackStack() })
        }
        composable(Screen.ReportsCompliance.route) {
            ReportsComplianceScreen(onBackClick = { navController.popBackStack() })
        }
        composable(Screen.AccountSecurity.route) {
            AccountSecurityScreen(onBackClick = { navController.popBackStack() })
        }
        composable(Screen.PrivacySettings.route) {
            PrivacySettingsScreen(onBackClick = { navController.popBackStack() })
        }
        composable(Screen.BackendSettings.route) {
            BackendSettingsScreen(onBackClick = { navController.popBackStack() })
        }
        composable(Screen.HelpFaq.route) {
            HelpFaqScreen(onBackClick = { navController.popBackStack() })
        }
        composable(Screen.About.route) {
            AboutScreen(onBackClick = { navController.popBackStack() })
        }
    }
}
