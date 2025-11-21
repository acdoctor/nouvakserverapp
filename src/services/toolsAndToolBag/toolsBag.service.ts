import mongoose from "mongoose";
import {
  ToolBag,
  IToolBag,
} from "../../models/toolsAndToolsBag/toolsBag.model";

export interface ToolBagPayload {
  name: string;
  description?: string;
  tools: {
    toolId: string;
    quantity: number;
    name: string;
    description?: string;
  }[];
}

export const addToolBagService = async (
  payload: ToolBagPayload,
): Promise<IToolBag> => {
  const { name, description, tools } = payload;

  const newToolBag = new ToolBag({
    name,
    description: description || "",
    tools: tools || [],
  });

  await newToolBag.save();

  return newToolBag;
};

export const updateToolBagService = async (
  toolsBagId: string,
  updateData: Partial<ToolBagPayload>,
): Promise<IToolBag> => {
  if (!mongoose.Types.ObjectId.isValid(toolsBagId)) {
    throw { code: 400, message: "Invalid ToolBag ID format" };
  }

  const updatedToolBag = await ToolBag.findByIdAndUpdate(
    toolsBagId,
    updateData,
    {
      new: true,
    },
  );

  if (!updatedToolBag) {
    throw { code: 404, message: "ToolBag not found" };
  }

  return updatedToolBag;
};

export const getToolBagListService = async (
  page: number,
  limit: number,
  search: string,
) => {
  const query: Record<string, unknown> = { active: true };

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  const total = await ToolBag.countDocuments(query);

  const toolBags = await ToolBag.find(query)
    .skip((page - 1) * limit)
    .limit(limit);

  return { toolBags, total };
};

export const getToolBagByIdService = async (
  toolBagId: string,
): Promise<IToolBag> => {
  if (!mongoose.Types.ObjectId.isValid(toolBagId)) {
    throw { status: 400, message: "Invalid ToolBag ID format" };
  }

  const toolBag = await ToolBag.findById(toolBagId).populate("tools");

  if (!toolBag) {
    throw { status: 404, message: "ToolBag not found" };
  }

  return toolBag;
};
