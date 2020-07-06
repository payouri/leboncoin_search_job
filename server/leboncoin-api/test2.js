const leboncoin = require('./lib/item');
const search = require('./lib/search');
const request = require('request');

var sea = new search.Search()
    .setPage(1)
    .setQuery("peugeot 205")
    .setTitleOnly(true);
sea.run().then(function (data) {  
    //nothing for the moment 
console.log(data);
}, function (err) {
    console.error(err);
});
