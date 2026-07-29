import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';

// The pre-rendered HTML (scripts/prerender-seo.js) ships a static #seo-content
// block for crawlers; remove it before React takes over the page.
document.getElementById('seo-content')?.remove();

ReactDOM.createRoot(document.getElementById('root')).render(
	<App />
);
