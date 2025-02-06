import { log } from "#settings";
import ck from "chalk";
import { createPool } from "mysql2/promise";

export const pool = createPool({
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    database: process.env.MYSQL_DATABASE
});

try {
    await pool.getConnection();
    log.success(ck.green("MySQL database connected!"));
} catch(err) {
    log.error(err);
    process.exit(1);
}