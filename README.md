# SIS CYBER FORTRESS
## God-Level Enterprise Super Admin Panel & Central Command Center

**SIS CYBER FORTRESS** is a central command and orchestration console for an integrated **12-in-1 Enterprise Cybersecurity Ecosystem**. It unifies zero-trust identity defense, mobile endpoint compliance, perimeter anomaly inspection, threat intelligence ingestion, digital forensics, and cryptographic disaster recovery into a single command center.

---

## 1. Core Technology Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide Icons, Socket.IO Client.
- **Backend**: NestJS 10, TypeScript, REST API, WebSocket Gateway (`/socket.io`), OpenAPI Swagger (`/api/docs`), Passport JWT, RBAC guards.
- **Database & Persistence**: PostgreSQL 16+, Prisma ORM (33 Relational Models), Resilient in-memory failover engine for zero-downtime testability.
- **Design Aesthetic**: Modern SOC Dark Mode (`Deep Navy: #101C2C`, `Midnight Blue: #17283B`, `Security Teal: #20BFA9`, `Cyan Accent: #32C5DD`).

---

## 2. The 12-in-1 Cybersecurity Ecosystem Modules

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

## 3. Strict Security & Privacy Invariants

1. **Zero-Knowledge Vault Rule**: Administrators can **never** view plaintext passwords, secure notes, private keys, or client-side encryption secrets. No administrative backdoor exists.
2. **Authorized Scope Boundary**: Security assessments, port probes, and health evaluations are strictly gated to verified, pre-authorized domains, networks, and URLs with proof certificates.
3. **Immutable Audit Trails**: Every administrative action, role assignment, status transition, and module modification is committed to an append-only audit trail containing Actor, Role, IP, and Request ID.
4. **Backend-Enforced RBAC**: Menu visibility in the UI is never a substitute for authorization; all protected operations require `@Roles()` and `@RequirePermissions()` guards on the NestJS backend.
5. **Authentic System Health**: Health widgets never report "Operational" unless verified against live process memory and socket checks.

---

## 4. Administrative Accounts (Development Test Credentials)

| Role | Name | Email | Password | MFA Code |
|---|---|---|---|---|
| **SUPER ADMIN** | Dr. Sarah Vance | `sarah.vance@fortress.sis.enterprise` | `Fortress2026!` | `123456` |
| **SECURITY ADMIN** | Marcus Brooks | `marcus.brooks@fortress.sis.enterprise` | `Fortress2026!` | `123456` |
| **MODULE ADMIN** | Elena Rostova | `elena.rostova@fortress.sis.enterprise` | `Fortress2026!` | `123456` |
| **AUDITOR** | David Chen | `david.chen@fortress.sis.enterprise` | `Fortress2026!` | `123456` |

---

## 5. Getting Started & Running the Application

### A. Start the Backend API (NestJS + WebSockets)
```bash
cd backend
npm install
npm run build
npm start
```
*Backend runs on `http://localhost:4000` with Swagger OpenAPI docs at `http://localhost:4000/api/docs`.*

### B. Start the Frontend (Next.js Command Center)
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000` and automatically proxies `/api` and `/socket.io` to the NestJS backend.*

### C. Run Both Concurrently
```bash
npm run dev
```

### D. Run Automated Test Suite
```bash
npm run test --workspace=backend
```
