import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import mongoose from "mongoose";
import { User } from "next-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";



export async function GET(request: Request) {
    await dbConnect()


    const session = await getServerSession(authOptions)
    const _user: User = session?.user 
    if (!session || !_user) {
        return Response.json({
            success: false,
            message: "not auth"
        }, { status: 401 })

    }

    const userId = new mongoose.Types.ObjectId(_user._id);

    try {

        const user = await userModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }



        ]).exec();

        if (!user || user.length === 0) {
            return Response.json({
                success: false,
                message: "user not found"
            }, { status: 404 })
        }
        return Response.json({
            success: true,
            messages: user[0].messages
        }, { status: 200 })

    } catch (error) {
console.log("unexsptd error occurd",error)
        return Response.json({
            success: false,
            message: "not auth"
        }, { status: 500 })

    }



}