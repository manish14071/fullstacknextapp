import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import userModel from "@/model/User";
import { User } from "next-auth";
import dbConnect from "@/lib/dbConnect";


export async function POST(request: Request) {
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "not auth"
        }, { status: 401 })

    }

    const UserId = user._id;
    const { acceptMessages } = await request.json()

    try {
        const updatedUser = await userModel.findByIdAndUpdate(UserId, { isAcceptingMessage: acceptMessages }, { new: true })

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "failed to update status to accpt msgsr"
            }, { status: 401 })



        }
        else {
            return Response.json({
                success: true,
                message: "mesgs status updated succesfully"
            }, { status: 201 })
        }

    } catch (error) {
        console.log("failed to update user status to accept msgs")

        return Response.json({
            success: false,
            message: "failed to updat euser"
        }, { status: 500 })


    }



}


export async function GET(request: Request) {
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "not auth"
        }, { status: 401 })

    }

    const UserId = user._id;

    try {
        const foundUser = await userModel.findById(UserId)

        if (!foundUser) {
            return Response.json({
                success: false,
                message: "user not found"
            }, { status: 404 })

        }

        return Response.json({
            success: true,
            isAcceptingMessages: foundUser.isAcceptingMessage
        }, { status: 200 })


    } catch (error) {
        console.log("failed to update user status to accept msgs")

        return Response.json({
            success: false,
            message: "error in getting mesgs acptng status"
        }, { status: 500 })




    }
}