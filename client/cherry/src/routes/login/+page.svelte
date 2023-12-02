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
    
    <script lang="ts">
        // TODO do PageLoad on stuff for it
        window.onload = init;

        function init() {
            const button = document.getElementById("submit");
            button.addEventListener("click", () => {
                console.log('hello')
            });
        }

        async function getMessages() {
            let a = 1
            let b = 2
        }

        async function login() {
            const input_user = document.getElementById("floatingInput");
            const input_pass = document.getElementById("floatingPassword");

            const response = await fetch('/api/login', {
                method: 'POST',
                body: JSON.stringify({ 'username': input_user.value, 'password': input_pass.value }),
                headers: {
                    'content-type': 'application/json',
                },
            });
        
            let total = await response.json();
            console.log('return', total)

            return true;
        }

    </script>

    <form id="form" onsubmit="event.preventDefault(); return login();"> <!-- action="api/login" -->
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
