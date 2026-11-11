# SIS CYBER FORTRESS
## God-Level Enterprise Cybersecurity Ecosystem: Android APK + Web Command Center + Shared Enterprise Backend

**SIS CYBER FORTRESS** is a unified, enterprise-grade **12-in-1 Cybersecurity Ecosystem** combining:
1. **Android Mobile Application (Native Jetpack Compose APK)**: `com.sis.cyberfortress`
2. **Central Web Command Center (Next.js 14 App Router)**: Comprehensive SOC monitoring and management console.
3. **Shared Enterprise Backend (NestJS 10 + WebSockets + Swagger)**: REST APIs, live Socket.IO gateway, JWT RBAC security.
4. **Shared Database & Persistence (PostgreSQL 16 + Prisma ORM)**: 33 relational models with resilient failover store.

---

## 1. Ready-to-Install Android APK

The production-ready debug APK has been compiled and placed directly in the repository root:
- **Location**: `SIS-Cyber-Fortress-v1.0.0-debug.apk`
- **Gradle Build Output**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **Package Name**: `com.sis.cyberfortress`
- **Target SDK**: Android 14 (API 34) | **Min SDK**: Android 8.0 (API 26)
- **Architecture**: Clean Architecture + MVVM + Jetpack Compose Material 3
- **File Size**: ~19.2 MB

### Installing on Device / Emulator:
```bash
adb install -r SIS-Cyber-Fortress-v1.0.0-debug.apk
```

---

## 2. Core Technology Stack

- **Android Application**:
  - Kotlin 2.0.21, Jetpack Compose Material 3 (BOM 2024.10.00), Navigation Compose
  - Retrofit 2.11 + OkHttp 4.12, Coroutines & Flow
  - Android Keystore AES-256 GCM (`EncryptedSharedPreferences`), BiometricPrompt API
  - Gradle 9.3.1 + Android Gradle Plugin 8.6.1 + JDK 25
- **Web Admin Dashboard**:
  - Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide Icons, Socket.IO Client
- **Shared Backend**:
  - NestJS 10, TypeScript, REST API (`/api`), WebSocket Gateway (`/socket.io`), OpenAPI Swagger (`/api/docs`), Passport JWT
- **Database & Persistence**:
  - PostgreSQL 16+, Prisma ORM (33 Relational Models), In-Memory Failover Replica
- **Design Aesthetic**:
  - Enterprise SOC Palette: Deep Navy (`#101C2C`), Midnight Blue (`#17283B`), Security Teal (`#20BFA9`), Cyan Accent (`#32C5DD`), Soft White (`#F5F7FA`), Muted Gray (`#94A3B8`).

---

## 3. The 12-in-1 Cybersecurity Ecosystem Modules

| ID | Module Name | Primary Defense Function | Dependency Boundary |
|---|---|---|---|
| `sis-identity` | **SIS Identity Guardian** | Zero-trust credential protection, breach intelligence & identity anomaly detection | Core / Invariant |
| `sis-phishing` | **SIS Phishing Shield** | AI-driven email/SMS phishing analyzer with brand impersonation defense | Depends on `sis-threat-intel` |
| `sis-endpoint` | **SIS Endpoint Guardian** | Android endpoint telemetry, Knox/Play integrity & root detection | Depends on `sis-identity` |
| `sis-network` | **SIS Network Sentinel** | Deep packet inspection, DNS tunneling detection & rogue AP perimeter monitoring | Depends on `sis-threat-intel` |
| `sis-vault` | **SIS Vault Guardian** | Client-side encrypted credentials, cryptographic keys & emergency recovery (Zero-Knowledge) | Core / Invariant |
| `sis-ransomware`| **SIS Ransomware Guardian** | Canary honeypots, mass file modification tripwires & automated isolate controls | Depends on `sis-endpoint` |
| `sis-webshield` | **SIS WebShield** | Next-gen WAF, Layer 7 DDoS mitigation, authorized automated DAST scanning | Depends on `sis-network` |
| `sis-forensics` | **SIS Digital Forensics** | Cryptographic evidence hashing (SHA-256), memory capture & chain-of-custody audit | Depends on `sis-cyber-soc` |
| `sis-access` | **SIS Access Guardian** | Context-aware access policies, geo-fencing, device health gates & step-up MFA | Depends on `sis-identity` |
| `sis-threat-intel`| **SIS Threat Intelligence** | Real-time IOC correlation, MISP / TAXII / AlienVault OTX feeds, reputation scores | Core / Invariant |
| `sis-cloud-backup`| **SIS Cloud Backup Guardian**| Multi-region encrypted snapshots, cryptographic verification & disaster recovery | Depends on `sis-vault` |
| `sis-cyber-soc` | **SIS Cyber SOC** | Central SIEM alert aggregation, incident triage, automated response playbooks | Central SIEM Bus |

