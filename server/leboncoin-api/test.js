const Item = require('./lib/item').Item;
const filters = require('./lib/filters');
const search = require('./lib/search');
const user = require('./lib/user');
const Session = require('./lib/session').Session;

// new Item({id: "1666780928"}).reply({message: "Bonjour" , name: "Pierre", email: "vb@allotele.com"}).then(conversation => {
//     // email sent
// })

// var s = new Session({"email": "test@leeching.net", "password": "123456789a"});
// s.login().then(function (user) {
//     console.log(user)
//     user.getConversations({session: s}).then(cs => {
//         console.log(cs[0])
//         cs[0].getMessages({session: s}).then(console.log, console.log)
//     })
// });

// new Item({id: '1765169954'}).reply({message: 'Bonjour,\nVotre iPhone 6 est-il toujours à vendre?\n\nMerci\nPierre', name: 'Pierre', email: 'cirorev156@mrisemail.com'}).then(conversation => {
//     conversation.getMessages().then(console.log)
// })

var s = new Session({"email": "test@leeching.net", "password": "123456789a"});
s.login().then(() => {
    new Item({id: '1765169954'}).reply({message: 'Bonjour,\nVotre iPhone 6 est-il toujours à vendre?\n\nMerci\nPierre', name: 'Pierre', email: 'cirorev156@mrisemail.com', session: s}).then(conversation => {
        conversation.getMessages({session: s}).then(console.log)
    })
})


// var s = new search.Search()
// .setPage(1)
// .setQuery("renove")
// .setFilter(filters.PARTICULIER)
// .setCategory("locations")
// .setRegion("ile_de_france")
// .setDepartment("yvelines")
// .setLocation([
//              {"zipcode": "78100"},
//              {"zipcode": "78000"},
//              ])
// .addSearchExtra("price", {min: 0, max: 100000}) 
// .addSearchExtra('furnished', ["1", "Non meublé"]); 

// s.run().then(function (data) {
//     data.results[0].getDetails().then(function (details) {
//         console.log(details); // the item 0 with more data such as description, all images, author, ...
//     }, function (err) {
//         console.error(err);
//     });
//     data.results[0].getPhoneNumber().then(function (phoneNumer) {
//         console.log(phoneNumer); // the phone number of the author if available
//     }, function (err) {
//         console.error(err); // if the phone number is not available or not parsable (image -> string) 
//     });
// }, function (err) {
//     console.error(err);
// });


/*new search.Search()
	.setPage(1)
    .setQuery("renove")
    .run().then(function (data) {
        console.log (data.results[0])
	data.results[0].getPhoneNumber().then(function (details) {
        console.log(details); // the item 0 with more data such as description, all images, author, ...
    }, function (err) {
        console.error(err);
    });
}, function (err) {
                done(err);
});

var item = leboncoin.Item({id: '903589901'});
item.getPhoneNumber().then(function (number) {
	console.log(number);
}, function (error) {
	console.error(error);
})
*/