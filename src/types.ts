import type { db } from "$model"
import type { InferAttributes } from "sequelize"

export type Variables = {
    user: InferAttributes<db.User>
    user_db: db.User
}