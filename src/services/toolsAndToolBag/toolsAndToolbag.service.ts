import { Tool } from "../../models/tools/tools.model";

interface AddToolPayload {
  name: string;
  description: string;
  image?: string;
}

export const addToolService = async (payload: AddToolPayload) => {
  const { name, description, image } = payload;

  const existing = await Tool.findOne({ name });
  if (existing) {
    throw new Error("Tool with this name already exists");
  }

  const newTool = await Tool.create({
    name,
    description,
    image: image || "",
  });

  return newTool;
};
