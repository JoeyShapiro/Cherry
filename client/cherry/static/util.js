const b64Regex = /^[-A-Za-z0-9+/]*={0,3}$/;

function getCookie(name) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    
    if (parts.length == 2) {
        return parts.pop().split(";").shift();
    }
}

function setCookie(name, val) {
    const date = new Date();
    const value = val;

    // Set it expire in 7 days
    date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));

    // Set it
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
}

function arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}

function base64ToArrayBuffer(base64) {
    var binary_string =  window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

function isValidKey(possibleKey) {
    return possibleKey.length == 43 && b64Regex.test(possibleKey);
}

function validateKey() {
    const dummy = document.getElementById("dummy-key");
    const popover = document.getElementById("send-key");
    const btnsend = document.getElementById("send-btn");

    // store the value
    dummy.value = popover.value;

    return isValidKey(popover.value);
}
