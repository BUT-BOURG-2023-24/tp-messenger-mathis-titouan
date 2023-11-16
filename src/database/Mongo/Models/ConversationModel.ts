import mongoose, { Schema, Document } from "mongoose";
import { MongooseID } from "../../../types";
import {IUser} from "./UserModel";
import {IMessage} from "./MessageModel";

export interface IConversation extends Document {
	participants: {
		type: IUser[],
		required: true,
	},
	messages: {
		type: IMessage[],
		required: true,
	},
	title: {
		type: String,
		required: false,
	},
	lastUpdate: {
		type: Date,
		required: true,
	},
	seen: {
		[userId: string]: MongooseID,
	};
}

const conversationSchema: Schema<IConversation> = new Schema<IConversation>({
	participants: {
		type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
		require: true,
	},
	messages: {
		type: [{ type : Schema.Types.ObjectId, ref : 'Message' }],
		require: true,
	},
	title: {
		type: String,
		require: false,
	},
	lastUpdate: {
		type: Date,
		require: true,
	},
	seen: {
		type: Schema.Types.Mixed,
		require: true,
		default: {}
	}
});

const ConversationModel = mongoose.model<IConversation>("Conversation", conversationSchema);

export default ConversationModel;