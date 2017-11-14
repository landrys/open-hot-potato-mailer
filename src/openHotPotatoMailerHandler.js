console.log('Loading event');
var mailer = require('./openHotPotatoMailer');

exports.openHotPotatoMailerHandler = function(event, context) {

    // Not using event info 
    console.log("Hello" + JSON.stringify(event, null, '  '));
    var store = event.store;

    mailer.openHotPotatoMailer('Braintree');
    mailer.openHotPotatoMailer('Boston');
    mailer.openHotPotatoMailer('Natick');
    mailer.openHotPotatoMailer('Newton');
    mailer.openHotPotatoMailer('Norwood');
    mailer.openHotPotatoMailer('Westboro');
    mailer.openHotPotatoMailer('Worcester');
}
