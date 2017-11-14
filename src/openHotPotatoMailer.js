var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB({
    apiVersion: '2012-08-10'
});
var docClient = new AWS.DynamoDB.DocumentClient();

var jsJoda = require('js-joda').use(require('js-joda-timezone'));
var LocalDateTime = jsJoda.LocalDateTime;
var ZonedDateTime = jsJoda.ZonedDateTime;
var ZoneId = jsJoda.ZoneId;
var Duration = jsJoda.Duration;

var myMailer = require('./myNodeMailer');


/* 
 * Will check if any need to be emailed to manager of the given store.
 */
module.exports.openHotPotatoMailer = function(store) {
    
    let params = {
        ExpressionAttributeValues: {
            ':s': {
                S: store
            }
        },
        KeyConditionExpression: 'sstore = :s',
        FilterExpression: 'attribute_not_exists(closed)',
        TableName: 'OpenHotPotato'
    };

    dynamodb.query(params, function(err, data) {
        var hpsToEmail = [];
        if (err) {
            console.log(err, err.stack) // an error occurred
        } else {

            /*
             * then check if hours is greated than 23. if so add it to list to be notified.
             *
             * Do this for each store every day on a given hour just after the Closer cron hour
             */

            data.Items.forEach(function(element) {
                if ( !needToClose(element.created.S, element.hours.N, element.id.N) &&
                    Number(element.hours.N) > 23 )
                    hpsToEmail.push(element);
            });

            let body = 'These open hotpotatoes have been open for over a day. Details are included below.\n';;

            let manager = 'landryseleven@gmail.com,jleland@landrys.com';
            //let manager = 'fpiergen@landrys.com';

            
            if (hpsToEmail.length > 0) {
                manager =  hpsToEmail[0].manager.S + "," + manager;
                console.log(manager);
            }
            

            hpsToEmail.forEach(function(element) {
                body = body + buildBody(element);
            });

            if (hpsToEmail.length > 0)
                emailIt(manager, store + ' OpenHotPotatoes', body);

        }
    });

};

function buildBody(element) {

    let body = '\nHotPotato: ' + element.hotPotato.S + ' has been open for ' + element.hours.N + ' hours. \n' +
        'Item: ' + element.iitem.S + '\n' +
        'Customer: ' + element.customer.S + '\n' +
        'Employee: ' + element.employee.S + '\n' +
        'LinkToSpecialOrder: ' + element.specialOrderLink.S + '\n';

    return body;
}

function emailIt(to, subject, body) {
    myMailer.mailIt(to, subject, body);
}

// TODO: Should factor this out. We are  using it in two places now...
function needToClose(created, hours, id) {

    created = created.replace(" ", "T");

    // Put in the same timezone
    var then = LocalDateTime
        .parse(created)
        .atZone(ZoneId.of('America/New_York'));
    var now = ZonedDateTime.now(ZoneId.of('America/New_York'));

    var d = Duration.between(then, now);
    var diffMinCreatedToNow = (d._seconds / 60);
    var diffMinFromHours = hours * 60;

    // Hours are incremented for every check of open HP every hour
    // If the time difference from when the HP was created to now is
    // greater than the hours then it is no longer open and we need to close it
    if (diffMinCreatedToNow > diffMinFromHours) {
        return true;
    } else {
        return false;
    }
}
