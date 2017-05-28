/**
 * @project iii-client
 * @author Valentin Popov <info@valentineus.link>
 * @license See LICENSE.md file included in this distribution.
 */

var http = require('http');

/**
 * Connects to the server and returns the connection data.
 * @param {String} uuid - The bot UUID.
 * @param {requestCallback} callback - The callback that handles the response.
 */
var connect = function(uuid, callback) {
    uuid = uuid || '';

    if (!_verification(uuid)) {
        throw new Error('The UUID is not a valid value!');
    }

    const query = {
        port: 80,
        hostname: 'iii.ru',
        path: '/api/2.0/json/Chat.init/' + uuid + '/',
        method: 'GET',
    }

    const request = http.request(query, function(response) {
        var json = '';
        response.on('data', (raw) => json = _decryptJSON(raw));
        response.on('end', () => callback(json.result));
    });

    request.on('error', function(error) {
        console.error('Error connecting to the server!\n', error.message);
    });

    request.end();
}

exports.connect = connect;

/**
 * Send a message to the server and return a response.
 * @param {Object} raw - The data to send.
 * @param {String} raw.cuid - Session identifier.
 * @param {String} raw.text - Message text.
 * @param {requestCallback} callback - The callback that handles the response.
 */
var send = function(raw, callback) {
    raw = raw || {};

    const query = {
        port: 80,
        hostname: 'iii.ru',
        path: '/api/2.0/json/Chat.request',
        method: 'POST',
    }

    const data = _createPackage(raw);

    const request = http.request(query, function(response) {
        var json = '';
        response.on('data', (raw) => json = _decryptJSON(raw));
        response.on('end', () => callback(json));
    });

    request.on('error', function(error) {
        console.error('Error sending the package!\n', error.message);
    });

    request.write(data);
    request.end();
}

exports.send = send;

/**
 * Encrypts the incoming data.
 * @param {String} raw - Decrypted data.
 * @returns {String} - Encrypted string.
 */
var _encrypt = function(raw) {
    raw = raw || '';

    var base64 = Buffer.from(raw).toString('base64');
    var string = Buffer.from(base64);
    return _merger(string).toString('base64');
}

exports._encrypt = _encrypt;

/**
 * Decrypts the incoming data.
 * @param {String} raw - Encrypted data.
 * @returns {String} - Decrypted string.
 */
var _decrypt = function(raw) {
    raw = raw || '';

    var string = Buffer.from(raw, 'base64');
    var decrypted = _merger(string).toString();
    return Buffer.from(decrypted, 'base64');
}

exports._decrypt = _decrypt;

/**
 * Decrypts an encrypted JSON object.
 * @param {String} raw - Encrypted data.
 * @returns {Object} - Decrypted JSON.
 */
var _decryptJSON = function(raw) {
    raw = raw || '';

    var string = raw.toString('ascii');
    var data = _decrypt(string);
    return JSON.parse(data);
}

exports._decryptJSON = _decryptJSON;

/**
 * Merge and convert a string.
 * @param {String} raw - The string to convert.
 * @returns {String} - The converted string.
 */
var _merger = function(data) {
    data = data || '';

    const salt = Buffer.from('some very-very long string without any non-latin characters due to different string representations inside of variable programming languages');

    for (var i = 0; i < data.length; i++) {
        data[i] = data[i] ^ salt[i % salt.length];
    }

    return data;
}

exports._merger = _merger;

/**
 * Creates an encrypted package to send.
 * @param {Object} raw - The data to send.
 * @param {String} raw.cuid - Session identifier.
 * @param {String} raw.text - Message text.
 * @returns {String} - Encrypted string.
 */
var _createPackage = function(raw) {
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

exports._createPackage = _createPackage;

/**
 * Validation UUID format string.
 * @param {String} data - The string to check.
 * @returns {Boolean}
 */
var _verification = function(data) {
    data = data || '';
    const regexp = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$', 'i');
    return regexp.test(data);
}

exports._verification = _verification;
