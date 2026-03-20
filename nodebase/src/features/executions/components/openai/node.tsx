"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { OpenAIDialog, OpenAIFormValues } from "./dialog";
import { fetchOpenAIRealtimeToken} from "./actions";
import { useNodeStatus } from "../../hooks/use-node-status";
import { OPENAI_CHANNEL_NAME } from "@/inngest/channels/openai";

type OpenAINodeData = {
    variableName?: string;
    model?: any;
    systemPrompt?: string;
    userPrompt?: string;
};

type OpenAINodeType = Node<OpenAINodeData>;

export const OpenAINode = memo((props : NodeProps<OpenAINodeType>) => {
    const [dialogOpen, setDilogOpen] = useState(false);
    const {setNodes} = useReactFlow();

    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel : OPENAI_CHANNEL_NAME,
        topic : "status",
        refreshToken : fetchOpenAIRealtimeToken,
    })
    const handleOpenSettings = () => setDilogOpen(true);

    const handleSubmit = (values: OpenAIFormValues) => {
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
    const description = nodeData?.model
        ? `Model: ${nodeData.model}`
        : "Not configured";   

    return (
        <>
            <OpenAIDialog
                open = {dialogOpen}
                onOpenChange={setDilogOpen}
                onSubmit={handleSubmit}
                defaultvalues={nodeData}
            />
            <BaseExecutionNode
                {...props}
                id = {props.id}
                icon = "/logos/openai.svg"
                name = "OpenAI"
                description={description}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
                status={nodeStatus}
            />
        </>
    )
});

OpenAINode.displayName = "OpenAINode";
