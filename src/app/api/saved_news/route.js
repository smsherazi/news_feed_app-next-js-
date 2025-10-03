import { ConnectionStr } from "@/dbCon/db";
import { SavedNews } from "@/dbCon/Model/saveNews";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decode = jwt.decode(token);
    const userId = decode?.id;

    if (!userId) {
      return NextResponse.json({ success: false, result: [] });
    }

    await mongoose.connect(ConnectionStr);

    // ✅ Bas user ke saved news nikal lo
    const news = await SavedNews.find({ userId }).lean();

    const formatted = news.map(item => ({
      ...item,
      id: item.savedNewsId,
      saved: true,
    }));

    return NextResponse.json({ success: true, result: formatted });
  } catch (err) {
    console.error("❌ Error in GET /api/saved_news:", err);
    return NextResponse.json({ success: false, result: [] });
  }
}

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.redirect(
        new URL("/login", req.url)
      );
    }

    const decode = jwt.decode(token);
    const userId = decode?.id;

    if (!userId) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const payload = await req.json();
    console.log(payload);
    

    const {savedNewsId} = payload;

    await mongoose.connect(ConnectionStr);

    const alreadySaved = await SavedNews.findOne({savedNewsId, userId})

    if(alreadySaved){
      return NextResponse.json({success: false, message: "already Saved!"})
    }

    const savedNews = new SavedNews({
      ...payload,
      userId: userId,
      country: payload.country || "pakistan"
    });

    const result = await savedNews.save();
    console.log(result);
    

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

  // delete all duplicates with same savedNewsId for this user
  const deleted = await SavedNews.deleteMany({ savedNewsId, userId });

  return NextResponse.json({ success: deleted.deletedCount > 0 });
}

