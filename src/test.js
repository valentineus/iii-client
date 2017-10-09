import { assert } from 'chai';
import generator from 'uuid';

import {
    connect,
    send
} from './index';

describe('iii-client:', () => {
    var uuid = generator.v4();
    var text = 'Hello, World!';

    it('connect()', (done) => {
        connect(uuid, (request) => {
            assert.isObject(request);
            done();
        });
    });

    it('send()', (done) => {
        send(uuid, text, (request) => {
            assert.isObject(request);
            done();
        });
    });
});