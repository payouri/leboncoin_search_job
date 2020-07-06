const request = require('request');

const utils = require('./utils')

const Conversation = function (options) {
    if (!(this instanceof Conversation))
        return new Conversation(options);
    options = options || { };
    this.messages = []
    delete options._links;
    Object.assign(this, options)
}

Conversation.prototype.getMessages = function (options) {
    if (options == null) {
        options = {}
    }
    if (options.session == null) {
        options.session = utils.defaultSession;
    }
    var self = this;
    return new Promise(
        function(resolve, reject) {
            if ((options.session.user == null || !options.session.user.isConnected)) {
                return reject("You must be connected");
            }
            url = "https://api.leboncoin.fr/messaging/proxy/api/hal/" + options.session.user.userId + "/conversations/" + self.conversationId + "/messages?ts=" + new Date().getTime() +"&order=asc"
            request.get({
                uri: url,
                jar: options.session.cookieJar,
                headers: options.session.getHeader(),
                gzip: true
            }, function (err, res, body) {
                if (err) {
                    return reject(err);
                }
                body = JSON.parse(body)
                var output = []
                body._embedded.messages.forEach(m => {
                    delete m._links
                    output.push(m)
                })

                resolve(output);
            });
        }
    );
}

Conversation.prototype.reply = function (options) {
    if (options == null) {
        options = {}
    }
    if (options.session == null) {
        options.session = utils.defaultSession;
    }
    var self = this;
    return new Promise(
        function(resolve, reject) {
            if (options.session.user == null || !options.session.user.isConnected) {
                return reject("You must be connected");
            }
            url = "https://api.leboncoin.fr/messaging/proxy/api/hal/" + options.session.user.userId + "/conversations/" + self.conversationId + "/messages"
            request.post({
                uri: url,
                jar: options.session.cookieJar,
                headers: options.session.getHeader(),
                json: {
                    "text": options.message,
                    "attachments":[]
                },
                gzip: true
            }, function (err, res, body) {
                if (err) {
                    return reject(err);
                }
                body = JSON.parse(body)
                delete body._links
                self.messages.unshift(body)
                resolve(body);
            });
        }
    );
}

module.exports.Conversation = Conversation;