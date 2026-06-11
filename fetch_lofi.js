const https = require('https');

https.get('https://de1.api.radio-browser.info/json/stations/search?tag=lofi&limit=20&order=clickcount&reverse=true&hidebroken=true', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const stations = JSON.parse(data);
    stations.forEach(s => {
      console.log(`${s.name.padEnd(40)} | UUID: ${s.stationuuid} | Votes: ${s.votes} | Clicks: ${s.clickcount}`);
    });
  });
});
