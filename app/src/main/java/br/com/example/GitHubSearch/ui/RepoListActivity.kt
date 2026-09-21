package com.example.GitHubSearch.ui

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.GitHubSearch.databinding.ActivityRepoListBinding
import com.example.GitHubSearch.ui.adapter.RepoAdapter
import com.example.GitHubSearch.viewmodel.RepoListViewModel
import com.google.android.material.snackbar.Snackbar

class RepoListActivity : AppCompatActivity() {

    companion object {
        const val EXTRA_USERNAME = "extra_username"
    }

    private lateinit var binding: ActivityRepoListBinding
    private val vm: RepoListViewModel by viewModels()
    private lateinit var adapter: RepoAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRepoListBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val username = intent.getStringExtra(EXTRA_USERNAME) ?: ""
        title = "Repos: $username"

        adapter = RepoAdapter { repo ->
            // Share repo URL
            val shareIntent = Intent(Intent.ACTION_SEND).apply {
                type = "text/plain"
                putExtra(Intent.EXTRA_SUBJECT, "Check this GitHub repo")
                putExtra(Intent.EXTRA_TEXT, "${repo.name}: ${repo.htmlUrl}")
            }
            startActivity(Intent.createChooser(shareIntent, "Share repository"))
        }

        binding.recycler.layoutManager = LinearLayoutManager(this)
        binding.recycler.adapter = adapter

        vm.repos.observe(this) { list ->
            adapter.submitList(list)
            binding.textResults.text = "Results: ${list.size} repositories"
        }

        vm.loading.observe(this) { loading ->
            binding.progressBar.visibility = if (loading) android.view.View.VISIBLE else android.view.View.GONE
        }

        vm.error.observe(this) { err ->
            if (!err.isNullOrBlank()) {
                Snackbar.make(binding.root, "Error: $err", Snackbar.LENGTH_LONG).show()
            }
        }

        if (username.isNotBlank()) {
            vm.loadRepos(username)
        } else {
            Snackbar.make(binding.root, "No username provided", Snackbar.LENGTH_SHORT).show()
        }
    }
}
