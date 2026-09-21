package com.example.GitHubSearch.data.network

import com.example.GitHubSearch.data.model.Repo
import retrofit2.http.GET
import retrofit2.http.Path

interface ApiService {
    @GET("users/{username}/repos")
    suspend fun listRepos(@Path("username") username: String): List<Repo>
}
