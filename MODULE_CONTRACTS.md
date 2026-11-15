# SIS CYBER FORTRESS — MODULE INTERFACE CONTRACTS & SPECIFICATIONS
**Document Version:** 2.0.0  
**Scope:** All 12 Enterprise Cyber Defense Modules  

---

## 1. MODULE INDEX & METADATA DIRECTORY

| ID | Module Name | Category | Core Pillar | Base Route | Data Ownership Scope |
|---|---|---|---|---|---|
| `sis-identity` | SIS Identity & Zero Trust | Identity / IAM | **YES** | `/api/auth/*` | Users, Refresh Tokens, TOTP Secrets |
| `sis-phishing` | SIS Phishing Shield | Threat Prevention | NO | `/api/phishing/*` | Phishing Scans, Quarantined Artifacts, Brand Filters |
| `sis-endpoint` | SIS Endpoint Guardian | Device Security | NO | `/api/devices/*` | MDM Devices, Knox Attestations, Compliance State |
| `sis-network` | SIS Network Sentinel | Perimeter Defense | NO | `/api/assets/*` | Network Nodes, DNS/ARP Anomalies, Firewall Rules |
| `sis-vault` | SIS Zero-Knowledge Vault | Cryptography / Privacy | NO | `/api/vault/*` | Encrypted Ciphertexts, Zero-Knowledge Metadata |
| `sis-ransomware`| SIS Ransomware Guardian | Anti-Malware | NO | `/api/ransomware/*`| Canary Honeypots, Tripwires, Entropy Telemetry |
| `sis-webshield` | SIS Web Shield | Application Security | NO | `/api/search/*` | WAF Filters, SSL Certificates, HTTP Inspections |
| `sis-forensics` | SIS Forensics & Timeline | DFIR | NO | `/api/forensics/*` | Evidence Snapshots, Timeline Events, PCAP Logs |
| `sis-access` | SIS Access & Privilege Manager | Privileged Access | NO | `/api/admins/*` | RBAC Roles, Ephemeral Grants, JIT Escalations |
| `sis-threat-intel`| SIS Threat Intelligence Engine | Intelligence Feeds | NO | `/api/threat-intel/*`| IoC Records, C2 Blocklists, MITRE TTPs |
| `sis-cloud-backup`| SIS Cloud Backup & DR | Resilience / Storage | NO | `/api/backups/*` | Backup Jobs, SHA-256 Checksums, DR Snapshots |
| `sis-cyber-soc` | SIS Central Cyber SOC | Command & Control | **YES** | `/api/soc/*` | Alerts, Incidents, SOAR Playbooks, Metrics |

---

## 2. DETAILED ENDPOINT CONTRACTS

### M01: SIS Identity & Zero Trust (`sis-identity`)
- **`POST /api/auth/login`**
  - **Description:** Authenticates administrator or endpoint device. Enforces mandatory MFA challenge for elevated roles.
  - **Request Body:** `{ email: string, password: string, deviceFingerprint?: string }`
  - **Response 200:** `{ user: UserProfile, accessToken?: string, mfaRequired?: boolean, tempToken?: string }`
  - **Errors:** 400 Bad Request, 401 Invalid Credentials.
- **`POST /api/auth/mfa/verify`**
  - **Description:** Validates TOTP/Knox token to complete elevated session creation.
  - **Request Body:** `{ tempToken: string, code: string }`
  - **Response 200:** `{ accessToken: string, user: UserProfile, expiresIn: number }`

---

### M02: SIS Phishing Shield (`sis-phishing`)
*Protected by `@RequireActiveModule('sis-phishing')`*
- **`POST /api/phishing/scan`**
  - **Description:** Real-time AI and heuristic lexical inspection for malicious links, phishing emails, or SMS lures.
  - **Request Body:**
    ```json
    {
      "target": "http://login-verify-account-update.xyz/auth/login.php",
      "type": "URL", // "URL" | "EMAIL_BODY" | "SMS_TEXT"
      "content": "Urgent password reset requested"
    }
    ```
  - **Response 201:**
    ```json
    {
      "scanId": "scn-1731309876",
      "target": "http://login-verify-account-update.xyz/auth/login.php",
      "type": "URL",
      "threatScore": 100,
      "verdict": "MALICIOUS", // "MALICIOUS" | "SUSPICIOUS" | "SAFE"
      "indicators": ["Suspicious credential keywords: [login, verify]", "High-risk top-level domain (.xyz)"],
      "scannedAt": "2026-11-11T12:00:00.000Z",
      "quarantined": true
    }
    ```
- **`GET /api/phishing/quarantine`**
  - **Description:** Retrieves all actively quarantined threat artifacts.
  - **Response 200:** `QuarantinedItem[]`
- **`POST /api/phishing/quarantine/:id/release`**
  - **Description:** Releases benign false-positive artifact from isolation.
  - **Request Body:** `{ reason: string }`
  - **Response 200:** `{ success: true, message: string, item: QuarantinedItem }`
- **`POST /api/phishing/quarantine/:id/purge`**
  - **Description:** Permanently destroys quarantined payload.
  - **Response 200:** `{ success: true, message: string }`
- **`GET /api/phishing/statistics`**
  - **Description:** Returns scanning throughput, quarantined count, and accuracy metrics.
  - **Response 200:** `{ totalScanned: number, quarantinedCount: number, maliciousBlocked: number, accuracyRatePercent: number }`

---

### M03: SIS Endpoint Guardian (`sis-endpoint`)
- **`GET /api/devices`**
  - **Description:** Lists all registered Android mobile and enterprise workstation endpoints.
  - **Response 200:** `DeviceEntity[]` (Includes Knox status, OS version, compliance flag).
