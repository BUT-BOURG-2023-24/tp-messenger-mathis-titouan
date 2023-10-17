import mongoose, { Schema, Document } from "mongoose";
import { MongooseID } from "../../../types";

export interface IConversation extends Document {
	participants: {
		type: MongooseID[],
		required: true,
	},
	messages: {
		type: MongooseID[],
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
		type: MongooseID,
		required: true,
	}
}

const conversationSchema: Schema<IConversation> = new Schema<IConversation>({
	participants: {
		type: [Schema.Types.ObjectId],
		required: true,
	},
	messages: {
		type: [Schema.Types.ObjectId],
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
		type: Schema.Types.ObjectId,
		required: true,
	}
});

const ConversationModel = mongoose.model<IConversation>("Conversation", conversationSchema);

export default ConversationModel;