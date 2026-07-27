import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderId: {
  type: String,
  required: true,
  unique: true
},

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        image: String,
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],

    shippingAddress: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },

    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  },
);

// Fixed: Removed 'next' parameter and call since async/await handles resolution automatically
orderSchema.pre("save", async function () {
  if (!this.orderId) {
    const count = await mongoose.model("Order").countDocuments();
    this.orderId = `ORD-${1000 + count + 1}`;
  }
});

export default mongoose.model("Order", orderSchema);
