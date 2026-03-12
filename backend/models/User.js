import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    provider: {
      type: String,
      default: "google",
    },

    displayName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      index: true,
    },

    avatar: {
      type: String,
      default: null,
    },

    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toPublicProfile = function () {
  return {
    id: this._id,
    displayName: this.displayName,
    email: this.email,
    avatar: this.avatar,
    provider: this.provider,
    memberSince: this.createdAt,
    lastLogin: this.lastLogin,
  };
};

const User = mongoose.model("User", userSchema);

export default User;