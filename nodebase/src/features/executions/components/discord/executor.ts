import { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import Handlebars from "handlebars"; 
import { generateText } from "ai";
import prisma from "@/lib/db";
import { discordChannel } from "@/inngest/channels/discord";
import { decode } from "html-entities";
import ky from "ky";

Handlebars.registerHelper("json", function(context) {
    const stringified = JSON.stringify(context, null, 2);
    return new Handlebars.SafeString(stringified); ;
});

type DiscordData = {
    variableName?: string;
    webhookUrl?: string;
    content?: string;
    username?: string;
}

export const discordExecutor : NodeExecutor<DiscordData> = async ({
    data,
    nodeId,
    context,
    step,
    publish,
    userId,
}) => {
    await publish(
        discordChannel().status({
            nodeId,
            status : "loading",
        })
    )
    
    if(!data.variableName){
        await publish(
            discordChannel().status({
                nodeId,
                status : "error",
            }),
        );

        throw new NonRetriableError("Discord Node: Variable name is required");
    }
    if(!data.webhookUrl){
        await publish(
            discordChannel().status({
                nodeId,
                status : "error",
            }),
        );

        throw new NonRetriableError("Discord Node: Webhook URL is required");
    }

    if(!data.content){
        await publish(
            discordChannel  ().status({
                nodeId,
                status : "error",
            }),
        );
        throw new NonRetriableError("Discord Node: Content is required");

    }

    const rawContent = Handlebars.compile(data.content)(context);
    const content = decode(rawContent);
    const variableName = data.variableName;
    const username = data.username ? Handlebars.compile(data.username)(context) : undefined;


    try{
        const result = await step.run("discord-webook", async () => {
            await ky.post(data.webhookUrl!, {
                json : {
                    content : content.slice(0, 2000), 
                    username,
                },
            });

            return {
                ...context,
                [variableName] : {
                    discordMessage : content.slice(0, 2000),
                }
            }
        });
        
        await publish(
            discordChannel().status({
                nodeId,
                status : "success",
            }),
        );
        
        return result;
    }catch (error){
        await publish(
            discordChannel().status({
                nodeId,
                status : "error",
            }),
        );

        throw error;
    }
};