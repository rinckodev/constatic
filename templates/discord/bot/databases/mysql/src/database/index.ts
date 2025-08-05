import { logger } from "#base";
import { env } from "#env";
import ck from "chalk";
import { createPool } from "mysql2/promise";

export const pool = createPool({
    user: env.MYSQL_USER,
    password: env.MYSQL_PASSWORD,
    host: env.MYSQL_HOST,
    port: env.MYSQL_PORT,
    database: env.MYSQL_DATABASE
});

try {
    await pool.getConnection();
    logger.success(ck.green("MySQL database connected!"));
} catch(err) {
    logger.error(err);
    process.exit(1);
}