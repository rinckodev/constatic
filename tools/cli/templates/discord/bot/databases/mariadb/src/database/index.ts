import { env } from "#env";
import ck from "chalk";
import { createPool } from "mariadb";

export const pool = createPool({
    user: env.MARIADB_USER,
    password: env.MARIADB_PASSWORD,
    host: env.MARIADB_HOST,
    port: env.MARIADB_PORT,
    database: env.MARIADB_DATABASE
});

try {
    await pool.getConnection();
    console.log(ck.green("MariaDB database connected!"));
} catch(err) {
    console.error(err);
    process.exit(1);
}