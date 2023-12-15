/*
* this is the meat of the project
* it handles the encryption and decryption of messages
*/

async function encMessage(key, text) {
    // create the key
    let crypto_key = await window.crypto.subtle.importKey(
        "jwk", //can be "jwk" or "raw"
        {   //this is an example jwk key, "raw" would be an ArrayBuffer
            kty: "oct",
            k: key,
            alg: "A256CBC",
            ext: true,
        },
        {   //this is the algorithm options
            name: "AES-CBC",
        },
        false, //whether the key is extractable (i.e. can be used in exportKey)
        ["encrypt", "decrypt"] //can be "encrypt", "decrypt", "wrapKey", or "unwrapKey"
    )

    // encrypt the message
    const encoded = new TextEncoder().encode(text)
    let encrypted = await window.crypto.subtle.encrypt(
        {
            name: "AES-CBC",
            //Don't re-use initialization vectors!
            //Always generate a new iv every time your encrypt!
            iv: new Uint8Array(16),
        },
        crypto_key, //from generateKey or importKey above
        encoded //ArrayBuffer of data you want to encrypt
    )

    return encrypted
}

// decrypt the message
async function decMessage(key, cipher) {
    // create the key object
    const crypto_key = await window.crypto.subtle.importKey(
        "jwk", //can be "jwk" or "raw"
        {   //this is an example jwk key, "raw" would be an ArrayBuffer
            kty: "oct",
            k: key,
            alg: "A256CBC",
            ext: true,
        },
        {   //this is the algorithm options
            name: "AES-CBC",
        },
        false, //whether the key is extractable (i.e. can be used in exportKey)
        ["encrypt", "decrypt"] //can be "encrypt", "decrypt", "wrapKey", or "unwrapKey"
    )

    // decrypt the message
    let decrypted = "";
    decrypted = await window.crypto.subtle.decrypt(
        {
            name: "AES-CBC",
            iv: new Uint8Array(16), //The initialization vector you used to encrypt
        },
        crypto_key, //from generateKey or importKey above
        cipher //ArrayBuffer of the data
    ).catch(e => {
        // cant decrypt, but good enouth
        console.log("Error", e.stack);
        console.log("Error", e.name);
        console.log("Error", e.message);
    });

    // encode to utf 8
    const dec = new TextDecoder("utf-8");
    const text = dec.decode(decrypted);

    return text
}