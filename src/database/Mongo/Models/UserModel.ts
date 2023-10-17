import mongoose, { Schema, Document } from "mongoose";
import { MongooseID } from "../../../types";

export interface IUser extends Document {
	username: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	profilePicId: {
		type: MongooseID,
		required: false,
	}
}

const userSchema: Schema<IUser> = new Schema<IUser>({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true
	},
	profilePicId: {
		type: Schema.Types.ObjectId,
		required: false,
	}
});

const UserModel = mongoose.model<IUser>("User", userSchema);

export default UserModel;
