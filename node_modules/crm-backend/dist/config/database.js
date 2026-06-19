"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const databaseUrl = process.env.DATABASE_URL;
exports.sequelize = databaseUrl
    ? new sequelize_1.Sequelize(databaseUrl, {
        dialect: "postgres",
        logging: process.env.DB_LOGGING === "true" ? console.log : false
    })
    : new sequelize_1.Sequelize(process.env.DB_NAME || "crm_platform", process.env.DB_USER || "postgres", process.env.DB_PASSWORD || "postgres", {
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 5432,
        dialect: "postgres",
        logging: process.env.DB_LOGGING === "true" ? console.log : false
    });
const connectDB = async () => {
    try {
        await exports.sequelize.authenticate();
        require("./associations");
        await exports.sequelize.sync({
            alter: process.env.NODE_ENV === "development" &&
                process.env.DB_SYNC_ALTER === "true"
        });
        console.log("PostgreSQL connected successfully");
    }
    catch (error) {
        console.error("Database Connection Error:", error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
