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

    if (!isVerification(uuid)) {
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
        response.on('data', (raw) => json = decryptJSON(raw));
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

    const data = createPackage(raw);

    const request = http.request(query, function(response) {
        var json = '';
        response.on('data', (raw) => json = decryptJSON(raw));
        response.on('end', () => callback(json.result));
    });

    request.on('error', (error) => Error(error));

    request.write(data);
    request.end();
}

exports.encrypt = encrypt;
/**
 * Encrypts the incoming data.
 * @param {String} raw - Decrypted data.
 * @returns {String} - Encrypted string.
 */
function encrypt(raw) {
    raw = raw || '';

    var base64 = Buffer.from(raw).toString('base64');
    var string = Buffer.from(base64);
    return mergerString(string).toString('base64');
}

exports.decrypt = decrypt;
/**
 * Decrypts the incoming data.
 * @param {String} raw - Encrypted data.
 * @returns {String} - Decrypted string.
 */
function decrypt(raw) {
    raw = raw || '';

    var string = Buffer.from(raw, 'base64');
    var decrypted = mergerString(string).toString();
    return Buffer.from(decrypted, 'base64');
}

exports.decryptJSON = decryptJSON;
/**
 * Decrypts an encrypted JSON object.
 * @param {String} raw - Encrypted data.
 * @returns {Object} - Decrypted JSON.
 */
function decryptJSON(raw) {
    raw = raw || '';

    var string = raw.toString('ascii');
    var data = decrypt(string);
    return JSON.parse(data);
}

exports.mergerString = mergerString;
/**
 * Merge and convert a string.
 * @param {String} raw - The string to convert.
 * @returns {String} - The converted string.
 */
function mergerString(data) {
    data = data || '';

    const salt = Buffer.from('some very-very long string without any non-latin characters due to different string representations inside of variable programming languages');

    for (var i = 0; i < data.length; i++) {
        data[i] = data[i] ^ salt[i % salt.length];
    }

    return data;
}

exports.createPackage = createPackage;
/**
 * Creates an encrypted package to send.
 * @param {Object} raw - The data to send.
 * @param {String} raw.cuid - Session identifier.
 * @param {String} raw.text - Message text.
 * @returns {String} - Encrypted string.
 */
function createPackage(raw) {
    raw = raw || {};

    if (!raw.text) {
        throw new Error('There is no data to send!');
    }

    if (!isVerification(raw.cuid)) {
        throw new Error('Parameter \'CUID\' is not a valid UUID value!');
    }

    var data = [];
    data.push(raw.cuid);
    data.push(raw.text.toString());

    var json = JSON.stringify(data);
    return encrypt(json);
}

exports.isVerification = isVerification;
/**
 * Validation UUID format string.
 * @param {String} data - The string to check.
 * @returns {Boolean}
 */
function isVerification(data) {
    data = data || '';
    const regexp = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$', 'i');
    return regexp.test(data);
}
