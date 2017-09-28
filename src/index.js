import http from 'http';

/**
 * @param {String} uuid - Bot ID
 * @param {Function} callback - Function handler
 * @description Connection to the service and retrieves the session identifier.
 */
function connect(uuid, callback) {
    if (!isVerification(uuid)) {
        throw new Error('\'uuid\' invalid variable.');
    }

    var query = {
        path: `/api/2.0/json/Chat.init/${uuid}`,
        hostname: 'iii.ru',
        method: 'GET',
        port: 80
    };

    var request = http.request(query, (response) => {
        var json = null;
        response.on('data', (raw) => {
            json = decryptJSON(raw);
        });
        response.on('end', () => {
            callback(json);
        });
    });
    request.on('error', (error) => {
        callback(error);
    });
    request.end();
}

/**
 * @param {String} cuid - Session ID
 * @param {String} text - Send messages
 * @param {Function} callback - Function handler
 * @description Sends a message to bot and returns a response.
 */
function send(cuid, text, callback) {
    if (!isVerification(cuid)) {
        throw new Error('\'cuid\' invalid variable.');
    }

    if (!isString(text)) {
        throw new Error('\'text\' invalid variable.');
    }

    var query = {
        path: '/api/2.0/json/Chat.request',
        hostname: 'iii.ru',
        method: 'POST',
        port: 80,
    };

    var request = http.request(query, (response) => {
        var json = null;
        response.on('data', (raw) => {
            json = decryptJSON(raw);
        });
        response.on('end', () => {
            callback(json.result);
        });
    });
    request.on('error', (error) => {
        callback(error);
    });
    request.write(createPackage(cuid, text));
    request.end();
}

/**
 * @param {String} data - Data for encryption
 * @returns {String} Encrypted data
 * @description Encrypts the received string.
 */
function encrypt(data) {
    var base64 = new Buffer(data).toString('base64');
    var string = new Buffer(base64);
    return mergerString(string).toString('base64');
}

/**
 * @param {String} data - Data for decryption
 * @returns {String} Decrypted data
 * @description Decrypts the received string.
 */
function decrypt(data) {
    var string = new Buffer(data, 'base64');
    var decrypted = mergerString(string).toString();
    return new Buffer(decrypted, 'base64');
}

/**
 * @param {String} json - Encrypted object
 * @returns {Object} Decrypted object
 * @description Decrypts the received object.
 */
function decryptJSON(json) {
    var string = json.toString('ascii');
    var data = decrypt(string);
    return JSON.parse(data);
}

/**
 * @param {String} data - Source string
 * @returns {String} Combined string
 * @description Merges the source string.
 */
function mergerString(data) {
    var salt = new Buffer('some very-very long string without any non-latin characters due to different string representations inside of variable programming languages');
    return data.map((item, index) => {
        return item ^ salt[index % salt.length];
    });
}

/**
 * @param {String} cuid - Session ID
 * @param {String} text - Source string
 * @returns {String} Packed request
 * @description Creates a package to send.
 */
function createPackage(cuid, text) {
    var data = [];
    data.push(cuid);
    data.push(text.toString());
    var json = JSON.stringify(data);
    return encrypt(json);
}

/**
 * @param {String} value - Variable to check
 * @returns {Boolean} Result of checking
 * @description Checks the type of the variable.
 */
function isVerification(value) {
    var regexp = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$', 'i');
    return regexp.test(value);
}

/**
 * @param {String} value - Variable to check
 * @returns {Boolean} Result of checking
 * @description Checks the type of the variable.
 */
function isString(value) {
    return typeof value === 'string';
}

export {
    isVerification,
    decryptJSON,
    connect,
    decrypt,
    encrypt,
    send
};