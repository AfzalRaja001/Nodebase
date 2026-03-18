import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { MousePointerIcon } from "lucide-react";
import { ManualTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { fetchManualTriggerRealtimeToken } from "./actions";
import { MANUAL_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/manual-request";

export const ManualTriggerNode = memo((props: NodeProps) => {
    

    const [dialogOpen, setDialogOpen] = useState(false);

    const nodeStatus = useNodeStatus({
            nodeId: props.id,
            channel : MANUAL_TRIGGER_CHANNEL_NAME,
            topic : "status",
            refreshToken : fetchManualTriggerRealtimeToken,
        })

    const handleOpenSettings = () => setDialogOpen(true);
    const handleDoubleClick = () => setDialogOpen(true);

    return (
        <>
            <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen}/>
            <BaseTriggerNode
                {...props}
                icon={MousePointerIcon}
                name="When clicking 'Execute Workflow'"
                status = {nodeStatus}
                onSettings={handleOpenSettings}
                onDoubleClick={handleDoubleClick}
            />
        </>
    )
});