import { ActionDocument, GridActionModel } from "@src/models/grid-action.model";

interface GridDataPayload {
  name: string;
  label: string;
}

class ActionService {
  create(data: GridDataPayload): Promise<ActionDocument> {
    const actionData = new GridActionModel(data);
    return actionData.save();
  }

  async getAll(filter?: any, options?: any): Promise<ActionDocument[]> {
    return GridActionModel.find(filter, options).select({
      _id: 1,
      name: 1,
      label: 1,
    });
  }
}

export default new ActionService();
