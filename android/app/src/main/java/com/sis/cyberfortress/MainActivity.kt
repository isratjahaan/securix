package com.sis.cyberfortress

import android.os.Bundle
import androidx.activity.compose.setContent
import androidx.fragment.app.FragmentActivity
import com.sis.cyberfortress.core.designsystem.SISCyberFortressTheme
import com.sis.cyberfortress.navigation.AppNavGraph

class MainActivity : FragmentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            SISCyberFortressTheme {
                AppNavGraph()
            }
        }
    }
}
