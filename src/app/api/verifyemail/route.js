import { ConnectionStr } from "@/dbCon/db";
import { User } from "@/dbCon/Model/users";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req){
    const {email} = await req.json();

    await mongoose.connect(ConnectionStr);

    const user = await User.findOne({email})
    console.log(user);
    
    if(!user){
        return NextResponse.json({error: "User Not Found!"})
    }


    const response = NextResponse.json({success:true, user: {
        message: "Email Verified!",
        success: true,
        userId: user._id
    }});

    return response;

}