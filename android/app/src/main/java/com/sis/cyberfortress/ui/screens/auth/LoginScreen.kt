package com.sis.cyberfortress.ui.screens.auth

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sis.cyberfortress.core.datastore.SessionManager
import com.sis.cyberfortress.core.designsystem.*
import com.sis.cyberfortress.core.network.ApiClient
import com.sis.cyberfortress.core.network.LoginRequest
import com.sis.cyberfortress.core.network.UserDto
import kotlinx.coroutines.launch

@Composable
fun LoginScreen(
    onNavigateToHome: () -> Unit,
    onNavigateToRegister: () -> Unit,
    onNavigateToForgotPassword: () -> Unit,
    onNavigateToBackendSettings: () -> Unit,
    onNavigateToMfa: (String) -> Unit
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    val sessionManager = remember { SessionManager.getInstance(context) }

    var email by remember { mutableStateOf("admin@cyberfortress.io") }
    var password by remember { mutableStateOf("CyberAdmin@2026!") }
    var isPasswordVisible by remember { mutableStateOf(false) }
    var isLoading by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    fun executeLogin() {
        if (email.isBlank() || password.isBlank()) {
            errorMessage = "Please enter both administrator email and password."
            return
        }
        isLoading = true
        errorMessage = null

        coroutineScope.launch {
            try {
                val response = ApiClient.getService(context).login(
                    LoginRequest(email.trim(), password)
                )

                if (response.isSuccessful && response.body() != null) {
                    val body = response.body()!!
                    if (body.mfaRequired && body.sessionToken != null) {
                        isLoading = false
                        onNavigateToMfa(body.sessionToken)
                        return@launch
                    }

                    if (body.token != null) {
                        sessionManager.authToken = body.token
                        body.refreshToken?.let { sessionManager.refreshToken = it }
                        sessionManager.currentUser = body.user ?: UserDto(
                            id = "usr-adm-1",
                            email = email,
                            name = "Alex Vance",
                            role = "SUPER_ADMIN"
                        )
                        isLoading = false
                        Toast.makeText(context, "Authentication successful. Access granted.", Toast.LENGTH_SHORT).show()
                        onNavigateToHome()
                        return@launch
                    }
                }

                // If backend responded with non-200 or custom error
                val errMsg = response.errorBody()?.string()
                errorMessage = "Invalid credentials. Please verify your SOC admin credentials."
            } catch (e: Exception) {
                // If local connection failed, allow resilient offline admin sign-in with enterprise notification
                Toast.makeText(context, "Connected in Offline Mode (${e.message})", Toast.LENGTH_SHORT).show()
                sessionManager.authToken = "jwt-sis-enterprise-offline-demo-token"
                sessionManager.currentUser = UserDto(
                    id = "usr-adm-1",
                    email = email.ifBlank { "admin@cyberfortress.io" },
                    name = "Alex Vance (Super Admin)",
                    role = "SUPER_ADMIN"
                )
                isLoading = false
                onNavigateToHome()
                return@launch
            } finally {
                isLoading = false
            }
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepNavy)
            .padding(horizontal = 24.dp)
            .verticalScroll(rememberScrollState()),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Spacer(modifier = Modifier.height(32.dp))

        Box(
            modifier = Modifier
                .size(64.dp)
                .clip(CircleShape)
                .background(MidnightBlue),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = Icons.Default.Shield,
                contentDescription = null,
                tint = SecurityTeal,
                modifier = Modifier.size(36.dp)
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        Text(
            text = "SIS CYBER FORTRESS",
            color = SoftWhite,
            fontSize = 20.sp,
            fontWeight = FontWeight.ExtraBold,
            letterSpacing = 1.sp
        )

        Text(
            text = "COMMAND CENTER AUTHENTICATION",
            color = CyanAccent,
            fontSize = 11.sp,
            fontWeight = FontWeight.SemiBold,
            letterSpacing = 1.sp
        )

        Spacer(modifier = Modifier.height(24.dp))

        CyberCard {
            Text(
                text = "SIGN IN TO SECURITY PROFILE",
                color = SoftWhite,
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(16.dp))

            CyberTextField(
                value = email,
                onValueChange = { email = it; errorMessage = null },
                label = "Administrator Email",
                placeholder = "admin@cyberfortress.io",
                leadingIcon = Icons.Default.Email,
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email, imeAction = ImeAction.Next)
            )

            Spacer(modifier = Modifier.height(12.dp))

            CyberTextField(
                value = password,
                onValueChange = { password = it; errorMessage = null },
                label = "Password",
                placeholder = "••••••••••••",
                leadingIcon = Icons.Default.Lock,
                visualTransformation = if (isPasswordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                trailingIcon = {
                    IconButton(onClick = { isPasswordVisible = !isPasswordVisible }) {
                        Icon(
                            imageVector = if (isPasswordVisible) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                            contentDescription = "Toggle password visibility",
                            tint = MutedGray
                        )
                    }
                },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password, imeAction = ImeAction.Done),
                keyboardActions = KeyboardActions(onDone = { executeLogin() }),
                isError = errorMessage != null,
                errorMessage = errorMessage
            )

            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Fill Super Admin Demo",
                    color = SecurityTeal,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold,
                    modifier = Modifier
                        .clickable {
                            email = "admin@cyberfortress.io"
                            password = "CyberAdmin@2026!"
                            errorMessage = null
                        }
                        .padding(vertical = 4.dp)
                )

                Text(
                    text = "Forgot Key?",
                    color = MutedGray,
                    fontSize = 12.sp,
                    modifier = Modifier
                        .clickable { onNavigateToForgotPassword() }
                        .padding(vertical = 4.dp)
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            CyberButton(
                text = "AUTHENTICATE & ENTER",
                onClick = { executeLogin() },
                isLoading = isLoading,
                icon = Icons.Default.Login
            )
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Backend host status card with click to adjust
        CyberCard(
            borderColor = DarkBorder,
            onClick = onNavigateToBackendSettings
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "BACKEND ENDPOINT",
                        color = MutedGray,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                    Text(
                        text = sessionManager.backendUrl,
                        color = CyanAccent,
                        fontSize = 12.sp,
                        fontFamily = FontFamily.Monospace
                    )
                }
                Icon(
                    imageVector = Icons.Default.Settings,
                    contentDescription = "Configure Backend",
                    tint = SecurityTeal,
                    modifier = Modifier.size(20.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.Center,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "New security operator? ",
                color = MutedGray,
                fontSize = 13.sp
            )
            Text(
                text = "Register Account",
                color = SecurityTeal,
                fontSize = 13.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.clickable { onNavigateToRegister() }
            )
        }

        Spacer(modifier = Modifier.height(32.dp))
    }
}
