<svelte:head>
    <title>Sign In</title>
    <meta name="description" content="About this app" />

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
</svelte:head>

<div class="form-signin w-25 m-auto">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL"
        crossorigin="anonymous"></script>
    
    <script lang="ts" type="module">

        export function setCookie(name: string, val: string) {
            const date = new Date();
            const value = val;

            // Set it expire in 7 days
            date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));

            // Set it
            document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
        }

        export function getCookie(name: string) {
            const value = "; " + document.cookie;
            const parts = value.split("; " + name + "=");
            
            if (parts.length == 2) {
                return parts.pop().split(";").shift();
            }
        }

        // TODO do PageLoad on stuff for it
        window.onload = init;

        function init() {
            const button = document.getElementById("submit");
            button.addEventListener("click", () => {
                console.log('hello')
                login()
            });
        }

        async function sha512(data) {
            var enc = new TextEncoder(); // always utf-8
            const bytes = enc.encode(data)
            console.log(bytes)

            // TODO try to await
            const hash = await window.crypto.subtle.digest(
                {
                    name: "SHA-512",
                },
                new Uint8Array(bytes) //The data you want to hash as an ArrayBuffer
            )
            const hashHex = Array.from(new Uint8Array(hash))
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("");
            
            return hashHex;
            // .then(function(hash){
            //     //returns the hash as an ArrayBuffer

            //     const hashHex = Array.from(new Uint8Array(hash))
            //         .map((b) => b.toString(16).padStart(2, "0"))
            //         .join("");
                
            //     console.log(hashHex)
            //     return hashHex;
            // })
            // .catch(function(err){
            //     console.error(err);
            // });
        }

        async function login() {
            const input_user = document.getElementById("floatingInput");
            const input_pass = document.getElementById("floatingPassword");


            var hash = await sha512(input_pass.value)

            const response = await fetch('/api/login', {
                method: 'POST',
                body: JSON.stringify({ 'username': input_user.value, 'password': hash }),
                headers: {
                    'content-type': 'application/json',
                },
            });
        
            let data = await response.json();
            console.log('return', data)

            setCookie('session_id', data.session_id)
            window.location.href = "http://localhost:8080/";


            return true;
        }

    </script>

    <form id="form" onsubmit="event.preventDefault();"> <!-- action="api/login" -->
        <h1 class="h3 mb-3 fw-normal">Please sign in</h1>
        <div class="form-floating">
            <input
                type="username"
                class="form-control"
                id="floatingInput"
                placeholder="username"
            />
            <label for="floatingInput">Username</label>
        </div>
        <div class="form-floating">
            <input
                type="password"
                class="form-control"
                id="floatingPassword"
                placeholder="Password"
            />
            <label for="floatingPassword">Password</label>
        </div>

        <div class="form-check text-start my-3">
            <input
                class="form-check-input"
                type="checkbox"
                value="remember-me"
                id="flexCheckDefault"
            />
            <label class="form-check-label" for="flexCheckDefault">
                Remember me
            </label>
        </div>
        <button class="btn btn-primary w-100 py-2" type="submit" id="submit">Sign in</button>
    </form>
</div>
