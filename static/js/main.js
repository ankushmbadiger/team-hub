(function () {
  'use strict';

  // ---- Theme (display preference only, stored in this browser) ----
  var KEY = 'teamhub-theme';
  var root = document.documentElement;

  function resolve(pref) {
    if (pref === 'system') {
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    return pref;
  }
  function load() {
    try { return localStorage.getItem(KEY) || 'dark'; } catch (e) { return 'dark'; }
  }
  function save(pref) {
    try { localStorage.setItem(KEY, pref); } catch (e) { /* storage unavailable */ }
  }

  var pref = load();
  root.dataset.theme = resolve(pref);

  document.addEventListener('DOMContentLoaded', function () {
    var select = document.querySelector('[data-theme-select]');
    if (select) {
      select.value = pref;
      select.addEventListener('change', function () {
        save(select.value);
        root.dataset.theme = resolve(select.value);
      });
    }

    // ---- Sidebar toggle (mobile) ----
    var sidebar = document.getElementById('sidebar');
    var toggle = document.querySelector('[data-sidebar-toggle]');
    function setOpen(open) {
      sidebar.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    }
    if (sidebar && toggle) {
      toggle.addEventListener('click', function () { setOpen(!sidebar.classList.contains('is-open')); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
    }

    // ---- Highlight the current page in the sidebar ----
    var page = document.body.dataset.page;
    var link = document.querySelector('[data-nav="' + page + '"]');
    if (link) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }
  });
})();
