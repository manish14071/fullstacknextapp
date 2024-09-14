import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(req: Request) {
    await dbConnect()

    try {
        const { username, email, password } = await req.json()

        const existingUserverifiedByUserName = await userModel.findOne({
            username,
            isVerified: true
        })

        if (existingUserverifiedByUserName) {
            return Response.json({
                success: false,
                message: "Username already exist"
            }, { status: 400 })

        }


        const existingUserverifiedByEmail = await userModel.findOne({
            email
        })
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()


        if (existingUserverifiedByEmail) {
            if (existingUserverifiedByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already exist with this email"

                }, { status: 400 })

            } else {
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserverifiedByEmail.password = hashedPassword;
                existingUserverifiedByEmail.verifyCode = verifyCode;
                existingUserverifiedByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserverifiedByEmail.save()
            }

        } else {

            const hashPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)
            const newUser = new userModel({
                username,
                email,
                password: hashPassword,
                verifyCode: verifyCode,
                verifyCodeExpiry: expiryDate,
                isAcceptingMessage: true,
                isVerified: false,
                messages: []
            })
            await newUser.save()
        }

        const emailResponse = await sendVerificationEmail(email, username, verifyCode)

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message

            }, { status: 500 })

        }

        return Response.json({
            success: true,
            message: "user registered succesfully . please very your email"

        }, { status: 201 })


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