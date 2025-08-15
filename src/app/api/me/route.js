import { ConnectionStr } from "@/dbCon/db";
import { User } from "@/dbCon/Model/users";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json(
      { success: false, error: "No token" },
      { status: 401 }
    );
  }
  const decoded = jwt.verify(token, "newsfeedapp");

  const tId = decoded.id;

  try {
    mongoose.connect(ConnectionStr);
    const user = await User.findById(tId);
    return NextResponse.json({ success: true, user });
  } catch (err) {
    NextResponse.json({
      success: false,
      error: "Inavlid Token" + err,
    });
  }
}
export async function PUT(req) {
  const { name, email } = await req.json();
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json(
      { success: false, error: "No token" },
      { status: 401 }
    );
  }
  const decoded = jwt.verify(token, "newsfeedapp");

  const tId = decoded.id;

  try {
    await mongoose.connect(ConnectionStr);
    const user = await User.findById(tId);
    if(!user){
      return NextResponse.json({success:false, message:"User Not Found!"});
    }

    user.email = email;
    user.name = name;

    await user.save();

    return NextResponse.json({success: true, message: "User Updated Sucessfully!"});

  } catch (error) {
    return NextResponse.json({success: false , message: "Internal Error" + error});
  }
}
