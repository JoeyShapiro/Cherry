import { mysqlconnFn } from "$lib/db/mysql";

async function getMessages(users: any) {
    let mysqlconn = await mysqlconnFn();
    try {
        // do all the fancy in sql
        let results = await mysqlconn
            .query("SELECT message, username, time FROM messages inner join users u on messages.user_id = u.id;")
        // .then(function ([rows, fields]) {
        //   console.log(rows);
        // });

        return results[0]
    } catch (error) {
        console.error("Got an error!!!");
        console.log(error);
        return error;
    }
}

async function getUsers() {
    let mysqlconn = await mysqlconnFn();
    try {
        let results = await mysqlconn
            .query("SELECT id, username time FROM messages;")
        // .then(function ([rows, fields]) {
        //   console.log(rows);
        // });

        return results[0]
    } catch (error) {
        console.error("Got an error!!!");
        console.log(error);
        return error;
    }
}

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
    console.log('hello from server load')

    let users = await getUsers();
    let messages = await getMessages(users);

    return {
        get: {
            messages
        }
    };
}