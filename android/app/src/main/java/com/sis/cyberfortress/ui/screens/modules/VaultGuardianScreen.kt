package com.sis.cyberfortress.ui.screens.modules

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sis.cyberfortress.core.designsystem.*
import com.sis.cyberfortress.core.security.VaultItem
import com.sis.cyberfortress.core.security.ZeroKnowledgeVault

@Composable
fun VaultGuardianScreen(onBackClick: () -> Unit) {
    val context = LocalContext.current
    val clipboardManager = LocalClipboardManager.current
    val vault = remember { ZeroKnowledgeVault(context) }

    var items by remember { mutableStateOf(vault.getItems()) }
    var showAddDialog by remember { mutableStateOf(false) }
    var revealedItemId by remember { mutableStateOf<String?>(null) }

    fun refreshItems() {
        items = vault.getItems()
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepNavy)
    ) {
        CyberTopAppBar(
            title = "Vault Guardian [M05]",
            onBackClick = onBackClick,
            actions = {
                IconButton(onClick = { showAddDialog = true }) {
                    Icon(Icons.Default.AddCircle, contentDescription = "New Secret", tint = SecurityTeal)
                }
            }
        )

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            item {
                // Zero Knowledge Guarantee Banner
                CyberCard(borderColor = SecurityTeal) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.VerifiedUser,
                            contentDescription = null,
                            tint = SecurityTeal,
                            modifier = Modifier.size(32.dp)
                        )
                        Column {
                            Text(
                                text = "ZERO-KNOWLEDGE ARCHITECTURE ACTIVE",
                                color = SoftWhite,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = "All secrets are encrypted client-side using AES-256 GCM with keys generated on this device's TEE Keystore. Administrators and server backends NEVER see plaintext.",
                                color = MutedGray,
                                fontSize = 11.sp,
                                lineHeight = 15.sp
                            )
                        }
                    }
                }
            }

            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "ENCRYPTED VAULT ITEMS (${items.size})",
                        color = MutedGray,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "+ Add Secret",
                        color = SecurityTeal,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.clickable { showAddDialog = true }
                    )
                }
            }

            items(items) { item ->
                val isRevealed = revealedItemId == item.id
                val secretText = if (isRevealed) vault.decryptSecret(item) else "••••••••••••••••••••••••"

                CyberCard(borderColor = DarkBorder) {
                    Column {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.Top
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = item.title,
                                    color = SoftWhite,
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold
                                )
                                Text(
                                    text = item.username,
                                    color = CyanAccent,
                                    fontSize = 11.sp
                                )
                            }
                            StatusBadge(status = item.category)
                        }

                        Spacer(modifier = Modifier.height(10.dp))

                        // Secret field with toggle reveal and copy
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(Charcoal, RoundedCornerShape(6.dp))
                                .padding(horizontal = 12.dp, vertical = 8.dp)
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = secretText,
                                    color = if (isRevealed) SecurityTeal else MutedGray,
                                    fontSize = 12.sp,
                                    fontFamily = FontFamily.Monospace,
                                    modifier = Modifier.weight(1f)
                                )

                                Row {
                                    IconButton(
                                        onClick = {
                                            revealedItemId = if (isRevealed) null else item.id
                                        },
                                        modifier = Modifier.size(28.dp)
                                    ) {
                                        Icon(
                                            imageVector = if (isRevealed) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                                            contentDescription = "Reveal",
                                            tint = MutedGray,
                                            modifier = Modifier.size(16.dp)
                                        )
                                    }

                                    IconButton(
                                        onClick = {
                                            val plain = vault.decryptSecret(item)
                                            clipboardManager.setText(AnnotatedString(plain))
                                            Toast.makeText(context, "Secret copied to secure clipboard", Toast.LENGTH_SHORT).show()
                                        },
                                        modifier = Modifier.size(28.dp)
                                    ) {
                                        Icon(
                                            imageVector = Icons.Default.ContentCopy,
                                            contentDescription = "Copy",
                                            tint = SecurityTeal,
                                            modifier = Modifier.size(16.dp)
                                        )
                                    }

                                    IconButton(
                                        onClick = {
                                            vault.deleteItem(item.id)
                                            refreshItems()
                                            Toast.makeText(context, "Item erased from vault enclave.", Toast.LENGTH_SHORT).show()
                                        },
                                        modifier = Modifier.size(28.dp)
                                    ) {
                                        Icon(
                                            imageVector = Icons.Default.Delete,
                                            contentDescription = "Delete",
                                            tint = StatusCritical,
                                            modifier = Modifier.size(16.dp)
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    if (showAddDialog) {
        AddVaultSecretDialog(
            onDismiss = { showAddDialog = false },
            onSave = { title, username, secret, category ->
                vault.saveItem(title, username, secret, category)
                refreshItems()
                showAddDialog = false
                Toast.makeText(context, "Secret encrypted with AES-256 GCM & saved.", Toast.LENGTH_SHORT).show()
            }
        )
    }
}

@Composable
fun AddVaultSecretDialog(
    onDismiss: () -> Unit,
    onSave: (String, String, String, String) -> Unit
) {
    var title by remember { mutableStateOf("") }
    var username by remember { mutableStateOf("") }
    var secret by remember { mutableStateOf("") }
    var category by remember { mutableStateOf("CREDENTIAL") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Store Zero-Knowledge Secret", color = SoftWhite) },
        containerColor = CardBackground,
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                CyberTextField(
                    value = title,
                    onValueChange = { title = it },
                    label = "Title (e.g. AWS Prod Token)"
                )
                CyberTextField(
                    value = username,
                    onValueChange = { username = it },
                    label = "Username / Identifier"
                )
                CyberTextField(
                    value = secret,
                    onValueChange = { secret = it },
                    label = "Secret Password / Key"
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (title.isNotBlank() && secret.isNotBlank()) {
                        onSave(title, username, secret, category)
                    }
                },
                colors = ButtonDefaults.buttonColors(containerColor = SecurityTeal)
            ) {
                Text("ENCRYPT & STORE", color = DeepNavy, fontWeight = FontWeight.Bold)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("CANCEL", color = MutedGray)
            }
        }
    )
}
