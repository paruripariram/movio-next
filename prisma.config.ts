import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();
import { definePrismaConfig } from "prisma/config";
import { defineConfig as ormConfig } from "@prisma/orm-postgres/config";

export default definePrismaConfig({
    orm: ormConfig({
        contract: "./prisma/schema.prisma",
        db: {
            connection: process.env.DIRECT_URL || process.env.DATABASE_URL,
        },
    }),
});
