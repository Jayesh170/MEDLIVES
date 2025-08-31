import mongoose from "mongoose";

const CounterSchema = new mongoose.Schema({
  _id: String,
  seq: { type: Number, default: 100 } // start from 100 if you want
});

export default mongoose.model("Counter", CounterSchema);
