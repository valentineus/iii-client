# III Client
[![npm](https://img.shields.io/npm/v/iii-client.svg)](https://www.npmjs.com/package/iii-client)
[![dependencies Status](https://david-dm.org/valentineus/iii-client/status.svg)](https://david-dm.org/valentineus/iii-client)
[![devDependencies Status](https://david-dm.org/valentineus/iii-client/dev-status.svg)](https://david-dm.org/valentineus/iii-client?type=dev)

Simple API for communicating with the bot of the \"iii.ru\" service.

## Features
- A small and light library.
- Receiving and sending messages.
- Installation and processing of sessions.

## Installation
```bash
npm install --save iii-client
```

## Using
To use the bot will require identification number. The bot address can be of two kinds: `http://iii.ru/inf/109cd867-0ef3-4473-af71-7543a9b2fccd` and `http://109cd867-0ef3-4473-af71-7543a9b2fccd.iii.ru/`. In the address line, the value `109cd867-0ef3-4473-af71-7543a9b2fccd` is the bot identification number.

An example of a connection, receiving session identification and sending a bot message:
```javascript
import bot from 'iii-client';

var uuid = '109cd867-0ef3-4473-af71-7543a9b2fccd';

// We connect to the system and get a session
bot.connect(uuid, function(data) {
    const options = {
        cuid: data.cuid,
        text: 'Проверка связи. Ты получил моё сообщение?',
    }

    // Send the message and process the response
    bot.send(options, function(raw) {
        console.log(raw);
    });
});
```

Enjoy!

## API
Description of the internal kitchen can be seen on the [documentation page](https://valentineus.github.io/iii-client/).

Found out a mistake or feel a lack of functionality? [issues](https://github.com/valentineus/iii-client/issues)

## License
[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/eslint/eslint)

[MIT](LICENSE.md). Copyright (c) [Valentin Popov](https://valentineus.link/).