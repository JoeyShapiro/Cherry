# ITS551 Project
Cherry
The pit is like a secret

## NOTE
can view all messages but they enc unless you have the proper key
could try grape in python, see how far i got and how fast in python. no time, also need it in https
lets just do a website. no more comps. 
could start with refreshing, but maybe do webhooks
apparently they use https

could have just done login, but this is more fun

npm dont need it

this isnt worth the effort though
just do a simple db thing. can store forever, who cares
https://www.captaincodeman.com/re-creating-the-sveltekit-session-store

i guess i shouldnt do foreach svelte stuff
how can i only do some stuff on the client
i think i have it divided decently now

https://www.highgo.ca/2019/08/08/the-difference-in-five-modes-in-the-aes-encryption-algorithm/
gonna use CBC, because i feel like i heard of it

// TODO how can i make custom key. must be 256 bits, or 32 bytes. i think
// TODO implement date check. use current if nothing
// TODO user implements valid b65, then try padding just 0s, then try padding 0 before b64, then try user enters actual key, even though cant really
// TODO use export to create a key. actually, i dont care

```js
// more like an example of bad ASI
// how would a ; fix this
// Example of ASI introducing unexpected behavior
function foo() {
    return
    {
        value: 42
    };
}

console.log(foo()); // undefined, not { value: 42 }

```

oh, iv can always be the same

oh, im enc wrong
echo -n W29iamVjdCBBcnJheUJ1ZmZlcl0= | base64 -d
cant decrypt it
special b64

vite https no work. oh well. they just toss in folder
should i really be storing certs in cherry. should be in client or even main
this way is now fine
new certs are generated, but that is fine
could use mkcert, but would need it on host. meh

how will use type in actual bytes
hex is dumb, and a lot of work

i guess its a column
i htink this makes more sense

ok this is good. yes i got it
this way is right. dont want to modify stuff
or get something
using that one. whatever i want to use
maybe should use key in thibng. or just store whatever, even if wrong
no, just dnt close
dhoulfny validatd all the time. gets annoying. only at end
should i save it or not. should i reset. maybe ask

oh its getting from the message. i thought i added it
i will fix it, must be messing up the times
oh, its a proxy error. nginx is doing the timeout
just remove cause, play with it. dont need it. looks bad

best way. for color, that works
its faster. otherwise have to change all values live

want to limit but dont. do it on the front end
its their problem

how could i get debug vs prod in docker

i guess i can do fancy CSR svelte for stuff, but cant figure out how
https://svelte.dev/docs/client-side-component-api
next time
i just want it working
this works, so its fine

## TODO
- [x] basic site
- [x] https
- [x] database
  - [x] users
  - [x] messages
- [x] login
  - [x] username (counts as **plain** data)
  - [x] password (sha512 not secret)
- [x] client send encrypted data
  - [x] no modify or delete
  - [x] can help with next steps
  - [x] just submit text that gets encrypted
  - [x] start with symmectric
- [x] server send encrypted messages
  - [x] they get all of them
  - [x] client has refresh button
- [x] client decryptds
  - [x] just type the key in the chat
  - [x] only messages with right key will be decrypted properly
- [x] test multiple users
- [ ] use webhooks
- [x] comment and remove logs
- [x] update ui
  - [x] proper login buttons
    - [x] signout button
  - [x] change sidebar
    - [x] users?
  - [x] bottom left thing
    - [x] dont know what to show
  - [x] fix secret
    - [x] show whole key
    - [x] maybe click to reveal in popup
    - [x] if valid secret
      - [x] auto decrypt
      - [x] show animation
      - [x] when valid
      - [x] display errors when not valid
- [x] check valid login
- [ ] properly use headers
- [x] seperate functions in files
- [x] break apart error checking for key
- [x] proper profile pics
- [x] add dummy messages
- [x] check if can proper start from nothing
  - [x] where are errors *mysql*\
- [ ] pad key
  - [ ] try to show in ui
- [x] how to manage no key
- [ ] move common scripts to header
- [ ] change localhost in src to svelte thing
- [x] what happens if it cant decrypt
  - [ ] print proper garbage
- [ ] stop recreating text decoder
- [ ] timeout seems safer
  - [ ] but say "nothing happened, try again"
- [ ] reset session on bad session
