import { Pool } from "pg";

export class DB {
    pool: Pool;

    constructor() {
        if (process.env.DATABASE_URL === undefined) {
            throw Error(`DATABASE_URL not set ${process.env}`);
        }

        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
        });
    }

    healthCheck = async () => {
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
