/**
 * @project iii-client
 * @author Valentin Popov <info@valentineus.link>
 * @license See LICENSE.md file included in this distribution.
 */

var http = require('http');

exports.connect = connect;
/**
 * Connects to the server and returns the connection data.
 * @param {String} uuid - The bot UUID.
 * @param {requestCallback} callback - The callback that handles the response.
 */
function connect(uuid, callback) {
    uuid = uuid || '';

    if (!_verification(uuid)) {
        throw new Error('The UUID is not a valid value!');
    }

    const query = {
        port: 80,
        hostname: 'iii.ru',
        path: '/api/2.0/json/Chat.init/' + uuid + '/',
        method: 'GET',
    };

    const request = http.request(query, function(response) {
        var json = '';
        response.on('data', (raw) => json = _decryptJSON(raw));
        response.on('end', () => callback(json.result));
    });

    request.on('error', (error) => Error(error.message));

    request.end();
}

exports.send = send;
/**
 * Send a message to the server and return a response.
 * @param {Object} raw - The data to send.
 * @param {String} raw.cuid - Session identifier.
 * @param {String} raw.text - Message text.
 * @param {requestCallback} callback - The callback that handles the response.
 */
function send(raw, callback) {
    raw = raw || {};

    const query = {
        port: 80,
        hostname: 'iii.ru',
        path: '/api/2.0/json/Chat.request',
        method: 'POST',
    };

    const data = _createPackage(raw);

    const request = http.request(query, function(response) {
        var json = '';
        response.on('data', (raw) => json = _decryptJSON(raw));
        response.on('end', () => callback(json));
    });

    request.on('error', (error) => Error(error));

    request.write(data);
    request.end();
}

exports._encrypt = _encrypt;
/**
 * Encrypts the incoming data.
 * @param {String} raw - Decrypted data.
 * @returns {String} - Encrypted string.
 */
function _encrypt(raw) {
    raw = raw || '';

    var base64 = Buffer.from(raw).toString('base64');
    var string = Buffer.from(base64);
    return _merger(string).toString('base64');
}

exports._decrypt = _decrypt;
/**
 * Decrypts the incoming data.
 * @param {String} raw - Encrypted data.
 * @returns {String} - Decrypted string.
 */
function _decrypt(raw) {
    raw = raw || '';

    var string = Buffer.from(raw, 'base64');
    var decrypted = _merger(string).toString();
    return Buffer.from(decrypted, 'base64');
}

exports._decryptJSON = _decryptJSON;
/**
 * Decrypts an encrypted JSON object.
 * @param {String} raw - Encrypted data.
 * @returns {Object} - Decrypted JSON.
 */
function _decryptJSON(raw) {
    raw = raw || '';

    var string = raw.toString('ascii');
    var data = _decrypt(string);
    return JSON.parse(data);
}

exports._merger = _merger;
/**
 * Merge and convert a string.
 * @param {String} raw - The string to convert.
 * @returns {String} - The converted string.
 */
function _merger(data) {
    data = data || '';

    const salt = Buffer.from('some very-very long string without any non-latin characters due to different string representations inside of variable programming languages');

    for (var i = 0; i < data.length; i++) {
        data[i] = data[i] ^ salt[i % salt.length];
    }

    return data;
}

exports._createPackage = _createPackage;
/**
 * Creates an encrypted package to send.
 * @param {Object} raw - The data to send.
 * @param {String} raw.cuid - Session identifier.
 * @param {String} raw.text - Message text.
 * @returns {String} - Encrypted string.
 */
function _createPackage(raw) {
    raw = raw || {};

    if (!raw.text) {
        throw new Error('There is no data to send!');
    }

    if (!_verification(raw.cuid)) {
        throw new Error('Parameter \'CUID\' is not a valid UUID value!');
    }

    var data = [];
    data.push(raw.cuid);
    data.push(raw.text.toString());

    var json = JSON.stringify(data);
    return _encrypt(json);
}

exports._verification = _verification;
/**
 * Validation UUID format string.
 * @param {String} data - The string to check.
 * @returns {Boolean}
 */
function _verification(data) {
    data = data || '';
    const regexp = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$', 'i');
    return regexp.test(data);
}
