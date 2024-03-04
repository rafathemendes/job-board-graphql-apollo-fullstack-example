import knex from "knex";

export const connection = knex({
  client: "better-sqlite3",
  connection: {
    filename: "./data/db.sqlite3",
  },
  useNullAsDefault: true,
});

// Uncomment to log all queries
// connection.on("query", ({ sql, bindings }) => {
//   const query = connection.raw(sql, bindings).toQuery();
//   console.log(`[DB]: ${query}`);
// });
