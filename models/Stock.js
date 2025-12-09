import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true, index: true },
    quantity: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 }, // purchase or sale price per item
    type: { type: String, enum: ['in', 'out'], required: true } // 'in' for purchase, 'out' for sale
  },
  { timestamps: true }
);

export default mongoose.model('Stock', stockSchema);
