package com.example.GitHubSearch.ui.adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.example.GitHubSearch.data.model.Repo
import com.example.GitHubSearch.databinding.ItemRepoBinding

class RepoAdapter(
    private val onShareClicked: (Repo) -> Unit
) : ListAdapter<Repo, RepoAdapter.RepoViewHolder>(DiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RepoViewHolder {
        val binding = ItemRepoBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return RepoViewHolder(binding)
    }

    override fun onBindViewHolder(holder: RepoViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    inner class RepoViewHolder(private val binding: ItemRepoBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(repo: Repo) {
            binding.textName.text = repo.name
            binding.textDescription.text = repo.description ?: "No description"
            binding.textStars.text = "★ ${repo.stars}"
            binding.buttonShare.setOnClickListener { onShareClicked(repo) }
            binding.root.setOnClickListener {
                // Open in browser
                val intent = android.content.Intent(android.content.Intent.ACTION_VIEW, android.net.Uri.parse(repo.htmlUrl))
                binding.root.context.startActivity(intent)
            }
        }
    }

    class DiffCallback : DiffUtil.ItemCallback<Repo>() {
        override fun areItemsTheSame(oldItem: Repo, newItem: Repo) = oldItem.id == newItem.id
        override fun areContentsTheSame(oldItem: Repo, newItem: Repo) = oldItem == newItem
    }
}
