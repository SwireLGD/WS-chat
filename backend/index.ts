import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import config from './config';
import usersRouter from './routers/users';
import expressWs from 'express-ws';
import { ActiveConnections, UserProp } from './types';
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
                const user: UserProp = parsedMessage.payload;
                if (!user._id) {
                    console.log('user is missing');
                    ws.close();
                    return;
                }

                if (!activeConnections[user._id]) {
                    activeConnections[user._id] = ws;
                    updateParticipants();
                }

                try {
                    const messages = await Message.find({}).sort({ timestamp: -1 }).limit(30).exec();
                    ws.send(JSON.stringify({ type: 'INITIAL_MESSAGES', payload: messages.reverse() }));
                } catch (error) {
                    console.error('Failed to fetch messages: ', error);
                }

                ws.on('close', () => {
                    console.log('WebSocket connection closed for user:', user._id);
                    delete activeConnections[user._id];
                    updateParticipants();
                });
                break;
                case 'SEND_MESSAGE':
                    const { username, content } = parsedMessage.payload;
                    const newMessage = new Message({
                        username: String(username),
                        content: String(content),
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

const updateParticipants = () => {
    const participants = Object.keys(activeConnections);
    Object.values(activeConnections).forEach(connection => {
        connection.send(JSON.stringify({ type: 'PARTICIPANTS_UPDATE', payload: participants }));
    });
};

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