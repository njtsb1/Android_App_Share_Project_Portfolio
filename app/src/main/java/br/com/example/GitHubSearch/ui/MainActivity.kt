package com.example.GitHubSearch.ui

import android.content.Intent
import android.os.Bundle
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import com.example.GitHubSearch.databinding.ActivityMainBinding
import com.example.GitHubSearch.viewmodel.MainViewModel
import com.google.android.material.snackbar.Snackbar

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private val vm: MainViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        vm.username.observe(this) { saved ->
            binding.editUsername.setText(saved ?: "")
            binding.textSavedUsername.text = if (saved.isNullOrBlank()) "No username saved" else "Saved: $saved"
        }

        binding.buttonConfirm.setOnClickListener {
            val username = binding.editUsername.text.toString().trim()
            if (username.isEmpty()) {
                Snackbar.make(binding.root, "Please enter a username", Snackbar.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            vm.saveUsername(username)
            // Open repo list
            val intent = Intent(this, RepoListActivity::class.java).apply {
                putExtra(RepoListActivity.EXTRA_USERNAME, username)
            }
            startActivity(intent)
        }

        binding.buttonReset.setOnClickListener {
            vm.clearUsername()
            binding.editUsername.setText("")
            Snackbar.make(binding.root, "Username reset", Snackbar.LENGTH_SHORT).show()
        }

        binding.buttonOpenSaved.setOnClickListener {
            val saved = vm.username.value
            if (saved.isNullOrBlank()) {
                Snackbar.make(binding.root, "No saved username", Snackbar.LENGTH_SHORT).show()
            } else {
                val intent = Intent(this, RepoListActivity::class.java).apply {
                    putExtra(RepoListActivity.EXTRA_USERNAME, saved)
                }
                startActivity(intent)
            }
        }
    }
}
