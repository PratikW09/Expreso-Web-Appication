import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";

// 1️⃣ Define an Interface for User
interface IUser extends Document {
  username: string;
  email: string;
  fullName: string;
  contact: string;
  password: string;
  refreshToken?: string; // Optional field
  createdAt?: Date;
  updatedAt?: Date;
  comparePassword: (enteredPassword: string) => Promise<boolean>; // Password comparison method
}

// 2️⃣ Define User Schema
const userSchema: Schema<IUser> = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Invalid email format"], // Email validation
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      index: true,
    },
    contact: {
      type: String,
      required: [true, "Contact number is required"],
      unique: true,
      trim: true,
      match: [/^\d{10}$/, "Invalid contact number"], // Ensures only 10-digit numbers
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    refreshToken: {
      type: String,
      default: null, // Optional field
    },
  },
  {
    timestamps: true, // Automatically adds createdAt & updatedAt
    versionKey: false, // Removes __v field
  }
);

// 3️⃣ Pre-Save Middleware to Hash Password with Error Handling
userSchema.pre<IUser>("save", async function (next) {
  try {
    if (!this.isModified("password")) return next(); // Run only if password is modified

    const salt = await bcrypt.genSalt(10); // Generate a salt
    this.password = await bcrypt.hash(this.password, salt); // Hash password
    next();
  } catch (error) {
    const err = error as Error;
    console.error("Error hashing password:", err.message);
    next(new Error("Error hashing password"));
  }
});

// 4️⃣ Method to Compare Passwords with Error Handling
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    const err = error as Error;
    console.error("Error comparing password:", err.message);
    throw new Error("Password comparison failed");
  }
};

// 5️⃣ Create a Model
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
export { IUser };
