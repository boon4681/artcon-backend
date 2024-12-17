import { sequelize } from "./db.js"
import * as db from "./models/index.js"

const init = async () => {
    await sequelize.sync(
        
    )
    for (const model of Object.keys(db)) {
        if ((db as any)[model].create_default) {
            await (db as any)[model].create_default()
        }
    }
}

export { sequelize, db, init }