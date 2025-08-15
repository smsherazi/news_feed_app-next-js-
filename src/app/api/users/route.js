import { ConnectionStr } from "@/dbCon/db";
import { User } from "@/dbCon/Model/users";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req){
    const {name, email , password} = await req.json();

    await mongoose.connect(ConnectionStr);

    const existingEmail = await User.findOne({email});

    if(existingEmail){
        return NextResponse.json({error: "Email Already Exits"} , {status: 400});
    }

    const hashPass = await bcrypt.hash(password,10);

    const newUser = new User({
        name,
        email,
        password: hashPass
    })

    await newUser.save();

    return NextResponse.json({success: true,message: "SignUp Successfully!"},{status: 200})
}