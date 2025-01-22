import cors from "cors";
import dotenv from "dotenv";

dotenv.config({ path: `./.env` });

const corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};

export default (app) => {
    app.use(cors(corsOptions));

    app.options("*", (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header(
            "Access-Control-Allow-Methods",
            "GET, POST, PUT, DELETE, OPTIONS"
        );
        res.header(
            "Access-Control-Allow-Headers",
            "Content-Type, Authorization"
        );
        res.send(204); // No Content
    });

    app.use((req, res, next) => {
        if (req.method === "OPTIONS") {
            res.status(204).send();
        } else {
            next();
        }
    });
};
