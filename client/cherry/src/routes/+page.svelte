<script lang="ts">
	/** @type {import('./$types').PageData} */
	export let data: any;
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
</svelte:head>

<section>
    <script src="https://code.jquery.com/jquery-3.7.1.js"
        integrity="sha256-eKhayi8LEQwp4NKxN+CfCh+3qOVUtJn3QNZ0TciWLP4="
        crossorigin="anonymous"></script> <!-- ugh -->
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL"
        crossorigin="anonymous"></script>
    
    <style>
        .popover{
            max-width: 100%; /* Max Width of the popover (depending on the container!) */
            width: 30rem;
        }
    </style>
    
    <script lang="ts" type="module">
        const b64Regex = /^[-A-Za-z0-9+/]*={0,3}$/;
        
        window.onload = init;

        function init() {
            // check for login first
            if (getCookie("session_id") == null) {
                window.location.href = `${window.location.origin}/login`;
            }

            const btnsend = document.getElementById("send-btn");
            const btnSendListener = document.getElementById("send-btn-listener");
            const textbox = document.getElementById("send-text");
            const keybtn = document.getElementById("send-pop-key");
            const dummy = document.getElementById("dummy-key");

            btnsend.addEventListener("click", () => {
                send()
            });
            btnsend.disabled = true;
            btnSendListener.addEventListener("mouseover", () => {
                // check the text box
                if (textbox.value.length == 0) {
                    textbox.classList.add("is-invalid");
                } else {
                    textbox.classList.remove("is-invalid");
                }

                // check the key, best way for now. but should have parameters
                if (isValidKey(dummy.value)) {
                    keybtn.classList.remove("btn-outline-danger");
                } else {
                    keybtn.classList.add("btn-outline-danger");
                }
            })
            btnSendListener.addEventListener("mouseout", () => {
                // remove them
                textbox.classList.remove("is-invalid");
                keybtn.classList.remove("btn-outline-danger");
            })

            const buttonuse = document.getElementById("send-use");
            buttonuse.addEventListener("click", () => {
                useKey()
            });

            const popover = new bootstrap.Popover('#send-pop-key', {
                container: 'body',
                html: true,
                sanitize: false,
                content: showElement(document.getElementById("popover-key"))
            })

            $("#send-pop-key").on('hide.bs.popover', () => {
                const saved = validateKey()
                // cant prevent hide, but this is next best
                if (!saved) {
                    const keybtn = document.getElementById("send-pop-key");
                    keybtn.classList.add("btn-outline-danger");
                    window.setTimeout(() => {
                        keybtn.classList.remove("btn-outline-danger");
                    }, 250);
                }
            })

            textbox.addEventListener('input', () => {
                btnsend.disabled = textbox.value.length == 0;
            });

            keepPolling()
            scrollToBottom()
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

        function showElement(element) {
            const shown = element.cloneNode(true);
            shown.style.display = 'block';
            shown.lastElementChild.id = "send-key"

            return shown
        }

        function randomEffect(element) {
            const original = element.querySelector('#original').textContent
            const text = element.querySelector('.toast-body').textContent

            for (let i = 0; i < original.length+1; i++) {
                setTimeout(() => {
                    element.querySelector('.toast-body').textContent = revealText(text, original.length - i)
                }, i * 70) // is this right
            }
        }

        function revealText(text, i) {
            const randomized = randomizeText(i);
            let revealed = "";
            for (let j = 0; j < i; j++) {
                revealed += randomized[j];
            }
            for (let j = revealed.length; j < text.length; j++) {
                revealed += text[j];
            }

            return revealed
        }

        // TODO could do basic text, but this is cooler
        function randomizeText(length) {
            const characterCollection = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            let randomized = "";
            for(var i = 0; i < length; i++)
			{
				randomized += characterCollection[ Math.floor( Math.random() * characterCollection.length ) ];
			}

            return randomized;
        }

        async function encMessage(key, text) {
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

            var enc = new TextEncoder();
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

        async function decMessage(key, cipher) {
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

            const decrypted = await window.crypto.subtle.decrypt(
                {
                    name: "AES-CBC",
                    iv: new Uint8Array(16), //The initialization vector you used to encrypt
                },
                crypto_key, //from generateKey or importKey above
                cipher //ArrayBuffer of the data
            )

            const dec = new TextDecoder("utf-8");
            const text = dec.decode(decrypted);

            return text
        }

        async function keepPolling() {
            while (true) {
                console.log('polling')
                await pollMessages()
            }
        }

        // TODO stop recreating text decoder
        async function addMessage(data) {
            const key = document.getElementById("dummy-key").value
            console.log(data.username, getCookie('username'), data.username == getCookie('username'))
            const cipher = base64ToArrayBuffer(data.message)
            console.log('cipher', cipher)
            const text = await decMessage(key, cipher)
            console.log('text', text)
            // oh clever, wait how does hidden work
            const html = `
            <div class="toast fade show m-2 w-50" role="alert" aria-live="assertive" aria-atomic="true">
						<div class="toast-header">
							<strong class="mr-auto m-1" style=${data.username == getCookie('username') ? "\"color: red\"" : "\"\""}>${data.username}</strong>
							<small id="date" class="text-muted">${data.time}</small>
						</div>
                        <div id="original" hidden>${text}</div>
						<div class="toast-body">
							${text}
						</div>
					</div>
            `

            const chatbox = document.getElementById('chatbox')

            // Change this to div.childNodes to support multiple top-level nodes.
            chatbox.insertAdjacentHTML( 'beforeend', html );
            console.log('added')

            // convert to fancy
            randomEffect(chatbox.lastElementChild)
        }

        export function getCookie(name: string) {
            const value = "; " + document.cookie;
            const parts = value.split("; " + name + "=");
            
            if (parts.length == 2) {
                return parts.pop().split(";").shift();
            }
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

        async function send() {
            const key = document.getElementById("dummy-key").value
            const text = document.getElementById("send-text").value
            document.getElementById("send-text").value = ""

            console.log(key, text)
            const cipher = await encMessage(key, text)

            const response = await fetch('/api/messages', {
                method: 'POST',
                body: JSON.stringify({ text: arrayBufferToBase64(cipher), 'session': getCookie('session_id') }),
                headers: {
                    'content-type': 'application/json',
                },
            });
        
            let data = await response.json()
            console.log('return', data)
        }

        // will send a request, and the server will respond when a message is added
        async function pollMessages() {
            // this works
            const chatbox = document.getElementById('chatbox')
            const date_box = chatbox.lastElementChild;
            const last_date = date_box !== null ? date_box.querySelector('#date').textContent : (new Date).toISOString();

            const response = await fetch(`/api/messages?last_date=${last_date}`, {
                method: 'GET',
                setTimeout: 0
            });
        
            let data = await response.json();
            
            await addMessage(data[0])
            scrollToBottom()
        }

        function scrollToBottom() {
            var chatbox = document.getElementById('chatbox');
            
            if (chatbox.lastElementChild !== null) {
                // Scroll to the bottom with smooth animation
                chatbox.lastElementChild.scrollIntoView({ behavior: 'smooth' });
            }
        }

        async function useKey() {
            const key = document.getElementById("dummy-key").value
            const chatbox = document.getElementById('chatbox')

            // cool, but why so many fors
            for (const chatmsg of chatbox.children) {
                console.log(chatmsg)
                console.log(chatmsg.querySelector('#original').textContent)
                try {
                    const cipher = base64ToArrayBuffer(chatmsg.querySelector('#original').textContent)
                    // TODO create id
                    chatmsg.querySelector('.toast-body').textContent = await decMessage(key, cipher)
                    randomEffect(chatmsg)
                } catch (error) {
                    console.log(error)
                }
            }
        }
    </script>
	
	<main class="d-flex flex-column vh-100">
        <!-- nav bar -->
        <header class="p-3 text-bg-dark w-100">
            <div class="container">
                <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                    <a href="/" class="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
                        <svg class="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap">
                            <use xlink:href="#bootstrap"></use>
                        </svg>
                    </a>

                    <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                        <li><a href="#" class="nav-link px-2 text-secondary">Home</a></li>
                        <li><a href="#" class="nav-link px-2 text-white">Features</a></li>
                        <li><a href="#" class="nav-link px-2 text-white">About</a></li>
                    </ul>

                    <form class="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search">
                        <input type="search" class="form-control form-control-dark" placeholder="Search..."
                            aria-label="Search">
                    </form>

                    <div class="text-end">
                        <a type="button" class="btn btn-outline-light me-2" href="login">Login</a>
                        <button type="button" class="btn btn-warning">Sign-up</button>
                    </div>
                </div>
            </div>
        </header>

        <div class="d-flex flex-row flex-fill overflow-hidden">
            <!-- sidbar -->
            <div class="d-flex flex-column flex-shrink-0 p-3 bg-body-tertiary flex-fill" style="max-width: 280px;">
                <a href="/"
                    class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
                    <svg class="bi pe-none me-2" width="40" height="32">
                        <use xlink:href="#bootstrap"></use>
                    </svg>
                    <span class="fs-4">Users</span>
                </a>
                <hr>
                <ul class="nav nav-pills flex-column mb-auto">
                    {#each data.get.users as user}
                    <li class="nav-item">
                        <a href="#" class="nav-link {user.username == data.get.user.username ? "active" : ""}" aria-current="page"> <!-- active makes it blue -->
                            <svg class="bi pe-none me-2" width="16" height="16">
                                <use xlink:href="#home"></use>
                            </svg>
                            {user.username}
                        </a>
                    </li>
                    {/each}
                </ul>
                <hr>
                <div class="dropdown">
                    <a href="#"
                        class="d-flex align-items-center link-body-emphasis text-decoration-none dropdown-toggle"
                        data-bs-toggle="dropdown" aria-expanded="false">
                        <img src="{data.get.user.pfp}" alt="" width="32" height="32" class="rounded-circle me-2">
                        <strong>{data.get.user.username}</strong>
                    </a>
                    <ul class="dropdown-menu text-small shadow">
                        <li><a class="dropdown-item" href="#">New project...</a></li>
                        <li><a class="dropdown-item" href="#">Settings</a></li>
                        <li><a class="dropdown-item" href="#">Profile</a></li>
                        <li>
                            <hr class="dropdown-divider">
                        </li>
                        <li><a class="dropdown-item" href="#">Sign out</a></li>
                    </ul>
                </div>
            </div>

            <!-- chat and input -->
            <div id="chat" class="d-flex flex-column flex-fill">
                <!-- chat -->
                <div id="chatbox" class="d-flex flex-column flex-fill overflow-auto">
                    {#each data.get.messages as message}
                        <div class="toast fade show m-2 w-50" role="alert" aria-live="assertive" aria-atomic="true">
                            <div class="toast-header">
                                <!-- <svg class="bd-placeholder-img rounded mr-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img"><rect fill="#007aff" width="100%" height="100%"></rect></svg> -->
                                <strong class="mr-auto m-1" style={message.username == data.get.user.username ? "color: red" : ""}>{message.username}</strong>
                                <small id="date" class="text-muted">{message.time}</small>
                            </div>
                            <div id="original" hidden>{message.message}</div>
                            <div class="toast-body">
                                {message.message}
                            </div>
                        </div>
                    {/each}
                </div>

                <!-- input dialog -->
                <div class="input-group mb-3">
                    <div class="popover-content d-flex" id="popover-key" style="display: none!important;">
                        <input type="text" class="form-control font-monospace" aria-label="Sizing example input" id="dummy-key"
                            aria-describedby="inputGroup-sizing-default" placeholder="Key (Base 64)" value="Y0zt37HgOx-BY7SQjYVmrqhPkO44Ii2Jcb9yydUDPfE"> <!-- TODO debug -->
                    </div>
                    <button type="button" class="btn btn-lg btn-outline-primary" id="send-pop-key" data-placement="top"
                        data-bs-toggle="popover" data-bs-title="Key" data-bs-content="#popover-key">Key</button>
                    <button style="width: auto;" class="btn btn-outline-secondary" type="button"
                        id="send-use">Use</button>
                    <input type="text" style="width: auto;" class="form-control" aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-default" placeholder="Message" id="send-text">
                    <div id="send-btn-listener">
                        <button style="width: auto; height: 100%;" class="btn btn-primary" type="button"
                            id="send-btn">Send</button>
                    </div>
                </div>
            </div>
        </div>
    </main>
</section>
