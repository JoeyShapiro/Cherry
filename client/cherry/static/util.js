/*
* this is just helper functions used by the code
*/

// used to validate the key
const b64Regex = /^[-A-Za-z0-9+/]*={0,3}$/;

// get a cookie from the browser
function getCookie(name) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    
    if (parts.length == 2) {
        return parts.pop().split(";").shift();
    }
}

// set a cookie for the browser
function setCookie(name, val) {
    const date = new Date();
    const value = val;

    // Set it expire in 7 days
    date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));

    // Set it
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
}

// convert an array (encrypted data) to base 64
// this allows for safe transportation across the network (can be sent)
function arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}

// convert a base 64 string to an array (encrypted data)
function base64ToArrayBuffer(base64) {
    var binary_string =  window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

// check if a key is valid
// it must be the proper size and pass the regex
function isValidKey(possibleKey) {
    return possibleKey.length == 43 && b64Regex.test(possibleKey);
}

// validate the key and update the popover
function validateKey() {
    const dummy = document.getElementById("dummy-key");
    const popover = document.getElementById("send-key");

    // store the value
    dummy.value = popover.value;

    return isValidKey(popover.value);
}
