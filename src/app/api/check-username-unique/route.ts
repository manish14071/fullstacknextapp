import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { userNameValidation } from "@/schemas/signUpSchema";
import { z } from "zod"


const usernameQuerySchema = z.object({
    username: userNameValidation
})




export async function GET(request: Request) {






    await dbConnect()

    try {
        const { searchParams } = new URL(request.url)
        const queryParam = { username: searchParams.get("username") }

        const result = usernameQuerySchema.safeParse(queryParam)
        console.log(result);//remove later

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0 ? usernameErrors.join(",")
                    : "Invalid query parameter",

            }, { status: 400 })
        }

        const { username } = result.data

        const existingUserVerified = await userModel.findOne({ username, isVerified: true })

        if (existingUserVerified) {
            return Response.json({
                success: false,
                message: "username is already taken"

            }, { status: 400 })
        }
        return Response.json({
            success: true,
            message: "username is unique"

        }, { status: 400 })

    } catch (error) {
        console.error("Error in checking username")
        return Response.json({
            success: false,
            message: "error in checking username"
        }, { status: 500 })
    }

}