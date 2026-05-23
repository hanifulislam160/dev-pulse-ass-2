import app from "./app";
import config from "./config";
import { initDB } from "./db";
const main = () => {
    initDB();
    app.listen(config.port, () => {
        console.log(`Assignment two is running: ${config.port}`);
    });
};
main();
//# sourceMappingURL=server.js.map