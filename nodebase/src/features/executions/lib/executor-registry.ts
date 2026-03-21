import { NodeType } from "@/generated/prisma/enums";
import { NodeExecutor } from "../types";
import { manualTriggerExecutor } from "@/features/triggers/components/manual-trigger/executor";
import { httpRequestExecutor } from "../components/http-request/executor";
import { googleFormExecutor } from "@/features/triggers/components/google-form-trigger/executor";
import { stripeTriggerExecutor } from "@/features/triggers/components/stripe-trigger/executor";
import { geminiExecutor } from "../components/gemini/executor";
import { anthropicExecutor } from "../components/anthropic/executor";
import { openaiExecutor } from "../components/openai/executor";
import { discordExecutor } from "../components/discord/executor";

export const executorRegistory: Record<NodeType, NodeExecutor> = {
    [NodeType.INITIAL] : manualTriggerExecutor,
    [NodeType.HTTP_REQUEST] : httpRequestExecutor,
    [NodeType.MANUAL_TRIGGER] : manualTriggerExecutor,
    [NodeType.GOOGLE_FORM_TRIGGER] : googleFormExecutor,
    [NodeType.STRIPE_TRIGGER] : stripeTriggerExecutor,
    [NodeType.GEMINI] : geminiExecutor,
    [NodeType.ANTHROPIC] : anthropicExecutor,
    [NodeType.OPENAI] : openaiExecutor,
    [NodeType.DISCORD] : discordExecutor,
    
};

export const getExecutor = (type : NodeType) : NodeExecutor => {
    const executor = executorRegistory[type];
    if(!executor){
        throw new Error(`No executor found for node type: ${type}`);
    }

    return executor; 
};