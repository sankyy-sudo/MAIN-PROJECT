import { Sequelize } from "sequelize";

const databaseUrl = process.env.DATABASE_URL;

export const sequelize = databaseUrl
  ? new Sequelize(databaseUrl, {
      dialect: "postgres",
      logging: process.env.DB_LOGGING === "true" ? console.log : false
    })
  : new Sequelize(
      process.env.DB_NAME || "crm_platform",
      process.env.DB_USER || "postgres",
      process.env.DB_PASSWORD || "postgres",
      {
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 5432,
        dialect: "postgres",
        logging: process.env.DB_LOGGING === "true" ? console.log : false
      }
    );

export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    await sequelize.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM pg_type WHERE typname = 'enum_users_role'
        ) THEN
          ALTER TYPE "enum_users_role" ADD VALUE IF NOT EXISTS 'CUSTOMER';
        END IF;
      END
      $$;
    `);
    require("./associations");
    await sequelize.sync({
      alter:
        process.env.NODE_ENV === "development" &&
        process.env.DB_SYNC_ALTER === "true"
    });

    console.log("PostgreSQL connected successfully");
  } catch (error) {
    console.error("Database Connection Error:", error);
    process.exit(1);
  }
};
