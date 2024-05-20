import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import config from './config';
import usersRouter from './routers/users';
import expressWs from 'express-ws';
import auth from './middleware/auth';
import chatRouter from './routers/chat';

const app = express();
expressWs(app);

const port = 8000;
app.use(cors());
app.use(express.json());

app.use('/users', usersRouter);
app.use('/chat', auth, chatRouter);

const run = async () => {
    await mongoose.connect(config.mongoose.db);

    app.listen(port, () => {
        console.log(`Port: ${port}`);
    });

    process.on('exit', () => {
        mongoose.disconnect();
    });
};

void run();