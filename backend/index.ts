import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import config from './config';
import usersRouter from './routers/users';
import expressWs from 'express-ws';
import { ActiveConnections } from './types';
import { WebSocket } from 'ws';
import auth, { RequestWithUser } from './middleware/auth';
import Message from './models/Message';

const app = express();
expressWs(app);

const port = 8000;
app.use(cors());
app.use(express.json());

app.use('/users', usersRouter);

const chatRouter = express.Router();

const activeConnections: ActiveConnections = {};

chatRouter.ws('/chat', (ws: WebSocket, req: RequestWithUser) => {
    const userId = req.user?._id.toString();

    if (!userId) {
        ws.close();
        return;
    }

    activeConnections[userId] = ws;

    Message.find({})
        .sort({ timestamp: -1 })
        .limit(30)
        .exec()
        .then((messages) => {
            ws.send(JSON.stringify({ type: 'INITIAL_MESSAGES', payload: messages.reverse() }));
        })
        .catch((error) => {
            console.error('Failed to fetch messages: ', error);
        });

    ws.on('message', async (message: string) => {
        const parsedMessage = JSON.parse(message);
        switch (parsedMessage.type) {
            case 'SEND_MESSAGE':
                const newMessage = new Message({
                    sender: req.user?._id,
                    content: parsedMessage.payload,
                    timestamp: new Date(),
                });
                
                try {
                    await newMessage.save();
                } catch (e) {
                    console.error('Failed to save the message: ', e);
                    return;
                }

                Object.values(activeConnections).forEach((connection) => {
                    connection.send(JSON.stringify({type: 'NEW_MESSAGE', payload: newMessage}));
                });
                break;
            default:
                console.log('Unknown message type:', parsedMessage.type);
                
        }
    });

    ws.on('close', () => {
        console.log('client disconnected! id=', userId);
        delete activeConnections[userId];
    });
});

app.use(auth, chatRouter);

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