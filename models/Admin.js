import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
  {
    name: String,

    email: {
      type: String,
      unique: true,
      required: true,
    },

    password: {
      type: String,
      select: false,
      required: true,
    },

    city: {
      type: mongoose.Schema.ObjectId,
      ref: "City",
    },

    role: {
      type: String,
      enum: ["admin", "master"],
      default: "admin",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

//  hash password
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

export const Admin = mongoose.model("Admin", adminSchema);
