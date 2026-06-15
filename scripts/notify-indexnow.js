/* global process */
// Se ejecuta automáticamente tras cada build
const key = process.env.INDEXNOW_KEY;

if (!key) {
  console.log('IndexNow: Skipped (INDEXNOW_KEY not set)');
  process.exit(0);
}

const payload = {
  host: 'www.regla183.com',
  key,
  keyLocation: `https://www.regla183.com/${key}.txt`,
  urlList: [
    'https://www.regla183.com/',
    'https://www.regla183.com/en',
    'https://www.regla183.com/es/privacy',
    'https://www.regla183.com/en/privacy',
    'https://www.regla183.com/es/terms',
    'https://www.regla183.com/en/terms',
    'https://www.regla183.com/es/legal',
    'https://www.regla183.com/en/legal',
    'https://www.regla183.com/es/cookies',
    'https://www.regla183.com/en/cookies',
    'https://www.regla183.com/es/guide',
    'https://www.regla183.com/en/guide',
    'https://www.regla183.com/es/about',
    'https://www.regla183.com/en/about',
  ],
};

const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
  signal: controller.signal,
})
  .then((response) => {
    clearTimeout(timeout);
    if (response.ok) {
      console.log(`✓ IndexNow notified: ${response.status} (${payload.urlList.length} URLs)`);
    } else {
      console.warn(`✗ IndexNow: HTTP ${response.status}`);
    }
  })
  .catch((error) => {
    clearTimeout(timeout);
    if (error.name === 'AbortError') {
      console.warn('✗ IndexNow: Request timeout (10s)');
    } else {
      console.warn(`✗ IndexNow: ${error.message}`);
    }
  });
