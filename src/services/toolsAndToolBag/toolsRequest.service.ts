import {
  ToolRequest,
  IToolRequest,
} from "../../models/toolsAndToolsBag/toolsRequest.model";

export const createToolRequestService = async (payload: {
  technicianId: string;
  identifier: string;
  name: string;
  type: "TOOL" | "TOOL_BAG";
  quantity: number;
  comment: string;
  description: string;
  reason: "BROKEN" | "LOST" | "OTHER" | "NEW_ASSIGNMENT";
}): Promise<IToolRequest> => {
  const newRequest = new ToolRequest({
    technicianId: payload.technicianId,
    identifier: payload.identifier,
    name: payload.name,
    type: payload.type,
    quantity: payload.quantity,
    status: "REQUESTED",
    comment: payload.comment,
    description: payload.description,
    reason: payload.reason,
  });

  await newRequest.save();
  return newRequest;
};
