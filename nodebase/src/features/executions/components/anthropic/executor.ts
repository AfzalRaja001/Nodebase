import { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { createAnthropic } from "@ai-sdk/anthropic";
import Handlebars from "handlebars"; 
import { generateText } from "ai";
import { anthropicChannel } from "@/inngest/channels/anthropic";
import prisma from "@/lib/db";

Handlebars.registerHelper("json", function(context) {
    const stringified = JSON.stringify(context, null, 2);
    return new Handlebars.SafeString(stringified); ;
});

type AnthropicData = {
    credentialId?: string;
    variableName?: string;
    model?: any;
    systemPrompt?: string;
    userPrompt?: string;
    userId?: string;
}

export const anthropicExecutor : NodeExecutor<AnthropicData> = async ({
    data,
    nodeId,
    context,
    step,
    publish,
}) => {
    await publish(
        anthropicChannel().status({
            nodeId,
            status : "loading",
        })
    )
    
    if(!data.variableName){
        await publish(
            anthropicChannel().status({
                nodeId,
                status : "error",
            }),
        );

        throw new NonRetriableError("Anthropic Node: Variable name is required");
    }
    if(!data.credentialId){
        await publish(
            anthropicChannel().status({
                nodeId,
                status : "error",
            }),
        );

        throw new NonRetriableError("Anthropic Node: Credential is required");
    }

    if(!data.userPrompt){
        await publish(
            anthropicChannel().status({
                nodeId,
                status : "error",
            }),
        );
        throw new NonRetriableError("Anthropic Node: User prompt is required");

    }

    const systemPrompt = data.systemPrompt ? Handlebars.compile(data.systemPrompt)(context) : "You are a helpful assistant.";
    const userPrompt = Handlebars.compile(data.userPrompt)(context) ;

    const credential = await step.run("get-credential", () => {
        return prisma.credential.findUnique({
            where : {
                id : data.credentialId,
                userId : data.userId,
            }
        });
    });

    if(!credential){
        throw new NonRetriableError("Anthropic Node: Credential not found");
    }

    const anthropic = createAnthropic({
        apiKey : credential.value,
    });

    try{
        const {steps} = await step.ai.wrap("anthropic-generate-text", generateText, {
            model : anthropic(data.model || "claude-3-5-sonnet-20240620"),
            system : systemPrompt,
            prompt : userPrompt,
            experimental_telemetry : {
                isEnabled : true,
                recordInputs : true,
                recordOutputs : true,
            }
        },);

        const text = 
            steps[0].content[0].type === "text" ? steps[0].content[0].text : "";
        
        await publish(
            anthropicChannel().status({
                nodeId,
                status : "success",
            }),
        );
        
        return {
            ...context,
            [data.variableName ] : {
                aiResponse : text,
            }
        }
    }catch (error){
        await publish(
            anthropicChannel().status({
                nodeId,
                status : "error",
            }),
        );

        throw error;
    }
};
