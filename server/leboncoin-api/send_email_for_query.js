const leboncoin = require('leboncoin-api');

const QUERY = "peugeot 205";
const NB_PAGE = 10;
const EMAIL_INTERVAL_MIN = 1000; // in ms
const EMAIL_INTERVAL_MAX = 10000; // in ms
const DELAY_BETWEEN_PAGE = 1000; // in ms

const toSend = []
const sentItems = new Set()

function sendEmailAtInterval() {
    if (toSend.length > 0) {
        let item = toSend.shift();
        // don't send twice to the same item
        while (sentItems.has(item.id)) {
            item = toSend.shift();
        }
        if (sentItems.has(item.id)) {
            // all the messages have been sent
            return;
        }
        // send message here
        sentItems.add(item.id)
        console.log("Email for " + item.id + ' sent (' + sentItems.size + '/' + toSend.length + ')');
    }
    if (toSend.length > 0 || sentItems.size == 0) {
        setTimeout(sendEmailAtInterval, EMAIL_INTERVAL_MIN + Math.floor(Math.random() * Math.floor(EMAIL_INTERVAL_MAX)))
    }
}
sendEmailAtInterval();

var query = new leboncoin.Search().setQuery(QUERY);

function crawl(page) {
    if (page > NB_PAGE) {
        return;
    }
    query.setPage(page).run().then(items => {
        for (let item of items.results) {
            // filter if required
            toSend.push(item);
        }
        setTimeout(() => {
            // collect next page
            crawl(++page);
        }, DELAY_BETWEEN_PAGE)
    });
}
crawl(1);