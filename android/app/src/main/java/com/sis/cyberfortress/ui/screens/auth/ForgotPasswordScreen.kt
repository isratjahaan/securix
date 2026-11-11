package com.sis.cyberfortress.ui.screens.auth

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.LockReset
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sis.cyberfortress.core.designsystem.*

@Composable
fun ForgotPasswordScreen(
    onBackClick: () -> Unit
) {
    val context = LocalContext.current
    var email by remember { mutableStateOf("") }
    var isSubmitted by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepNavy)
    ) {
        CyberTopAppBar(
            title = "Credential Recovery",
            onBackClick = onBackClick
        )

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            CyberCard {
                Text(
                    text = "RECOVER OPERATOR ACCESS",
                    color = SoftWhite,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = "Enter your enterprise security email to generate an authorized break-glass recovery token.",
                    color = MutedGray,
                    fontSize = 12.sp,
                    lineHeight = 16.sp
                )

                Spacer(modifier = Modifier.height(20.dp))

                CyberTextField(
                    value = email,
                    onValueChange = { email = it },
                    label = "Registered Admin Email",
                    leadingIcon = Icons.Default.Email
                )

                Spacer(modifier = Modifier.height(20.dp))

                CyberButton(
                    text = "DISPATCH RECOVERY PROTOCOL",
                    onClick = {
                        if (email.isNotBlank()) {
                            isSubmitted = true
                            Toast.makeText(context, "Recovery link dispatched to security auditor.", Toast.LENGTH_LONG).show()
                        }
                    },
                    icon = Icons.Default.LockReset
                )
            }

            if (isSubmitted) {
                Spacer(modifier = Modifier.height(20.dp))
                CyberCard(borderColor = SecurityTeal) {
                    Text(
                        text = "RECOVERY DISPATCHED",
                        color = SecurityTeal,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "If an authorized record matches $email, a cryptographically signed recovery instruction has been sent to the designated SOC administrator.",
                        color = MutedGray,
                        fontSize = 12.sp,
                        lineHeight = 16.sp
                    )
                }
            }
        }
    }
}
