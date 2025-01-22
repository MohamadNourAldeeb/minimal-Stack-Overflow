import mysql2 from "mysql2";
import { Sequelize } from "sequelize";

export let sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect: "mysql",
        dialectModule: mysql2,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT) || 3306,
        define: {
            charset: "utf8mb4",
            collate: "utf8mb4_general_ci",
        },
        logging: false,
        timezone: "+03:00",
        dialectOptions: {
            dateStrings: true,
            typeCast: (field, next) => {
                if (field.type === "DATETIME") {
                    return field.string();
                }
                return next();
            },
        },
    }
);
