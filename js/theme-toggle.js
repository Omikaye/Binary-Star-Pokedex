(() => {
	'use strict';
	const THEME_STORAGE_KEY = 'pokedex-theme';

	function readStoredTheme() {
		try {
			return window.localStorage.getItem(THEME_STORAGE_KEY);
		} catch (e) {
			return null;
		}
	}

	function writeStoredTheme(theme) {
		try {
			window.localStorage.setItem(THEME_STORAGE_KEY, theme);
		} catch (e) {}
	}

	function applyTheme(theme, toggle) {
		const isDark = theme === 'dark';
		document.body.classList.toggle('dark-mode', isDark);
		if (toggle) toggle.checked = isDark;
	}

	function initThemeToggle() {
		const toggle = document.getElementById('theme-toggle');
		if (!toggle) return;

		const storedTheme = readStoredTheme();
		applyTheme(storedTheme === 'dark' ? 'dark' : 'light', toggle);

		toggle.addEventListener('change', () => {
			const nextTheme = toggle.checked ? 'dark' : 'light';
			applyTheme(nextTheme, toggle);
			writeStoredTheme(nextTheme);
		});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initThemeToggle);
	} else {
		initThemeToggle();
	}
})();
