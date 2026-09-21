package com.example.GitHubSearch.data.repository

import com.example.GitHubSearch.data.model.Repo
import com.example.GitHubSearch.data.network.RetrofitClient
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class RepoRepository {
    private val api = RetrofitClient.apiService

    suspend fun getRepos(username: String): Result<List<Repo>> {
        return withContext(Dispatchers.IO) {
            try {
                val repos = api.listRepos(username)
                Result.success(repos)
            } catch (e: Exception) {
                Result.failure(e)
            }
        }
    }
}
