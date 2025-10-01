import { ConnectionStr } from "@/dbCon/db";
import { SavedNews } from "@/dbCon/Model/saveNews";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const country = searchParams.get("country") || "";

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decode = jwt.decode(token);
  const userId = decode?.id;

  await mongoose.connect(ConnectionStr);

  const filter = { userId };
  if (q) filter.title = { $regex: q, $options: "i" };
  if (country) filter.country = country;

  const news = await SavedNews.find(filter).lean();

  const formatted = news.map(item => ({
    ...item,
    id: item.savedNewsId,
    saved: true
  }));

  return NextResponse.json({ success: true, result: formatted });
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

    const {savedNewsId} = payload;

    await mongoose.connect(ConnectionStr);

    const alreadySaved = await SavedNews.findOne({savedNewsId, userId})

    if(alreadySaved){
      return NextResponse.json({success: false, message: "already Saved!"})
    }

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

  // delete all duplicates with same savedNewsId for this user
  const deleted = await SavedNews.deleteMany({ savedNewsId, userId });

  return NextResponse.json({ success: deleted.deletedCount > 0 });
}

