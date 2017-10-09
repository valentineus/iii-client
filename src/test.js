import { assert } from 'chai';

import {
    decryptJSON,
    connect,
    decrypt,
    encrypt,
    send
} from './index';

describe('iii-client:', () => {
    this.retries(3);
    
    var uuid = '109cd867-0ef3-4473-af71-7543a9b2fccd';
    var cuid = '0340feab-b09e-4960-96e9-c9518b1fb157';
    var text = 'Hello, World!';
    var data = JSON.stringify({ text });

    it('encrypt():', () => {
        assert.notEqual(text, encrypt(text));
    });

    it('decrypt():', () => {
        var encrypted = encrypt(text);
        assert.equal(text, decrypt(encrypted));
    });

    it('decryptJSON():', () => {
        var encrypted = encrypt(data);
        assert.equal(data, decrypt(encrypted).toString());
    });

    it('connect():', (done) => {
        connect(uuid, (request) => {
            assert.isObject(request);
            done();
        });
    });

    it('send():', (done) => {
        send(cuid, text, (request) => {
            assert.isObject(request);
            done();
        });
    });
});