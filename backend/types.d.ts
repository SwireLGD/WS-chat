import {WebSocket} from 'ws';

export interface UserFields {
    username: string;
    password: string;
    token: string;
}
  
interface UserMethods {
    checkPassword(password: string): Promise<boolean>;
    generateToken(): void;
}
  
export type UserModel = Model<UserFields, unknown, UserMethods>;

export interface MessageFields {
    userId: Types.ObjectId;
    username: string;
    content: string;
    timestamp: Date;
}

export interface ActiveConnections {
    [id: string]: WebSocket  
}

export interface IncomingMessage {
    type: string;
    payload: string;
}

export interface UserProp {
    _id: string;
    username: string;
    token: string;
}

export interface MessagePayload {
    userId: string;
    username: string;
    content: string;
}