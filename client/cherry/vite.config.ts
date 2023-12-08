import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
// import fs from 'fs';

export default defineConfig({
	plugins: [sveltekit()],
	// server: {
    //     https: {
    //         key: fs.readFileSync(`/var/www/certs/key.pem`), //${__dirname}
    //         cert: fs.readFileSync(`/var/www/certs/cert.pem`)
    //     }
    // }
});
