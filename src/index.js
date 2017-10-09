import http from 'http';

/**
 * @param {String} uuid - Bot ID
 * @param {Function} callback - Function handler
 * @description Connection to the service and retrieves the session identifier.
 */
function connect(uuid, callback) {
    if (!isVerification(uuid)) {
        throw new Error('The variable \'uuid\' is not valid.');
    }

    var pkg = createPackage(uuid, null);
    forward(pkg, 'init', callback);
}

/**
 * @param {String} uuid - Session ID
 * @param {String} text - The message you are sending
 * @param {Function} callback - Function handler
 * @description Sends a message to bot and returns a response.
 */
function send(uuid, text, callback) {
    if (!isVerification(uuid)) {
        throw new Error('The variable \'uuid\' is not valid.');
    }

    if (!isString(text)) {
        throw new TypeError('\'text\' is not a string');
    }

    var pkg = createPackage(uuid, text);
    forward(pkg, 'request', callback);
}

/**
 * @param {String} pkg - The package to send
 * @param {String} path - The final delivery address
 * @param {Function} callback - Function handler
 * @description Send the final packet to the server and return the response.
 */
function forward(pkg, path, callback) {
    var query = {
        path: `/api/2.0/json/Chat.${path}`,
        hostname: 'iii.ru',
        method: 'POST',
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

    request.write(pkg);
    request.end();
}

/**
 * @param {String} data - Data for encryption
 * @returns {String} Encrypted data
 * @description Encrypts the received string.
 */
function encrypt(data) {
    var base64 = Buffer.from(data).toString('base64');
    var string = Buffer.from(base64);
    return mergerString(string).toString('base64');
}

/**
 * @param {String} data - Data for decryption
 * @returns {String} Decrypted data
 * @description Decrypts the received string.
 */
function decrypt(data) {
    var string = Buffer.from(data, 'base64');
    var decrypted = mergerString(string).toString();
    return Buffer.from(decrypted, 'base64');
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
    var salt = Buffer.from('some very-very long string without any non-latin characters due to different string representations inside of variable programming languages');

    for (var i = 0; i < data.length; i++) {
        data[i] ^= salt[i % salt.length];
    }

    return data;
}

/**
 * @param {String} uuid - Session ID
 * @param {String} text - Source string
 * @returns {String} Packed request
 * @description Creates a package to send.
 */
function createPackage(uuid, text) {
    var data = [uuid, text];
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
    connect,
    send
};