package com.example.GitHubSearch.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.GitHubSearch.data.model.Repo
import com.example.GitHubSearch.data.repository.RepoRepository
import kotlinx.coroutines.launch

class RepoListViewModel : ViewModel() {

    private val repository = RepoRepository()

    private val _repos = MutableLiveData<List<Repo>>()
    val repos: LiveData<List<Repo>> = _repos

    private val _loading = MutableLiveData<Boolean>(false)
    val loading: LiveData<Boolean> = _loading

    private val _error = MutableLiveData<String?>()
    val error: LiveData<String?> = _error

    fun loadRepos(username: String) {
        _loading.value = true
        _error.value = null
        viewModelScope.launch {
            val result = repository.getRepos(username)
            if (result.isSuccess) {
                _repos.value = result.getOrDefault(emptyList())
            } else {
                _error.value = result.exceptionOrNull()?.localizedMessage ?: "Unknown error"
            }
            _loading.value = false
        }
    }
}
