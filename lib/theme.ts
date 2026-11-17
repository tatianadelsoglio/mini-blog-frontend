export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "cuaderno-theme";

/**
 * Corre en el <head> antes de pintar: aplica la elección guardada o, si no hay,
 * prefers-color-scheme (y lo sigue mientras no haya elección). Evita el parpadeo.
 */
export const THEME_INIT_SCRIPT = `(function(){var k=${JSON.stringify(THEME_STORAGE_KEY)},r=document.documentElement,m=window.matchMedia("(prefers-color-scheme: dark)");function s(){var t=null;try{t=localStorage.getItem(k)}catch(e){}if(t!=="light"&&t!=="dark"){t=m.matches?"dark":"light"}r.dataset.theme=t}s();m.addEventListener("change",s)})();`;
