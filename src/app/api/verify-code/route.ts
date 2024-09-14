import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";




export async function POST(request: Request) {
    await dbConnect()

    try {
        const { username, code } = await request.json()
        const decodedUSername = decodeURIComponent(username)
        const user = await userModel.findOne({ username: decodedUSername })


        if (!user) {
            return Response.json({
                success: false,
                message: "user not found"
            }, { status: 500 })

        }
        const isCodeValid = user.verifyCode === code

        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if (isCodeNotExpired && isCodeValid) {
            user.isVerified = true
            await user.save()

            return Response.json({
                success: true,
                message: "Account verified"
            }, { status: 200 })

        }
        else if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "verification code expired please signup again for new code"
            }, { status: 500 })

        }

        else {
            return Response.json({
                success: false,
                message: "verification code is incorrect"
            }, { status: 500 })
        }


    } catch (error) {
        console.error("Error in checking username")
        return Response.json({
            success: false,
            message: "error verifying user"
        }, { status: 500 })
    }

}


