import { json } from '@sveltejs/kit'; import type { RequestHandler } from './$types';
// import * as crypto from "crypto";

export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json();
    console.log('POST', data)

    // const hash = crypto.createHash("sha512");
    //         hash.update(data.password);
    //         const digest = hash.digest("hex");
    //         console.log(digest)

    return json(data);
};
