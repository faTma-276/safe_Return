import mongoose from "mongoose";

const adminNotifSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      trim: true,
    },
    date: {
      type: String,
      default: () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, "0");
        const day = now.getDate().toString().padStart(2, "0");
        const hour = now.getHours().toString().padStart(2, "0");
        const minute = now.getMinutes().toString().padStart(2, "0");
        return `${year}-${month}-${day} ${hour}:${minute}`;
      },
    },
    reportid: {
      type: String,
    },
    page: {
      type: String,
    },
    table: {
      type: String,
    },
  },
  { timestamps: true }
);

export const adminNotifModel = mongoose.model(
  "adNotification",
  adminNotifSchema
);
