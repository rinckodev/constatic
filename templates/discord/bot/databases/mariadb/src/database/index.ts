import { logger } from "#base";
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
    logger.success(ck.green("MariaDB database connected!"));
} catch(err) {
    logger.error(err);
    process.exit(1);
}