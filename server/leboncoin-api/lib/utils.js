const Session = require('./session').Session;

module.exports.defaultSession = new Session();

module.exports.requestHeaders = {
    // 'Host': 'www.leboncoin.fr',
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0',
    'Accept': 'application/json',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Cache-Control': 'max-age=0',
    'Content-Type': 'application/json',
    'Referer': "https://www.leboncoin.fr/recherche/",
    'Origin': 'https://www.leboncoin.fr'
};
module.exports.getParisGMT = function() {
    var d = new Date();
    var s = d.toLocaleString(undefined, { timeZone: "Europe/Paris", timeZoneName: "short" });
    return s.slice(-5)
};
