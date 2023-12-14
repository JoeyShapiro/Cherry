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

    <script src="https://localhost/crypto.js" lang="js"></script>
    <script src="https://localhost/design.js" lang="js"></script>
    <script src="https://localhost/util.js" lang="js"></script>

    <script lang="ts" type="module">
        var theme = getCookie("theme");
        
        window.onload = init;

        function init() {
            // check for login first
            // this should deal with bad login data
            const session = getCookie("session_id")
            if (session == null || session == "") {
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

            const btn_logout = document.getElementById("btn-logout");
            btn_logout.addEventListener("click", () => {
                setCookie('session_id', "");
                setCookie('username', "");
                window.location.href = `${window.location.origin}/`;
            });

            // theme
            const btn_theme = document.getElementById("btn-theme");
            btn_theme.addEventListener("click", () => {
                theme = theme == "dark" ? "light" : "dark";
                setCookie("theme", theme);

                setTheme(theme);
            });
            setTheme(theme);

            keepPolling()
            scrollToBottom()
        }

        async function keepPolling() {
            while (true) {
                console.log('polling')
                await pollMessages()
            }
        }

        // TODO stop recreating text decoder
        async function addMessage(data) {
            const key = document.getElementById("dummy-key").value;

            // would like to do this a math way, but this is good enough
            let text = data.message;
            if (data.is_private) {
                const cipher = base64ToArrayBuffer(data.message);
                text = await decMessage(key, cipher);
            }
            
            // oh clever, wait how does hidden work
            const html = `
            <div class="toast fade show m-2 w-50" role="alert" aria-live="assertive" aria-atomic="true">
						<div class="toast-header">
							<strong class="mr-auto m-1" style=${data.username == getCookie('username') ? "\"color: red\"" : "\"\""}>${data.username}</strong>
							<small id="date" class="text-muted">${data.time}</small>
						</div>
                        <div id="original" hidden>${text}</div>
						<div class="toast-body text-body">
							${text}
						</div>
					</div>
            `

            const chatbox = document.getElementById('chatbox')

            // Change this to div.childNodes to support multiple top-level nodes.
            chatbox.insertAdjacentHTML( 'beforeend', html );
            const date_box = chatbox.lastElementChild;
            setCookie("last_date", date_box.querySelector('#date').textContent);

            // convert to fancy
            randomEffect(chatbox.lastElementChild)
        }

        async function send() {
            const key = document.getElementById("dummy-key").value
            const text = document.getElementById("send-text").value
            document.getElementById("send-text").value = ""

            const cipher = await encMessage(key, text)

            const response = await fetch('/api/messages', {
                method: 'POST',
                body: JSON.stringify({ text: arrayBufferToBase64(cipher), 'session': getCookie('session_id') }),
                headers: {
                    'content-type': 'application/json',
                },
            });
        
            let data = await response.json()
        }

        // will send a request, and the server will respond when a message is added
        async function pollMessages() {
            // this works
            const last = getCookie("last_date");
            const last_date = last != null ? last : (new Date(0)).toISOString()

            const response = await fetch(`/api/messages?last_date=${last_date}`, {
                method: 'GET',
                setTimeout: 0
            });
        
            let data = await response.json();
            
            for (const message of data) {
                await addMessage(message);
            }
            scrollToBottom()
        }

        async function useKey() {
            const key = document.getElementById("dummy-key").value
            const chatbox = document.getElementById('chatbox')

            // cool, but why so many fors
            for (const chatmsg of chatbox.children) {
                try {
                    const cipher = base64ToArrayBuffer(chatmsg.querySelector('#original').textContent)
                    chatmsg.querySelector('.toast-body').textContent = await decMessage(key, cipher)
                    randomEffect(chatmsg)
                } catch (error) {
                    console.log(error)
                }
            }
        }
    </script>
	
	<main id="mdiv" class="d-flex flex-column vh-100">
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
                        <li><button class="dropdown-item" id="btn-theme">Theme</button></li>
                        <li><a class="dropdown-item" href="#">Profile</a></li>
                        <li>
                            <hr class="dropdown-divider">
                        </li>
                        <li><button class="dropdown-item" id="btn-logout">Logout</button></li>
                    </ul>
                </div>
            </div>

            <!-- chat and input -->
            <div id="chat" class="d-flex flex-column flex-fill bg-gradient">
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
                            <div class="toast-body text-body">
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
