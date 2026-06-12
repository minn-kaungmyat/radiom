import icecastParser from 'icecast-parser';

const Parser = icecastParser.Parser || icecastParser;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).send('Method Not Allowed');
  }

  const streamUrl = req.query.url;
  if (!streamUrl) {
    return res.status(400).send('URL is required');
  }

  // Set aggressive Edge Caching
  // s-maxage=30 tells Vercel's Edge Network to cache this for 30s
  // stale-while-revalidate=15 allows serving stale content while fetching fresh
  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=15');

  try {
    const title = await new Promise((resolve) => {
      let resolved = false;
      
      let radio;
      try {
        radio = new Parser({
          url: streamUrl,
          keepListen: false, // Don't keep listening
          autoUpdate: false, // Don't auto update
          errorInterval: 1,
          emptyInterval: 1,
          metadataInterval: 1,
        });
      } catch (err) {
        console.error("Failed to initialize parser", err);
        return resolve(null);
      }

      // Fail-safe timeout to prevent hanging the serverless function
      const timeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          try { radio.stop(); } catch(e){}
          resolve(null);
        }
      }, 5000);

      radio.on('metadata', (metadata) => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeout);
          try { radio.stop(); } catch(e){} // Immediately destroy connection to save bandwidth
          const streamTitle = metadata instanceof Map ? metadata.get('StreamTitle') : metadata.StreamTitle;
          resolve(streamTitle || null);
        }
      });

      radio.on('error', (error) => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeout);
          try { radio.stop(); } catch(e){}
          console.error(`Error fetching metadata for ${streamUrl}:`, error.message);
          resolve(null); // Don't throw, just return null so frontend doesn't crash
        }
      });
      
      radio.on('empty', () => {
         if (!resolved) {
           resolved = true;
           clearTimeout(timeout);
           try { radio.stop(); } catch(e){}
           resolve(null);
         }
      });
    });

    res.status(200).json({ title });
  } catch (error) {
    console.error('Proxy fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch metadata' });
  }
}
