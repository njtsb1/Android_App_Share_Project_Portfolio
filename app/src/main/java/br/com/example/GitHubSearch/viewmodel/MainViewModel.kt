package com.example.GitHubSearch.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData

private const val PREFS_NAME = "github_prefs"
private const val KEY_USERNAME = "key_username"

class MainViewModel(application: Application) : AndroidViewModel(application) {

    private val prefs = application.getSharedPreferences(PREFS_NAME, 0)

    private val _username = MutableLiveData<String?>()
    val username: LiveData<String?> = _username

    init {
        _username.value = prefs.getString(KEY_USERNAME, null)
    }

    fun saveUsername(name: String) {
        prefs.edit().putString(KEY_USERNAME, name).apply()
        _username.value = name
    }

    fun clearUsername() {
        prefs.edit().remove(KEY_USERNAME).apply()
        _username.value = null
    }
}
