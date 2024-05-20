import mongoose from "mongoose";
import config from "./config";
import User from "./models/User";

const run = async () => {

    await mongoose.connect(config.mongoose.db);
    const db = mongoose.connection;

    await User.create({
        username: 'Swire',
        password: '123',
        token: crypto.randomUUID(),
    }, {
        username: 'Liliweiss',
        password: '123',
        token: crypto.randomUUID(),
    });

    await db.close();
};

run().catch(console.error);