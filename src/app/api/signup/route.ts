import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(req: Request) {
    await dbConnect()

    try {
const {username,email,password}=await req.json()



    } catch (error) {
        console.error("Error registrating user", error)
        return Response.json({
            success: false,
            message: "Error registring user"
        }, {
            status: 500
        })
    }

}