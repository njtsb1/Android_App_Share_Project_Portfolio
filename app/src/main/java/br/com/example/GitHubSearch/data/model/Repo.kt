package com.example.GitHubSearch.data.model

import com.google.gson.annotations.SerializedName

data class Repo(
    val id: Long,
    val name: String,
    @SerializedName("html_url")
    val htmlUrl: String,
    val description: String?,
    @SerializedName("stargazers_count")
    val stars: Int
)
