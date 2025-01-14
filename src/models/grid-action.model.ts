import mongoose, { Document, Schema } from "mongoose";

interface ActionDocument extends Document {
  name: string;
  label: string;
}

const actionSchema: Schema<ActionDocument> = new Schema(
  {
    name: { type: String, required: true, unique: true },
    label: { type: String, required: true },
  },
  { timestamps: true }
);
const GridActionName = "grid-action";

const GridActionModel = mongoose.model<ActionDocument>(
  GridActionName,
  actionSchema
);

export { GridActionModel, ActionDocument, GridActionName };
