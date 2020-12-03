const accountSid = 'ACeddbc774d03acbf36b3385dc84bf66fe';
const authToken = 'f8554ef970274c2053c48509dbff1a43';
const client = require('twilio')(accountSid, authToken);
let x = 0
for (var i = 0; i < 10; i++){
    x++
}
client.messages
    .create({
        body: `This is the OTP code ${x}`,
        from: '+12566158275',
        to: '+2347015254713'
    })
    .then(message => console.log(message.sid))
    .catch(err=> console.log(err))