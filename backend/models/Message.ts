import mongoose, { Types } from "mongoose";
import { MessageFields } from "../types";
import User from "./User";

const Schema = mongoose.Schema;

const messageSchema = new Schema<MessageFields>({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        validate: {
            validator: async (id: Types.ObjectId) => {
              const user = await User.findById(id);
              return Boolean(user);
            },
            message: 'User does not exist!',
        },
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