---

## 4. Strict Security & Privacy Invariants

1. **Zero-Knowledge Vault Rule**: Administrators can **never** view plaintext passwords, secure notes, private keys, or client-side encryption secrets. All vault data is encrypted client-side using AES-256 GCM with keys generated on the device's hardware TEE Keystore.
2. **Authorized Scope Boundary**: Security assessments, port probes, and health evaluations are strictly gated to verified, pre-authorized domains, networks, and URLs with proof certificates.
3. **Immutable Audit Trails**: Every administrative action, role assignment, status transition, and module modification is committed to an append-only audit trail containing Actor, Role, IP, and Request ID.
4. **Backend-Enforced RBAC**: Menu visibility in the UI is never a substitute for authorization; all protected operations require `@Roles()` and `@RequirePermissions()` guards on the NestJS backend.
5. **Authentic System Health**: Health widgets never report "Operational" unless verified against live process memory and socket checks.

---

## 5. Development & Testing Credentials

| Role | Name | Email | Password | MFA Code |
|---|---|---|---|---|
| **SUPER ADMIN** | Dr. Sarah Vance | `admin@cyberfortress.io` | `CyberAdmin@2026!` | `123456` |
| **SUPER ADMIN (Alt)** | Dr. Sarah Vance | `sarah.vance@fortress.sis.enterprise` | `Fortress2026!` | `123456` |
| **SECURITY ADMIN** | Marcus Brooks | `marcus.brooks@fortress.sis.enterprise` | `Fortress2026!` | `123456` |
| **MODULE ADMIN** | Elena Rostova | `elena.rostova@fortress.sis.enterprise` | `Fortress2026!` | `123456` |
| **AUDITOR** | David Chen | `david.chen@fortress.sis.enterprise` | `Fortress2026!` | `123456` |

---

## 6. Getting Started & Running the Ecosystem

### A. Start the Backend API (NestJS + WebSockets)
```bash
cd backend
npm install
npm run build
npm start
```
*Backend runs on `http://localhost:4000` with Swagger OpenAPI docs at `http://localhost:4000/api/docs`.*

### B. Start the Web Admin Dashboard (Next.js)
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000` and automatically proxies `/api` and `/socket.io` to the NestJS backend.*

### C. Build or Run the Android Application (Kotlin + Jetpack Compose)
```bash
cd android
.\gradlew.bat assembleDebug
```
*Generates the APK at `android/app/build/outputs/apk/debug/app-debug.apk`.*

### D. Android Backend Connection
Inside the Android app:
- Go to **Profile** > **Backend & Network**.
- If running on the **Android Emulator**, use the default preset: `http://10.0.2.2:4000/api/` (which points to the host machine's port 4000).
- If running on a **Physical Device**, enter your computer's LAN IP: `http://<your-lan-ip>:4000/api/`.
- Tap **Ping Backend Diagnostics** to verify sub-50ms live roundtrip latency!
