# III Client
[![npm](https://img.shields.io/npm/v/iii-client.svg)](https://www.npmjs.com/package/iii-client)

Simple API for communicating with the bot of the \"iii.ru\" service.

**Attention!** At the moment there are difficulties with the `iii.ru` service, there is a possibility that the service will not be restored. All information on the company's
[forum](http://forum.iii.ru/index.php?showtopic=19886).

## Features
- A small and light library.
- Receiving and sending messages.
- Installation and processing of sessions.

## Installation
NodeJS:
```bash
npm install --save iii-client
```

Browser:
```html
<script src="https://unpkg.com/iii-client@latest/dist/bundle.js">
    /* client - This is the global name for accessing the package */
</script>
```

## Using
An example of a connection, receiving session identification and sending a bot message:
```javascript
import client from 'iii-client';

const uuid = '109cd867-0ef3-4473-af71-7543a9b2fccd';
const text = 'Hello, World!';

// We connect to the system and get a session
client.connect(uuid).then(session => {
    // Send the message and process the response
    client.send(session.cuid, text).then(answer => {
        console.info(answer);
    });
}).catch(error => console.error(error.message));
```

## API
### Functions

#### connect(uuid)
Connects to the server and returns the connection data.

**Promise**: <code>Object</code> Answer from the server.

**Rejects**: <code>Error</code> If there are errors in operation.

| Param | Type | Description |
| --- | --- | --- |
| uuid | <code>String</code> | The bot ID. |

#### send(cuid, text)
Send a message to the server and return a response.

**Promise**: <code>Object</code> Answer from the server.

**Rejects**: <code>Error</code> If there are errors in operation.

| Param | Type | Description |
| --- | --- | --- |
| cuid | <code>String</code> | Session identifier. |
| text | <code>String</code> | Message text. |

Found out a mistake or feel a lack of functionality?
[issues](https://github.com/valentineus/iii-client/issues)

## License
[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/eslint/eslint)

[MIT](LICENSE.md).
Copyright (c)
[Valentin Popov](https://valentineus.link/).