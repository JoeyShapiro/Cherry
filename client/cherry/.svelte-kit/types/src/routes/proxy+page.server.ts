// @ts-nocheck
import { mysqlconnFn } from "$lib/db/mysql";

async function getUsers() {
    let mysqlconn = await mysqlconnFn();
    try {
        let results = await mysqlconn
            .query("SELECT id, username, session FROM users ORDER BY username;")

        return results[0]
    } catch (error) {
        console.error("Got an error!!!");
        console.log(error);
        return error;
    }
}

/** @param {Parameters<import('./$types').PageServerLoad>[0]} event */
export async function load({ params, cookies }) {
    console.log('hello from server load')

    let messages: never[] = [];
    let users = await getUsers();

    let session_id = cookies.get('session_id') || null

    let user = users.find((user: { session: string; }) => user.session == session_id) || { session: "" };

    return {
        get: {
            messages,
            users,
            user
        }
    };
}