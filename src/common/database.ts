import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import logger from "jet-logger";
mongoose.Promise = global.Promise;
const mongoosePaginateOptions = {
  customLabels: {
    docs: "rows",
    limit: "pageSize",
    page: "pageIndex",
  },
};
mongoosePaginate.paginate.options = mongoosePaginateOptions;
mongoose.connection.on("connected", function () {
  logger.info("Mongoose successfully connected");
});
mongoose.connection.on("error", function (err) {
  logger.err(err);
});
mongoose.connection.on("disconnected", function () {
  logger.warn("Mongoose connection disconnected");
});

export function initDb(): void {
  try {
    mongoose.connect(process.env.MONGODB_URI || "");
  } catch (err) {
    console.log("err-->>>>", err);
  }
}
