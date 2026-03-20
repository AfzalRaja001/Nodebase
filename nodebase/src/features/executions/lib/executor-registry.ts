import { NodeType } from "@/generated/prisma/enums";
import { NodeExecutor } from "../types";
import { manualTriggerExecutor } from "@/features/triggers/components/manual-trigger/executor";
import { httpRequestExecutor } from "../components/http-request/executor";
import { googleFormExecutor } from "@/features/triggers/components/google-form-trigger/executor";

export const executorRegistory: Record<NodeType, NodeExecutor> = {
    [NodeType.INITIAL] : manualTriggerExecutor,
    [NodeType.HTTP_REQUEST] : httpRequestExecutor,
    [NodeType.MANUAL_TRIGGER] : manualTriggerExecutor,
    [NodeType.GOOGLE_FORM_TRIGGER] : googleFormExecutor,
};

export const getExecutor = (type : NodeType) : NodeExecutor => {
    const executor = executorRegistory[type];
    if(!executor){
        throw new Error(`No executor found for node type: ${type}`);
    }

    return executor; 
};