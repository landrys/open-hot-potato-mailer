# open-hot-potato-mailer
Notify store managers of hot potatoes more than a day old.

### Installation

Make sure you get a private.js module and put in src folder with credentials.

NPM

```sh
npm install
rm dist/*.zip
npm run build-aws-zip
#If have no function on AWS
npm create-aws-function
#if created already
npm update-aws-function
```
