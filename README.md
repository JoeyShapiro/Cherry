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

## TODO
- [ ] debug vs prod
- [ ] basic site
- [ ] https
- [ ] database
  - [ ] users
  - [ ] messages
- [ ] login
  - [ ] username (counts as **plain** data)
  - [ ] password (sha512 not secret)
- [ ] client send encrypted data
  - [ ] no modify or delete
  - [ ] can help with next steps
  - [ ] just submit text that gets encrypted
  - [ ] start with symmectric
- [ ] server send encrypted messages
  - [ ] they get all of them
  - [ ] client has refresh button
- [ ] client decryptds
  - [ ] just type the key in the chat
  - [ ] only messages with right key will be decrypted properly
- [ ] test multiple users
- [ ] use webhooks