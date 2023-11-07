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
		required: false,
	}
}

const conversationSchema: Schema<IConversation> = new Schema<IConversation>({
	participants: {
		type: [Schema.Types.ObjectId],
		require: true,
	},
	messages: {
		type: [Schema.Types.ObjectId],
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
		type: Schema.Types.ObjectId,
		require: false,
	}
});

const ConversationModel = mongoose.model<IConversation>("Conversation", conversationSchema);

export default ConversationModel;