import { ConnectionStr } from "@/dbCon/db";
import { User } from "@/dbCon/Model/users";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

export async function POST(req){
    const {email, password} = await req.json();

    await mongoose.connect(ConnectionStr);

    const user = await User.findOne({email})
    console.log(user);
    
    if(!user){
        return NextResponse.json({error: "User Not Found!"})
    }
    const passMatch = await bcrypt.compare(password,user.password)

    if(!passMatch){
        return NextResponse.json({error:"Invalid Credentials!"},{status: 401})
    }

    const token =  jwt.sign({
        id: user._id
    },"newsfeedapp",{expiresIn: '1d'})



    const response = NextResponse.json({success:true, user: {
        message: "Logged In Successfully!",
        success: true,
        loggedIn: true
    }});

    const expireTime = new Date(Date.now() + 24 * 60 * 60 * 1000);

    response.cookies.set("token",token,{
        httpOnly: true,
        expires: expireTime
    });

    return response;

}