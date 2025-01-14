import mongoose, { Document, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { UserModelName } from "./user.model";
import { GridActionName } from "./grid-action.model";

interface GridDocument extends Document {
  user: Schema.Types.ObjectId | string;
  name: string;
  description: string;
  columnConfig: [{ field: string }];
  actions: [{ type: Schema.Types.ObjectId | string }];
}

const gridSchema: Schema<GridDocument> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: UserModelName,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    columnConfig: {
      type: [
        {
          field: { type: String, required: true },
        },
      ],
    },
    actions: [
      {
        type: Schema.Types.ObjectId,
        ref: GridActionName,
      },
    ],
  },
  {
    timestamps: true,
  }
);

gridSchema.plugin(mongoosePaginate);
const GridModelName = "Grid";

const GridModel = mongoose.model<
  GridDocument,
  mongoose.PaginateModel<GridDocument>
>(GridModelName, gridSchema);

export { GridModel, GridModelName, GridDocument };
