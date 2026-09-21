(() => {
  'use strict';

  const DEFAULT_LANG = 'en-US';
  const LANG_KEY = 'ghs_lang';
  const THEME_KEY = 'ghs_theme';
  const USER_KEY = 'ghs_user';

  const elements = {
    lang: document.getElementById('lang'),
    themeToggle: document.getElementById('theme-toggle'),
    usernameInput: document.getElementById('username'),
    form: document.getElementById('user-form'),
    btnConfirm: document.getElementById('btn-confirm'),
    btnReset: document.getElementById('btn-reset'),
    btnOpenSaved: document.getElementById('btn-open-saved'),
    savedInfo: document.getElementById('saved-info'),
    status: document.getElementById('status'),
    repoList: document.getElementById('repo-list'),
    appTitle: document.getElementById('app-title'),
    introTitle: document.getElementById('intro-title'),
    introDesc: document.getElementById('intro-desc'),
    formTitle: document.getElementById('form-title'),
    resultsTitle: document.getElementById('results-title'),
    footerText: document.getElementById('footer-text')
  };

  const strings = {
    'en-US': {
      title: 'GitHub Portfolio',
      introTitle: 'Save GitHub Username',
      introDesc: 'Enter a GitHub username to list public repositories. The username is saved locally and can be reset.',
      formTitle: 'User',
      usernameLabel: 'Username',
      confirm: 'Confirm',
      openSaved: 'Open Saved',
      reset: 'Reset',
      noSaved: 'No username saved',
      results: 'Results',
      noResults: 'No results',
      fetching: 'Fetching repositories...',
      fetchError: 'Error fetching repositories',
      shareText: 'Check this GitHub repo',
      copySuccess: 'Repository URL copied to clipboard',
      noShare: 'Share not supported, URL copied'
    },
    'pt-BR': {
      title: 'Portfólio GitHub',
      introTitle: 'Salvar usuário do GitHub',
      introDesc: 'Insira um usuário do GitHub para listar repositórios públicos. O usuário é salvo localmente e pode ser redefinido.',
      formTitle: 'Usuário',
      usernameLabel: 'Nome do usuário',
      confirm: 'Confirmar',
      openSaved: 'Abrir salvo',
      reset: 'Redefinir',
      noSaved: 'Nenhum usuário salvo',
      results: 'Resultados',
      noResults: 'Sem resultados',
      fetching: 'Buscando repositórios...',
      fetchError: 'Erro ao buscar repositórios',
      shareText: 'Veja este repositório no GitHub',
      copySuccess: 'URL do repositório copiada',
      noShare: 'Compartilhar não suportado, URL copiada'
    },
    'es': {
      title: 'Portafolio GitHub',
      introTitle: 'Guardar usuario de GitHub',
      introDesc: 'Ingrese un usuario de GitHub para listar repositorios públicos. El usuario se guarda localmente y se puede restablecer.',
      formTitle: 'Usuario',
      usernameLabel: 'Nombre de usuario',
      confirm: 'Confirmar',
      openSaved: 'Abrir guardado',
      reset: 'Restablecer',
      noSaved: 'Ningún usuario guardado',
      results: 'Resultados',
      noResults: 'Sin resultados',
      fetching: 'Obteniendo repositorios...',
      fetchError: 'Error al obtener repositorios',
      shareText: 'Mira este repositorio en GitHub',
      copySuccess: 'URL del repositorio copiada',
      noShare: 'Compartir no soportado, URL copiada'
    }
  };

  // Utilities
  const $ = sel => document.querySelector(sel);
  const setText = (el, text) => { if (el) el.textContent = text; };

  // Theme handling
  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      elements.themeToggle.setAttribute('aria-pressed', 'false');
    } else {
      document.documentElement.classList.remove('light');
      elements.themeToggle.setAttribute('aria-pressed', 'true');
    }
    localStorage.setItem(THEME_KEY, theme);
  }

  function toggleTheme() {
    const current = localStorage.getItem(THEME_KEY) || 'dark';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  // Language handling
  function applyLanguage(lang) {
    const L = strings[lang] ? lang : DEFAULT_LANG;
    localStorage.setItem(LANG_KEY, L);
    elements.lang.value = L;

    const s = strings[L];
    setText(elements.appTitle, s.title);
    setText(elements.introTitle, s.introTitle);
    setText(elements.introDesc, s.introDesc);
    setText(elements.formTitle, s.formTitle);
    document.getElementById('label-username').textContent = s.usernameLabel;
    elements.btnConfirm.textContent = s.confirm;
    elements.btnOpenSaved.textContent = s.openSaved;
    elements.btnReset.textContent = s.reset;
    elements.savedInfo.textContent = localStorage.getItem(USER_KEY) ? `${s.formTitle}: ${localStorage.getItem(USER_KEY)}` : s.noSaved;
    elements.status.textContent = s.noResults;
    setText(elements.resultsTitle, s.results);
    setText(elements.footerText, 'Developed by Nivaldo Beirão');
  }

  // Repo rendering
  function clearRepos() {
    elements.repoList.innerHTML = '';
  }

  function renderRepos(repos) {
    clearRepos();
    if (!repos || repos.length === 0) {
      elements.status.textContent = strings[getLang()].noResults;
      return;
    }
    elements.status.textContent = `${repos.length} ${strings[getLang()].results.toLowerCase()}`;
    const fragment = document.createDocumentFragment();
    repos.forEach(repo => {
      const li = document.createElement('li');
      li.className = 'repo-item';
      li.innerHTML = `
        <div class="repo-meta">
          <p class="repo-title" title="${escapeHtml(repo.name)}">${escapeHtml(repo.name)}</p>
          <p class="repo-desc">${escapeHtml(repo.description || '')}</p>
          <p class="muted" aria-hidden="true">★ ${repo.stargazers_count || 0}</p>
        </div>
        <div class="repo-actions">
          <button class="open" data-url="${escapeHtml(repo.html_url)}">Open</button>
          <button class="share" data-url="${escapeHtml(repo.html_url)}">Share</button>
        </div>
      `;
      fragment.appendChild(li);
    });
    elements.repoList.appendChild(fragment);

    // Attach handlers
    elements.repoList.querySelectorAll('button.open').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const url = e.currentTarget.dataset.url;
        window.open(url, '_blank', 'noopener');
      });
    });
    elements.repoList.querySelectorAll('button.share').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const url = e.currentTarget.dataset.url;
        await shareOrCopy(url);
      });
    });
  }

  // Fetch GitHub repos
  async function fetchRepos(username) {
    const lang = getLang();
    elements.status.textContent = strings[lang].fetching;
    clearRepos();
    try {
      const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100`);
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      renderRepos(data);
    } catch (err) {
      elements.status.textContent = `${strings[getLang()].fetchError}: ${err.message}`;
    }
  }

  // Share or copy fallback
  async function shareOrCopy(url) {
    const lang = getLang();
    try {
      if (navigator.share) {
        await navigator.share({ title: strings[lang].shareText, text: strings[lang].shareText, url });
      } else {
        await navigator.clipboard.writeText(url);
        alert(strings[lang].noShare);
      }
    } catch (err) {
      try {
        await navigator.clipboard.writeText(url);
        alert(strings[lang].copySuccess);
      } catch (e) {
        console.warn('Share/copy failed', e);
      }
    }
  }

  // Helpers
  function getLang() {
    return localStorage.getItem(LANG_KEY) || DEFAULT_LANG;
  }

  function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  // Init
  function init() {
    // Theme: default dark
    const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
    applyTheme(savedTheme);

    // Language
    const savedLang = getLang();
    applyLanguage(savedLang);

    // Username
    const savedUser = localStorage.getItem(USER_KEY);
    if (savedUser) {
      elements.usernameInput.value = savedUser;
      elements.savedInfo.textContent = `${strings[savedLang].formTitle}: ${savedUser}`;
    } else {
      elements.savedInfo.textContent = strings[savedLang].noSaved;
    }

    // Event listeners
    elements.themeToggle.addEventListener('click', toggleTheme);

    elements.lang.addEventListener('change', (e) => {
      applyLanguage(e.target.value);
    });

    elements.form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const username = elements.usernameInput.value.trim();
      if (!username) {
        elements.status.textContent = strings[getLang()].noResults;
        return;
      }
      localStorage.setItem(USER_KEY, username);
      elements.savedInfo.textContent = `${strings[getLang()].formTitle}: ${username}`;
      fetchRepos(username);
    });

    elements.btnReset.addEventListener('click', () => {
      localStorage.removeItem(USER_KEY);
      elements.usernameInput.value = '';
      elements.savedInfo.textContent = strings[getLang()].noSaved;
      clearRepos();
      elements.status.textContent = strings[getLang()].noResults;
    });

    elements.btnOpenSaved.addEventListener('click', () => {
      const saved = localStorage.getItem(USER_KEY);
      if (saved) {
        elements.usernameInput.value = saved;
        fetchRepos(saved);
      } else {
        elements.status.textContent = strings[getLang()].noSaved;
      }
    });

    // Keyboard accessibility: Enter on input triggers submit
    elements.usernameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        elements.form.dispatchEvent(new Event('submit', { cancelable: true }));
      }
    });
  }

  // Run
  document.addEventListener('DOMContentLoaded', init);
})();
