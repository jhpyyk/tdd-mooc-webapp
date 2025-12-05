import { Pool } from "pg";

export class DB {
    pool: Pool;

    constructor() {
        const isTest = process.env.TEST === "true";
        const dbUrl = isTest
            ? process.env.TEST_DATABASE_URL
            : process.env.DEV_DATABASE_URL;
        if (dbUrl === undefined) {
            throw Error(
                `DEV_DATABASE_URL nor TEST_DATABASE_URL is set ${process.env}`
            );
        }

        this.pool = new Pool({
            connectionString: dbUrl,
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
