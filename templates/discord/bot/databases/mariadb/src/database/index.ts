import { logger } from "#settings";
import ck from "chalk";
import { createPool } from "mariadb";

export const pool = createPool({
    user: process.env.MARIADB_USER,
    password: process.env.MARIADB_PASSWORD,
    host: process.env.MARIADB_HOST,
    port: process.env.MARIADB_PORT,
    database: process.env.MARIADB_DATABASE
});

try {
    await pool.getConnection();
    logger.success(ck.green("MariaDB database connected!"));
} catch(err) {
    logger.error(err);
    process.exit(1);
}