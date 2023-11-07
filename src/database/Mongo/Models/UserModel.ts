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
		type: String,
		required: true,
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
		required: true,
	},
	profilePicId: {
		type: String,
		required: true,
	}
}, {
	collection: 'users' // Spécifiez le nom de la collection ici
});

const UserModel = mongoose.model<IUser>("User", userSchema);

export default UserModel;
