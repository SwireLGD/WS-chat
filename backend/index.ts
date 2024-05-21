import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import config from './config';
import usersRouter from './routers/users';
import expressWs from 'express-ws';
import { ActiveConnections } from './types';
import { RequestWithUser } from './middleware/auth';
import Message from './models/Message';

const app = express();
expressWs(app);

const port = 8000;
app.use(cors());
app.use(express.json());

const chatRouter = express.Router();

const activeConnections: ActiveConnections = {};

chatRouter.ws('/chat', (ws, req: RequestWithUser) => {
    ws.on('message', async (message: string) => {
        const parsedMessage = JSON.parse(message);
        switch (parsedMessage.type) {
            case 'LOGIN':
                const userId = parsedMessage.payload?._id;
                if (!userId) {
                    console.log('userId missing');
                    ws.close();
                    return;
                }

                console.log('WebSocket connection opened for user:', userId);

                if (!activeConnections[userId]) {
                    activeConnections[userId] = ws;
                }

                try {
                    const messages = await Message.find({}).sort({ timestamp: -1 }).limit(30).exec();
                    ws.send(JSON.stringify({ type: 'INITIAL_MESSAGES', payload: messages.reverse() }));
                } catch (error) {
                    console.error('Failed to fetch messages: ', error);
                }

                ws.on('close', () => {
                    console.log('WebSocket connection closed for user:', userId);
                    delete activeConnections[userId];
                });
                break;
            case 'SEND_MESSAGE':
                const newMessage = new Message({
                    sender: req.user?.username,
                    content: parsedMessage.payload,
                });
                try {
                    await newMessage.save();
                    Object.values(activeConnections).forEach(connection => {
                        connection.send(JSON.stringify({ type: 'NEW_MESSAGE', payload: newMessage }));
                    });
                } catch (e) {
                    console.error('Error saving message:', e);
                    ws.send(JSON.stringify({ type: 'ERROR', payload: 'Failed to save the message' }));
                    return;
                }
                break;
            default:
                console.log('Unknown message type:', parsedMessage.type);
        }
    });
});

app.use(chatRouter);
app.use('/users', usersRouter);

const run = async () => {
    await mongoose.connect(config.mongoose.db);

    app.listen(port, () => {
        console.log(`Server listening on port: ${port}`);
    });

    process.on('exit', () => {
        mongoose.disconnect();
    });
};

void run();