import { json } from '@sveltejs/kit'; import type { RequestHandler } from './$types';
import { mysqlconnFn } from "$lib/db/mysql";
import { v4 as uuidv4 } from "uuid";

export const GET: RequestHandler = async ({ request }) => {
    const data = await request.json();
    console.log('/api/messages GET:', data)

    return json({})
}

export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json();
    console.log('/api/messages POST:', data)

    let mysqlconn = await mysqlconnFn();
    try {
        await mysqlconn
            .execute('insert into messages (message, user_id) select ?, users.id from users where users.session = ?',
                [ data.text, data.session ])

        return json({'success': true});
    } catch (error) {
        console.error("Got an error!!!");
        console.log(error);
    }
};
