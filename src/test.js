import { assert } from 'chai';
import generator from 'uuid';

import {
    decryptJSON,
    connect,
    decrypt,
    encrypt,
    send
} from './index';

describe('iii-client:', () => {
    var uuid = generator.v4();
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
        send(uuid, text, (request) => {
            assert.isObject(request);
            done();
        });
    });
});