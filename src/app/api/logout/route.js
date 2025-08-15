import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'

export async function POST(req){
    const token = req.cookies.get("token")?.value;

    if(!token){
        return NextResponse.json({success: false, error: "No Token"});
    }

    try {
    const decoded =  jwt.verify(token,"newsfeedapp");
    
    const res = NextResponse.json({success: true, message: " Logout Successfully!"});

    res.cookies.set("token",'',{
        httpOnly: true,
        expires: new Date(0),
        path: "/"
    });

    return res

    } catch (err) {
        return NextResponse.json({success: false, error: err});
    }


    
    

}