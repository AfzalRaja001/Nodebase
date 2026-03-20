"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { AnthropicDialog, AnthropicFormValues } from "./dialog";
import { fetchAnthropicRealtimeToken} from "./actions";
import { useNodeStatus } from "../../hooks/use-node-status";
import { ANTHROPIC_CHANNEL_NAME } from "@/inngest/channels/anthropic";

type AnthropicNodeData = {
    variableName?: string;
    model?: any;
    systemPrompt?: string;
    userPrompt?: string;
};

type AnthropicNodeType = Node<AnthropicNodeData>;

export const AnthropicNode = memo((props : NodeProps<AnthropicNodeType>) => {
    const [dialogOpen, setDilogOpen] = useState(false);
    const {setNodes} = useReactFlow();

    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel : ANTHROPIC_CHANNEL_NAME,
        topic : "status",
        refreshToken : fetchAnthropicRealtimeToken,
    })
    const handleOpenSettings = () => setDilogOpen(true);

    const handleSubmit = (values: AnthropicFormValues) => {
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
            <AnthropicDialog
                open = {dialogOpen}
                onOpenChange={setDilogOpen}
                onSubmit={handleSubmit}
                defaultvalues={nodeData}
            />
            <BaseExecutionNode
                {...props}
                id = {props.id}
                icon = "/logos/anthropic.svg"
                name = "Anthropic"
                description={description}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
                status={nodeStatus}
            />
        </>
    )
});

AnthropicNode.displayName = "AnthropicNode";
