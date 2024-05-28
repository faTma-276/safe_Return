import mongoose from "mongoose";

const missingschema = new mongoose.Schema(
  {
    firstReporterName: {
      type: String,
      minLenth: [2, "name too short"],
      maxLenth: [20, "name too long"],
      trim: true,
      required: true,
    },
    lastReporterName: {
      type: String,
      minLenth: [2, "name too short"],
      maxLenth: [20, "name too long"],
      trim: true,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    nationalID: {
      type: Number,
      required: true,
    },
    governorate: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    email: {
      type: String,
    },
    found: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

missingschema.pre(/^find/, function () {
  this.populate("createdBy", "userName");
});

export const missingmodel = mongoose.model("missing report", missingschema);
