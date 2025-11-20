import {
  ToolBag,
  IToolBag,
} from "../../models/toolsAndToolsBag/toolsBag.model";

interface ToolBagPayload {
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