- **`POST /api/devices/:id/isolate`**
  - **Description:** Quarantine target mobile device from accessing corporate VPN and Zero Trust gateways.
  - **Response 200:** `{ deviceId: string, status: "QUARANTINED" }`

---

### M04: SIS Network Sentinel (`sis-network`)
- **`GET /api/assets`**
  - **Description:** Lists internal monitored asset nodes and network topology segments.
  - **Response 200:** `AssetEntity[]`
- **`POST /api/assets/scan`**
  - **Description:** Triggers network port and vulnerability probing across internal subnets.
  - **Response 200:** `{ scanJobId: string, status: "DISPATCHED" }`

---

### M05: SIS Zero-Knowledge Vault (`sis-vault`)
- **`GET /api/vault/metadata`**
  - **Description:** Verifies zero-knowledge encryption parameters and active cipher policies.
  - **Invariant:** Response never contains password, master keys, or raw plaintexts.
  - **Response 200:**
    ```json
    {
      "zeroKnowledgePolicy": "ACTIVE_AND_ENFORCED",
      "storageEncryptedAlgorithm": "AES-256-GCM (PBKDF2-HMAC-SHA512)",
      "totalRecordsEncrypted": 184,
      "lastRekeyTimestamp": "2026-10-01T04:00:00Z"
    }
    ```
- **`POST /api/vault/records`**
  - **Description:** Stores client-encrypted ciphertext block.
  - **Request Body:** `{ identifier: string, ciphertext: string, iv: string, authTag: string }`
  - **Response 201:** `{ recordId: string, status: "COMMITTED" }`

---

### M06: SIS Ransomware Guardian (`sis-ransomware`)
*Protected by `@RequireActiveModule('sis-ransomware')`*
- **`GET /api/ransomware/canaries`**
  - **Description:** Lists all active honeypot decoy files across network shares and storage.
  - **Response 200:** `CanaryHoneypot[]`
- **`POST /api/ransomware/tripwires/test`**
  - **Description:** Simulates decoy mutation or high-entropy file rewrite to verify tripwire reaction.
  - **Request Body:** `{ canaryId: "CANARY-FINANCE-01", simulatedEntropy: 8.24 }`
  - **Response 201:**
    ```json
    {
      "success": true,
      "alertDispatched": true,
      "canaryStatus": "MUTATED",
      "simulatedEntropy": 8.24,
      "message": "Ransomware tripwire triggered. Critical incident dispatched to Cyber SOC."
    }
    ```
- **`GET /api/ransomware/entropy`**
  - **Description:** Real-time Shannon entropy baseline and telemetry across active storage nodes.
  - **Response 200:** `{ baselineEntropy: number, currentThreshold: number, activeStreamsMonitored: number }`
- **`POST /api/ransomware/isolate-host`**
  - **Description:** Immediately drops infected endpoint from enterprise network segments to prevent lateral movement.
  - **Request Body:** `{ hostIdentifier: "10.0.12.88", reason: string }`
  - **Response 201:** `{ success: true, isolatedHost: string, networkState: "QUARANTINED_ISOLATED" }`

---

### M10: SIS Threat Intelligence Engine (`sis-threat-intel`)
- **`GET /api/threat-intel/indicators`**
  - **Description:** Fetches synchronized STIX/TAXII threat indicators and malicious IP/domain feeds.
  - **Response 200:** `ThreatIndicator[]`
- **`POST /api/threat-intel/lookup`**
  - **Description:** Queries reputation and historical malicious campaigns for an IP, hash, or domain.
  - **Request Body:** `{ indicator: string }`
  - **Response 200:** `{ indicator: string, reputationScore: number, classification: string }`

---

### M11: SIS Cloud Backup & DR (`sis-cloud-backup`)
- **`GET /api/backups/jobs`**
  - **Description:** Lists active, completed, and air-gapped immutable backup snapshots.
  - **Response 200:** `BackupJob[]`
- **`POST /api/backups/jobs/:id/verify`**
  - **Description:** Cryptographically re-verifies block-level SHA-256 integrity hash of a backup snapshot.
  - **Response 201:** `{ jobId: string, verified: true, checksum: string, algorithm: "SHA-256" }`

---

### M12: SIS Central Cyber SOC (`sis-cyber-soc`)
- **`GET /api/soc/overview`**
  - **Description:** Aggregates real-time metrics, active alerts, MTTD, MTTC, and ecosystem health.
  - **Response 200:** `{ totalAlerts: number, criticalAlerts: number, mttdMinutes: number, mttcMinutes: number }`
- **`GET /api/soc/alerts`**
  - **Description:** Lists filtered real-time alerts across all 12 modules.
  - **Response 200:** `AlertEntity[]`
- **`POST /api/soc/alerts/:id/acknowledge`**
  - **Description:** SOC operator claims and acknowledges active threat alert.
  - **Response 201:** `{ id: string, status: "ACKNOWLEDGED", acknowledgedBy: string }`
- **`POST /api/soc/incidents`**
  - **Description:** Escalates and declares a formal forensic security incident.
  - **Request Body:** `{ title: string, description: string, priority: string, moduleId: string }`
  - **Response 201:** `IncidentEntity` (Code format: `INC-2026-XXXX`).
- **`PATCH /api/soc/incidents/:id/status`**
  - **Description:** Transitions incident through lifecycle (`INVESTIGATING`, `CONTAINED`, `RESOLVED`, `CLOSED`).
  - **Request Body:** `{ status: string, resolutionSummary?: string }`
  - **Response 200:** `IncidentEntity`
