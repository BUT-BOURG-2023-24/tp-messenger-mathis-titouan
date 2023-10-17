import mongoose, { Schema, Document } from "mongoose";
import { MongooseID } from "../../../types";

export interface IMessage extends Document {
	conversationId: {
		type: MongooseID,
		required: true,
	},
	from: {
		type: MongooseID,
		ref: "User",
		required: true,
	},
	content: {
		type: String,
		required: true,
	},
	postedAt: {
		type: Date,
		required: true,
	},
	replyTo: {
		type: MongooseID,
		required: false,
	},
	edited: {
		type: Boolean,
		required: true,
	},
	deleted: {
		type: Boolean,
		required: true,
	},
	reactions: {
		[userId: string]: 'HAPPY' | 'SAD' | 'THUMBSUP' | 'THUMBSDOWN' | 'LOVE',
	},	
}

const MessageSchema: Schema<IMessage> = new Schema<IMessage>({
	conversationId: {
		type: Schema.Types.ObjectId,
		required: true,
	},
	from: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	content: {
		type: String,
		required: true,
	},
	postedAt: {
		type: Date,
		required: true,
	},
	replyTo: {
		type: Schema.Types.ObjectId,
		required: false,
	},
	edited: {
		type: Boolean,
		required: true,
	},
	deleted: {
		type: Boolean,
		required: true,
	},
	reactions: {
		type: Object,
		required: true,
	}
});

const MessageModel = mongoose.model<IMessage>("Message", MessageSchema);

export { MessageModel, MessageSchema };
