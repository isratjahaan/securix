package com.sis.cyberfortress.core.security

import android.content.Context
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

data class VaultItem(
    val id: String,
    val title: String,
    val username: String,
    val encryptedSecret: String, // Encrypted client-side via AES-256 GCM
    val category: String = "CREDENTIAL", // CREDENTIAL, SECURE_NOTE, API_KEY
    val updatedAt: Long = System.currentTimeMillis()
)

class ZeroKnowledgeVault(context: Context) {
    private val keystoreManager = KeystoreManager(context)
    private val prefs = context.getSharedPreferences("sis_zk_vault_local", Context.MODE_PRIVATE)
    private val gson = Gson()

    fun saveItem(title: String, username: String, secretPlain: String, category: String = "CREDENTIAL"): VaultItem {
        val encrypted = keystoreManager.encrypt(secretPlain)
        val item = VaultItem(
            id = "zk-${System.currentTimeMillis()}",
            title = title,
            username = username,
            encryptedSecret = encrypted,
            category = category
        )
        val list = getItems().toMutableList()
        list.add(0, item)
        saveList(list)
        return item
    }

    fun decryptSecret(item: VaultItem): String {
        return keystoreManager.decrypt(item.encryptedSecret)
    }

    fun getItems(): List<VaultItem> {
        val json = prefs.getString("items", null) ?: return defaultSampleVault()
        return try {
            val type = object : TypeToken<List<VaultItem>>() {}.type
            gson.fromJson(json, type) ?: defaultSampleVault()
        } catch (e: Exception) {
            defaultSampleVault()
        }
    }

    fun deleteItem(id: String) {
        val list = getItems().filter { it.id != id }
        saveList(list)
    }

    private fun saveList(items: List<VaultItem>) {
        val json = gson.toJson(items)
        prefs.edit().putString("items", json).apply()
    }

    private fun defaultSampleVault(): List<VaultItem> {
        val sample1 = VaultItem(
            id = "zk-init-1",
            title = "AWS SOC Production Root Key",
            username = "soc-admin@cyberfortress.internal",
            encryptedSecret = keystoreManager.encrypt("AKIA-SECURE-ROOT-TOKEN-9921"),
            category = "API_KEY"
        )
        val sample2 = VaultItem(
            id = "zk-init-2",
            title = "SIEM Splunk Cluster Access",
            username = "siem_ingest_svc",
            encryptedSecret = keystoreManager.encrypt("splunk-k8s-cluster-jwt-token-production"),
            category = "CREDENTIAL"
        )
        val sample3 = VaultItem(
            id = "zk-init-3",
            title = "Disaster Recovery Break-Glass Note",
            username = "break-glass",
            encryptedSecret = keystoreManager.encrypt("Physical Safe Combination: Tier 4 Data Center Floor 3 Rack 12"),
            category = "SECURE_NOTE"
        )
        val list = listOf(sample1, sample2, sample3)
        saveList(list)
        return list
    }
}
