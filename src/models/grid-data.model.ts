import mongoose, { Document, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { GridModelName } from "./grid.model";

interface GridDataDocument extends Document {
  grid: mongoose.Schema.Types.ObjectId | string;
  rowData: Map<string, any>;
}

const gridDataSchema: Schema<GridDataDocument> = new Schema(
  {
    grid: {
      type: Schema.Types.ObjectId,
      ref: GridModelName,
      required: true,
    },
    rowData: {
      type: Map,
      of: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
gridDataSchema.plugin(mongoosePaginate);

const GridDataModelName = "grid-data";
const GridDataModel = mongoose.model<
  GridDataDocument,
  mongoose.PaginateModel<GridDataDocument>
>(GridDataModelName, gridDataSchema);

export { GridDataModel, GridDataModelName, GridDataDocument };
