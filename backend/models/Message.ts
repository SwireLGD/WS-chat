import mongoose, { Types } from "mongoose";
import { MessageFields } from "../types";
import User from "./User";

const Schema = mongoose.Schema;

const messageSchema = new Schema<MessageFields>({
    username: {
        type: String,
        required: true,
    },
    content: { 
        type: String, 
        required: true 
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    },
},
{
    versionKey: false,
});

const Message = mongoose.model('Message', messageSchema);

export default Message;