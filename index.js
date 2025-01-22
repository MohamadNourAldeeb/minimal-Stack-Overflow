import app from "./app.js";
import { sequelize } from "./utils/connect.js";
import { WelcomeLog } from "./utils/helper.js";
import { getAllInRedis } from "./utils/redis_cache.js";

app.listen(process.env.PORT, async () => {
    // await createRelations();

    // getAllInRedis();

    WelcomeLog();
    console.log(
        `Listening at http://${process.env.DOMAIN}:${process.env.PORT} ✅ , Mode : ${process.env.NODE_ENV}`
    );
});
// ! Create Relation between tables
let createRelations = async () => {
    let all = await import("./models/index.js");
    sequelize
        .sync({ force: true })
        .then(async () => {
            console.log("successfully created relationships with tables ✅✅");
        })
        .catch((err) => {
            console.log(err);
        });
};
