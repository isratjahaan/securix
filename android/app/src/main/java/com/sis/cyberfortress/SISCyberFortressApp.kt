package com.sis.cyberfortress

import android.app.Application
import com.sis.cyberfortress.core.datastore.SessionManager

class SISCyberFortressApp : Application() {
    override fun onCreate() {
        super.onCreate()
        // Initialize singletons
        SessionManager.getInstance(this)
    }
}
