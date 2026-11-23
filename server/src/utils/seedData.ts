import "dotenv/config";
import mongoose from "mongoose";
import { randomBytes } from "node:crypto";
import Place from "../models/Place";
import { connectDB } from "../config/db";

const samplePlaces = [
  ["Bún chả mẫu 01", "RESTAURANT", "Bún chả"],
  ["Phở bò mẫu 02", "RESTAURANT", "Phở bò"],
  ["Cơm rang mẫu 03", "RESTAURANT", "Cơm rang"],
  ["Bún riêu mẫu 04", "STREET_FOOD", "Bún riêu"],
  ["Bánh mì mẫu 05", "STREET_FOOD", "Bánh mì"],
  ["Cafe mẫu 06", "CAFE", "Cà phê sữa"],
  ["Trà sữa mẫu 07", "CAFE", "Trà sữa"],
  ["Bánh ngọt mẫu 08", "BAKERY", "Bánh kem"],
  ["Bún bò mẫu 09", "RESTAURANT", "Bún bò"],
  ["Xôi mẫu 10", "STREET_FOOD", "Xôi"],
  ["Nem nướng mẫu 11", "RESTAURANT", "Nem nướng"],
  ["Bánh cuốn mẫu 12", "STREET_FOOD", "Bánh cuốn"],
  ["Cafe sách mẫu 13", "CAFE", "Cà phê"],
  ["Lẩu mẫu 14", "RESTAURANT", "Lẩu"],
  ["Bánh bao mẫu 15", "BAKERY", "Bánh bao"],
  ["Chè mẫu 16", "STREET_FOOD", "Chè"],
  ["Mì cay mẫu 17", "RESTAURANT", "Mì cay"],
  ["Sinh tố mẫu 18", "CAFE", "Sinh tố"],
  ["Bánh donut mẫu 19", "BAKERY", "Donut"],
  ["Cơm tấm mẫu 20", "RESTAURANT", "Cơm tấm"],
] as const;

const seedData = async () => {
  try {
    await connectDB();

    // Tạo tài khoản mẫu, không dùng để đăng nhập
    const users = mongoose.connection.collection("users");

    let seedUser = await users.findOne({
      username: "hustfood_seed_owner",
    });

    if (!seedUser) {
      const result = await users.insertOne({
        username: "hustfood_seed_owner",
        email: "seed-owner@hustfood.invalid",
        fullName: "HUST-Food Demo",
        passwordHash: "disabled-" + randomBytes(32).toString("hex"),
        role: "USER",
        status: "BANNED",
        followersCount: 0,
        followingCount: 0,
        postsCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      seedUser = { _id: result.insertedId };
    }

    // Tạo 20 địa điểm giả lập quanh trung tâm Hà Nội
    for (let i = 0; i < samplePlaces.length; i++) {
      const [name, category, dish] = samplePlaces[i];

      const lng = 105.8542 + ((i % 5) - 2) * 0.006;
      const lat = 21.0285 + (Math.floor(i / 5) - 2) * 0.006;

      await Place.updateOne(
        { slug: `seed-demo-${i + 1}` },
        {
          $setOnInsert: {
            name,
            slug: `seed-demo-${i + 1}`,
            category,
            address: `Địa điểm giả lập ${i + 1}, Hà Nội`,
            coverImage: "https://placehold.co/600x400/png?text=HUST-Food",
            images: [],
            priceRange: {
              min: 20000,
              max: 100000,
            },
            openingHours: {
              open: "08:00",
              close: "22:00",
            },
            menu: [
              {
                name: dish,
                price: 45000,
              },
            ],
            location: {
              type: "Point",
              coordinates: [lng, lat],
            },
            createdBy: seedUser._id,
            status: "ACTIVE",
          },
        },
        { upsert: true },
      );
    }

    const count = await Place.countDocuments({
      slug: /^seed-demo-/,
    });

    console.log(`Seed thành công: ${count} quán ăn mẫu`);
  } catch (error) {
    console.error("Seed thất bại:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedData();
