# SECURIX — Advanced Android Anti-Theft & Device Protection Ecosystem

<div align="center">
  <img src="assets/securix_logo.jpg" alt="SECURIX Logo" width="180" style="border-radius: 20px;" />
  <h3>LOCK • LOCATE • PROTECT</h3>
  <p><strong>Enterprise-grade Android remote security, anti-theft defense, and recovery cockpit.</strong></p>
</div>

---

## 🌟 Key Highlights

- **Dual Protection Modes**:
  - **Mode A (Standard APK)**: Works on consumer Android devices with standard permissions.
  - **Mode B (Enterprise Device Owner)**: Enforces hardlocked anti-uninstall, blocks factory reset, and disallows safe mode boot via Android Enterprise `DevicePolicyManager`.
- **Remote Mobile & Web Control Dashboard**:
  - Responsive, touch-friendly cockpit optimized for controlling lost phones from another smartphone.
  - Live satellite tracking with OpenStreetMap & Leaflet.js.
  - Interactive radar with instant Google Maps launcher.
- **Stealth Photo Capture (Front & Back)**:
  - Captures silent front-camera mugshots of thieves and back-camera environmental photos.
  - Automatic front camera trigger on failed screen passcode attempts.
- **Max-Volume Emergency Siren & Strobe**:
  - Overrides silent mode, Do Not Disturb, and volume limits with persistent audio loop and flashing flashlight.
- **Anti-Power-Off Protection & Fake Power-Off Decoy**:
  - Accessibility Watchdog intercepts unauthorized shutdown dialogs.
  - Stealth blackout simulation convinces thieves the phone is dead while background GPS remains active.
- **Offline SMS Fallback**:
  - Controls the phone without internet via SMS commands (`#SECURIX#LOCATE#<PIN>`, `#SECURIX#ALARM#<PIN>`, `#SECURIX#LOCK#<PIN>`).
- **Snatch & Motion Watchdog**:
  - Sounds an alarm if charger is unplugged or device is snatched in public.

---

## 📱 Mobile Emergency Dashboard

Control your phone from any smartphone browser by visiting:
```
http://<SERVER_IP>:4000/mobile
```

### Controls Available:
| Button | Action |
| :--- | :--- |
| 🚨 **সাইরেন বাজাও** | Max-volume siren bypassing silent mode + torch strobe |
| 🔒 **স্ক্রিন লক করো** | Instant remote lock via `DevicePolicyManager.lockNow()` |
| 🤳 **সামনের ছবি (Front)** | Stealth front-camera selfie of the thief |
| 📷 **পেছনের ছবি (Back)** | Stealth back-camera photo of surroundings |
| 📴 **ভুয়া পাওয়ার-অফ** | Fake shutdown blackout decoy screen |
| ⚠️ **লস্ট মোড** | Fullscreen lockout overlay with owner contact call button |
| 📍 **লাইভ লোকেশন** | Instant high-accuracy GPS update + Google Maps link |
| 💥 **সব ডেটা মুছুন** | Cryptographically authorized factory reset / remote wipe |

---

## 📥 Download Debug APK

- Direct binary located in repository: [`release/securix-debug.apk`](release/securix-debug.apk) (8.0 MB)
- Web distribution endpoint: `http://localhost:4000/download-apk`

---

## 🛠️ Project Structure

```text
securix/
├── app/                  # Android Kotlin Application (API 26-34)
│   ├── src/main/java/    # Clean architecture source code
│   │   ├── receiver/     # Device Admin, Boot, SMS, SIM receivers
│   │   ├── service/      # Foreground tracking, Accessibility watchdog
│   │   └── ui/           # MainActivity, LostMode, FakePowerOff
│   └── src/main/res/     # Layouts, vector assets, policies
├── server/               # Node.js Command Server & Web Dashboard
│   ├── public/           # HTML, CSS, JS, Leaflet map, mobile view
│   └── server.js         # HTTP, REST, Server-Sent Events (SSE)
├── release/              # Pre-built installable Android Debug APK
└── assets/               # Brand identity & high-res icons
```

---

## 🚀 Quick Start

### 1. Run the Command Server
```bash
cd server
node server.js
```
Open [http://localhost:4000](http://localhost:4000) or [http://localhost:4000/mobile](http://localhost:4000/mobile).

### 2. Install APK on Android Device / MuMu Player
```bash
adb install -r release/securix-debug.apk
```

### 3. Elevate to Mode B (Device Owner)
```bash
adb shell dpm set-device-owner com.securix.security/.receiver.SecurixDeviceAdminReceiver
```

---

## 🔒 Security & Privacy

SECURIX adheres to defensive application security best practices:
- All remote commands are cryptographically signed with HMAC-SHA256.
- PIN codes are hashed using SHA-256.
- Telemetry and photos are transmitted over encrypted channels.
