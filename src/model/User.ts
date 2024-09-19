import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date
}


const MessageSchema: Schema<Message> = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})


export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isAcceptingMessage: boolean;
    isVerified: boolean;
    messages: Message[]
}


const UserSchema: Schema<User> = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        match: [/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/, "please use a valid email address"]

    },
    password: {
        type: String,
        required: [true, "password is required"],

    },
    verifyCode: {
        type: String,
        required: [true, "verifycode is required"],

    },

    verifyCodeExpiry: {
        type: Date,
        required: [true, "verifycodeexpiry is required"],

    },
    isVerified: {
        type: Boolean,
        default: false

    },
    isAcceptingMessage: {
        type: Boolean,
        default: true

    },
    messages: [MessageSchema]



})




const userModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default userModel;