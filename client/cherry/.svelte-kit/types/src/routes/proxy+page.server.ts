// @ts-nocheck
import { mysqlconnFn } from "$lib/db/mysql";

/** @param {Parameters<import('./$types').PageServerLoad>[0]} event */
export async function load({ params }) {
  console.log('hello from server load')

  let mysqlconn = await mysqlconnFn();
  try {
    let results = await mysqlconn
      .query("SELECT message, user_id, time FROM messages;")
      // .then(function ([rows, fields]) {
      //   console.log(rows);
      // });

    console.log(results[0])
    return {
      get: results[0]
    };
  } catch (error) {
    console.error("Got an error!!!");
    console.log(error);
    return error;
  }
}