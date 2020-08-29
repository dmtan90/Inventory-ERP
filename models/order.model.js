const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    account: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
    cart: {
      type: Object,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    lat: { type: String, required: true },
    lng: { type: String, required: true },
    paymentId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'Pending',
      enum: [
        'Pending',
        'Processing',
        'Pickedup',
        'In_Transit',
        'Delivered',
        'Declined',
        'Cancel',
      ],
    },
    store: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
    date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const OrderModel = mongoose.model('Order', orderSchema);
