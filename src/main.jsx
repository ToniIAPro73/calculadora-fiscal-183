import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from '@/App';
import '@/index.css';

// The pre-rendered HTML (scripts/prerender-seo.js) ships a static #seo-content
// block for crawlers; remove it before React takes over the page.
document.getElementById('seo-content')?.remove();

// The static <title> exists for crawlers and no-JS clients. React 19 hoists the
// per-page <Helmet> title natively but does not replace the static one, which
// would leave duplicate <title> tags after hydration — drop it before mounting.
document.querySelector('head > title')?.remove();

ReactDOM.createRoot(document.getElementById('root')).render(
	<HelmetProvider>
		<App />
	</HelmetProvider>
);
