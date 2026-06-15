// Llama a este endpoint tras cada deploy para notificar a Bing/IndexNow
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const key = process.env.INDEXNOW_KEY;
  if (!key) {
    return res.status(500).json({ error: 'INDEXNOW_KEY not configured' });
  }

  const host = 'www.regla183.com';
  const urls = [
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
  ];

  const body = JSON.stringify({
    host,
    key,
    keyLocation: `https://${host}/${key}.txt`,
    urlList: urls,
  });

  try {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body,
      timeout: 10000,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(`IndexNow API error: ${response.status}`, errorText);
      return res.status(response.status).json({
        error: `IndexNow API returned ${response.status}`,
        details: errorText,
      });
    }

    return res.status(200).json({
      success: true,
      status: response.status,
      urls: urls.length,
    });
  } catch (error) {
    console.error('IndexNow request failed:', error.message);
    return res.status(503).json({
      error: 'Failed to notify IndexNow',
      message: error.message,
    });
  }
}
