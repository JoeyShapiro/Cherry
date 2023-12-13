import { json } from '@sveltejs/kit'; import type { RequestHandler } from './$types';
import { mysqlconnFn } from "$lib/db/mysql";

export const GET: RequestHandler = async ({ request, url }) => {
    const data: string = url.searchParams.get('last_date') || '';
    console.log('/api/messages GET:', data)

    // Create a new Date object from the input string
    const inputDate = new Date(data);

    // Convert to MySQL DATETIME format
    const mysqlDatetime = inputDate.toISOString().slice(0, 19).replace('T', ' ');
    console.log(mysqlDatetime)

    let mysqlconn = await mysqlconnFn();
    try {
        var results = null
        while (results == null || results[0].length == 0) {
            results = await mysqlconn
                .execute('select message, username, time from messages inner join users u on messages.user_id = u.id where time > ?', [ mysqlDatetime ])
            setTimeout(() => {}, 0.2);
        }

        console.log(results[0])
        return json( results[0] );
    } catch (error) {
        console.error("Got an error!!!");
        console.log(error);
    }

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
