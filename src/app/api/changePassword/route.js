import { ConnectionStr } from '@/dbCon/db';
import { User } from '@/dbCon/Model/users';
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import bcrypt from "bcryptjs";

export async function PUT(req) {
    const {oldPassword, password} = await req.json();

    const token = req.cookies.get("token")?.value;

    const decoded = jwt.verify(token,"newsfeedapp");

    const tId = decoded.id;



    try {
        await mongoose.connect(ConnectionStr);
        const user = await User.findById(tId);
        if(!user){
        return NextResponse.json({success: false, message: "User Not Found!"})
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if(!isMatch){
            return NextResponse.json({success: false, message: "Old Password is Incorrect"})
        }

        const hashNewPassword = await bcrypt.hash(password, 10);

        user.password = hashNewPassword;

        await user.save();

        return NextResponse.json({success: true, message: "New Password Updated!"})
        
    } catch (error) {
        return NextResponse.json({success: false, message: "Internal Error" + error});      
    }
}