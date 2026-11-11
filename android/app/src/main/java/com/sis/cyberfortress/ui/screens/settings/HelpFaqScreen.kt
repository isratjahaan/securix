package com.sis.cyberfortress.ui.screens.settings

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sis.cyberfortress.core.designsystem.*

data class FaqItem(val question: String, val answer: String)

@Composable
fun HelpFaqScreen(onBackClick: () -> Unit) {
    val faqs = listOf(
        FaqItem(
            "How does the Zero-Knowledge Vault protect credentials?",
            "Your secrets and passwords are encrypted locally on this Android device using AES-256-GCM before transmission. The private keys reside in the device's hardware TEE Keystore. Neither server administrators nor databases ever receive or store plaintext."
        ),
        FaqItem(
            "How do I switch the Android app to connect to a LAN server?",
            "Navigate to Profile > Backend & Network, enter your server IP (for example, http://192.168.1.100:4000/api/), and tap 'Save Endpoint URL'. You can test the connection immediately with the 'Ping Backend' button."
        ),
        FaqItem(
            "What happens if an alert escalates to Critical?",
            "Critical alerts automatically generate a SOC Incident ticket in Module 12 (Cyber SOC) and dispatch notifications to duty security analysts for automated containment playbooks."
        )
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepNavy)
    ) {
        CyberTopAppBar(
            title = "Help & SOC Knowledge Base",
            onBackClick = onBackClick
        )

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(faqs) { faq ->
                CyberCard(borderColor = DarkBorder) {
                    Text(
                        text = faq.question,
                        color = SoftWhite,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = faq.answer,
                        color = MutedGray,
                        fontSize = 11.sp,
                        lineHeight = 15.sp
                    )
                }
            }
        }
    }
}
