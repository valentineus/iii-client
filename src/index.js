export { connect, send };
import http from 'http';

/**
 * Connects to the server and returns the connection data.
 * @param {String} The bot ID.
 * @promise {Object} Answer from the server.
 * @rejects {Error} If there are errors in operation.
 */
function connect(uuid) {
    return new Promise((resolve, reject) => {
        if (!isVerification(uuid)) reject(new Error('The UUID is not a valid value!'));

        const query = {
            path: '/api/2.0/json/Chat.init/' + uuid,
            hostname: 'iii.ru',
            method: 'GET',
            port: 80,
        };

        const request = http.request(query, (response) => {
            let json = '';
            response.on('data', (raw) => json = decryptJSON(raw));
            response.on('end', () => {
                if (json.error) reject(json.error);
                resolve(json.result);
            });
        });
        request.on('error', (error) => reject(error));
        request.end();
    });
}

/**
 * Send a message to the server and return a response.
 * @param {String} cuid - Session identifier.
 * @param {String} text - Message text.
 * @promise {Object} Answer from the server.
 * @rejects {Error} If there are errors in operation.
 */
function send(cuid, text) {
    return new Promise((resolve, reject) => {
        if (!isVerification(cuid)) reject(new Error('The CUID is not a valid value!'));
        if (!isString(text)) reject(new Error('The parameter is not a string!'));

        const query = {
            path: '/api/2.0/json/Chat.request',
            hostname: 'iii.ru',
            method: 'POST',
            port: 80,
        };

        const request = http.request(query, (response) => {
            let json = '';
            response.on('data', (raw) => json = decryptJSON(raw));
            response.on('end', () => {
                if (json.error) reject(json.error);
                resolve(json.result);
            });
        });
        request.on('error', (error) => reject(error));
        request.write(createPackage(cuid, text));
        request.end();
    });
}

/**
 * Encrypts the incoming data.
 * @param {String} Decrypted data.
 * @returns {String} Encrypted string.
 */
function encrypt(data) {
    const base64 = Buffer.from(data).toString('base64');
    const string = Buffer.from(base64);
    return mergerString(string).toString('base64');
}

/**
 * Decrypts the incoming data.
 * @param {String} Encrypted data.
 * @returns {String} Decrypted string.
 */
function decrypt(data) {
    const string = Buffer.from(data, 'base64');
    const decrypted = mergerString(string).toString();
    return Buffer.from(decrypted, 'base64');
}

/**
 * Decrypts an encrypted JSON object.
 * @param {String} Encrypted data.
 * @returns {Object} Decrypted JSON.
 */
function decryptJSON(json) {
    const string = json.toString('ascii');
    const data = decrypt(string);
    return JSON.parse(data);
}

/**
 * Merge and convert a string.
 * @param {String} The string to convert.
 * @returns {String} The converted string.
 */
function mergerString(data) {
    const salt = Buffer.from('some very-very long string without any non-latin characters due to different string representations inside of variable programming languages');
    return data.map((item, index) => {
        return item ^ salt[index % salt.length];
    });
}

/**
 * Creates an encrypted package to send.
 * @param {String} cuid - Session identifier.
 * @param {String} text - Message text.
 * @returns {String} Encrypted string.
 */
function createPackage(cuid, text) {
    let data = [];
    data.push(cuid);
    data.push(text.toString());
    const json = JSON.stringify(data);
    return encrypt(json);
}

/**
 * Validation UUID format string.
 * @param {String} The string to check.
 * @returns {Boolean}
 */
function isVerification(data) {
    const regexp = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$', 'i');
    return regexp.test(data);
}

/**
 * Determines if a reference is a String.
 * @param {String} The string to check.
 * @returns {Boolean}
 */
function isString(data) {
    return typeof data === 'string';
}