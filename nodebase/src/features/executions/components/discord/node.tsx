"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { DiscordDialog, DiscordFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { DISCORD_CHANNEL_NAME } from "@/inngest/channels/discord";
import { fetchDiscordRealtimeToken } from "./actions";

type DiscordNodeData = {
    webhookUrl?: string;
    content?: string;
    username?: string;
};

type DiscordNodeType = Node<DiscordNodeData>;

export const DiscordNode = memo((props : NodeProps<DiscordNodeType>) => {
    const [dialogOpen, setDilogOpen] = useState(false);
    const {setNodes} = useReactFlow();

    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel : DISCORD_CHANNEL_NAME,
        topic : "status",
        refreshToken : fetchDiscordRealtimeToken,
    })
    const handleOpenSettings = () => setDilogOpen(true);

    const handleSubmit = (values: DiscordFormValues) => {
        setNodes((nodes) => nodes.map((node) => {
            if(node.id === props.id){
                return {
                    ...node,
                    data: {
                        ...node.data,
                        ...values,
                    }
                }
            }

            return node;
        }))
    }

    const nodeData = props.data;
    const description = nodeData?.content
        ? `Send: ${nodeData.content}`
        : "Not configured";   

    return (
        <>
            <DiscordDialog
                open = {dialogOpen}
                onOpenChange={setDilogOpen}
                onSubmit={handleSubmit}
                defaultvalues={nodeData}
            />
            <BaseExecutionNode
                {...props}
                id = {props.id}
                icon = "/logos/discord.svg"
                name = "Discord"
                description={description}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
                status={nodeStatus}
            />
        </>
    )
});

DiscordNode.displayName = "DiscordNode";

