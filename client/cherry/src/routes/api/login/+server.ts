import { json } from '@sveltejs/kit'; import type { RequestHandler } from './$types';
import { mysqlconnFn } from "$lib/db/mysql";
import { v4 as uuidv4 } from "uuid";
// import * as crypto from "crypto";

export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json();
    console.log('POST', data)

    // const hash = crypto.createHash("sha512");
    //         hash.update(data.password);
    //         const digest = hash.digest("hex");
    //         console.log(digest)

        let mysqlconn = await mysqlconnFn();
        try {
            let results = await mysqlconn
                .query(`SELECT id, username FROM users where username='${data.username}' and password='${data.password}';`)

            if (results[0].length == 0) {
                return json({'error': 'User not found'});
            }

            let session_id = uuidv4()
            await mysqlconn.execute('update users set session = ? where id = ?', [ session_id, results[0][0].id ])

            return json({'session_id': session_id});
        } catch (error) {
            console.error("Got an error!!!");
            console.log(error);
        }
};
