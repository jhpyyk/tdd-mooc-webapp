import { Pool } from "pg";

export class DB {
    pool: Pool;

    constructor() {
        if (process.env.POSTGRES_PORT === undefined) {
            throw Error(`POSTGRES_PORT not set ${process.env}`);
        }

        this.pool = new Pool({
            user: process.env.POSTGRES_USER,
            database: process.env.POSTGRES_DB,
            password: process.env.POSTGRES_PASSWORD,
            port: parseInt(process.env.POSTGRES_PORT),
        });
    }

    healthCheck = async () => {
        console.log("Using postgres env variables:");
        console.log(process.env.POSTGRES_USER);
        console.log(process.env.POSTGRES_PORT);

        try {
            await this.pool.query(
                `
            SELECT 1
            `
            );
            console.log("DB connection is healthy");
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };
}
