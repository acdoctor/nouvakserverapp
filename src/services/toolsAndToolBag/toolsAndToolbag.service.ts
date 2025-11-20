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

export const updateToolService = async (payload: {
  toolId: string;
  name?: string;
  description?: string;
  image?: string;
}) => {
  const { toolId, name, description, image } = payload;

  const updatedTool = await Tool.findByIdAndUpdate(
    toolId,
    {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(image !== undefined && { image }),
    },
    { new: true },
  );

  return updatedTool;
};
