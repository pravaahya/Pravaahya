import mongoose, { Schema, Document } from 'mongoose';

export interface ICollection extends Document {
  name: string;
  description: string;
  image?: string;
  products: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const CollectionSchema: Schema = new Schema({
  name: { 
    type: String, 
    required: [true, "Collection name is required"],
    unique: true,
    trim: true,
  },
  description: { 
    type: String, 
    default: "",
    trim: true
  },
  image: { 
    type: String,
    default: ""
  },
  products: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Product' 
  }]
}, { 
  timestamps: true 
});

export default mongoose.model<ICollection>('Collection', CollectionSchema);
