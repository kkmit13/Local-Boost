// app.js - theme toggle and basic wiring
// Initializes theme based on localStorage or system preference and toggles site theme

(function(){
	const THEME_KEY = 'localboost_theme';
	const htmlEl = document.documentElement;
	const toggle = document.getElementById('theme-switch');

	function setTheme(theme){
		if(theme === 'dark'){
			htmlEl.setAttribute('data-theme', 'dark');
		} else {
			htmlEl.removeAttribute('data-theme');
		}
		try{ localStorage.setItem(THEME_KEY, theme); } catch(e){}
	}

	function initTheme(){
		let saved = null;
		try{ saved = localStorage.getItem(THEME_KEY); } catch(e){}
		if(saved){
			setTheme(saved);
			if(toggle) toggle.checked = (saved === 'dark');
			return;
		}

		// Respect system preference
		const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
		setTheme(prefersDark ? 'dark' : 'light');
		if(toggle) toggle.checked = prefersDark;
	}

	function onToggle(){
		if(!toggle) return;
		toggle.addEventListener('change', () => {
			setTheme(toggle.checked ? 'dark' : 'light');
		});
	}

	// Initialize when DOM ready
	if(document.readyState === 'loading'){
		document.addEventListener('DOMContentLoaded', () => { initTheme(); onToggle(); });
	} else {
		initTheme(); onToggle();
	}

})();

