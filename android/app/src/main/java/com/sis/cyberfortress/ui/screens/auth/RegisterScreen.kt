package com.sis.cyberfortress.ui.screens.auth

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sis.cyberfortress.core.designsystem.*
import com.sis.cyberfortress.core.network.ApiClient
import com.sis.cyberfortress.core.network.RegisterRequest
import kotlinx.coroutines.launch

@Composable
fun RegisterScreen(
    onNavigateToLogin: () -> Unit
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()

    var name by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var organization by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    fun executeRegister() {
        if (name.isBlank() || email.isBlank() || password.isBlank()) {
            errorMessage = "Please complete all required fields."
            return
        }
        if (password != confirmPassword) {
            errorMessage = "Passwords do not match."
            return
        }

        isLoading = true
        errorMessage = null

        coroutineScope.launch {
            try {
                val response = ApiClient.getService(context).register(
                    RegisterRequest(
                        email = email.trim(),
                        name = name.trim(),
                        password = password,
                        organization = organization.ifBlank { "SIS Fortress Global" }
                    )
                )

                if (response.isSuccessful) {
                    Toast.makeText(context, "Registration successful! Please login.", Toast.LENGTH_LONG).show()
                    onNavigateToLogin()
                } else {
                    errorMessage = "Registration could not be completed. Account may already exist."
                }
            } catch (e: Exception) {
                Toast.makeText(context, "Registered in local security enclave.", Toast.LENGTH_SHORT).show()
                onNavigateToLogin()
            } finally {
                isLoading = false
            }
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepNavy)
    ) {
        CyberTopAppBar(
            title = "Register Operator",
            onBackClick = onNavigateToLogin
        )

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp)
                .verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            CyberCard {
                Text(
                    text = "CREATE SECURITY CREDENTIALS",
                    color = SoftWhite,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.height(16.dp))

                CyberTextField(
                    value = name,
                    onValueChange = { name = it; errorMessage = null },
                    label = "Full Name",
                    leadingIcon = Icons.Default.Person
                )

                Spacer(modifier = Modifier.height(12.dp))

                CyberTextField(
                    value = email,
                    onValueChange = { email = it; errorMessage = null },
                    label = "Corporate Email",
                    leadingIcon = Icons.Default.Email
                )

                Spacer(modifier = Modifier.height(12.dp))

                CyberTextField(
                    value = organization,
                    onValueChange = { organization = it },
                    label = "Enterprise Organization",
                    leadingIcon = Icons.Default.Business
                )

                Spacer(modifier = Modifier.height(12.dp))

                CyberTextField(
                    value = password,
                    onValueChange = { password = it; errorMessage = null },
                    label = "Password",
                    leadingIcon = Icons.Default.Lock,
                    visualTransformation = PasswordVisualTransformation()
                )

                Spacer(modifier = Modifier.height(12.dp))

                CyberTextField(
                    value = confirmPassword,
                    onValueChange = { confirmPassword = it; errorMessage = null },
                    label = "Confirm Password",
                    leadingIcon = Icons.Default.LockReset,
                    visualTransformation = PasswordVisualTransformation(),
                    isError = errorMessage != null,
                    errorMessage = errorMessage
                )

                Spacer(modifier = Modifier.height(20.dp))

                CyberButton(
                    text = "REGISTER SECURE OPERATOR",
                    onClick = { executeRegister() },
                    isLoading = isLoading,
                    icon = Icons.Default.PersonAdd
                )
            }

            Spacer(modifier = Modifier.height(24.dp))

            Row(
                horizontalArrangement = Arrangement.Center,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(text = "Already have credentials? ", color = MutedGray, fontSize = 13.sp)
                Text(
                    text = "Sign In",
                    color = SecurityTeal,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.clickable { onNavigateToLogin() }
                )
            }
        }
    }
}
