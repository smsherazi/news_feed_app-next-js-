import { ConnectionStr } from "@/dbCon/db";
import { SavedNews } from "@/dbCon/Model/saveNews";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decode = jwt.decode(token);
  const userId = decode?.id;
  mongoose.connect(ConnectionStr);

  const news = await SavedNews.find({userId});

  console.log(news);

  return NextResponse.json({ success: true, result: news });
}

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.redirect(
        new URL("/login?msg=auth_required", req.url)
      );
    }

    const decode = jwt.decode(token);
    const userId = decode?.id;

    if (!userId) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const payload = await req.json();

    const {savedNewsId} = payload;

    const alreadySaved = await SavedNews.findOne({savedNewsId})

    if(alreadySaved){
      return NextResponse.json({success: false, message: "already Saved!"})
    }

    await mongoose.connect(ConnectionStr);

    const savedNews = new SavedNews({
      ...payload,
      userId: userId,
    });

    const result = await savedNews.save();

    return NextResponse.json({ result, success: true });
  } catch (error) {
    console.error("❌ Error in /api/saved_news:", error.message);
    return NextResponse.json(
      { success: false, error: "Something went wrong while saving news." },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  const { savedNewsId } = await req.json();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decode = jwt.decode(token);
  const userId = decode?.id;

  await mongoose.connect(ConnectionStr);
  const deleted = await SavedNews.deleteOne({ savedNewsId, userId });
  return NextResponse.json({ success: deleted.deletedCount > 0 });
}
