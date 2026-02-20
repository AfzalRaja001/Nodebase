"use client"

import { NodeType } from "@/generated/prisma/enums";
import {createId} from "@paralleldrive/cuid2";
import { GlobeIcon, MousePointerIcon } from "lucide-react";
import { SheetTrigger, Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { Separator } from "@radix-ui/react-separator";
import { Position, useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import { toast } from "sonner";
import { id } from "date-fns/locale";

export type NodeTypeOption = {
    type : NodeType;
    label : string;
    description : string;
    icon : React.ComponentType<{className?: string}> | string;
};

const triggerNodes : NodeTypeOption[] = [
    {
        type : NodeType.MANUAL_TRIGGER,
        label : "Manual Trigger",
        description : "Trigger the workflow manually",
        icon: MousePointerIcon,
    },
];

const executionNodes : NodeTypeOption[] = [
    {
        type : NodeType.HTTP_REQUEST,
        label : "HTTP Request",
        description : "Make an HTTP request to an API endpoint",
        icon: GlobeIcon,
    },
];

interface NodeSelectorProps {
    open : boolean;
    onOpenChange : (open : boolean) => void;
    children : React.ReactNode;
};

export function NodeSelector({open, onOpenChange, children} : NodeSelectorProps) {
    const {setNodes, getNodes, screenToFlowPosition} = useReactFlow();

    const handleNodeSelect = useCallback((selection: NodeTypeOption) => {
        if(selection.type === NodeType.MANUAL_TRIGGER){
            const nodes = getNodes();
            const hasManualTrigger = nodes.some(
                (node) => node.type === NodeType.MANUAL_TRIGGER
            );

            if(hasManualTrigger){
                toast.error("A workflow can only have one manual trigger");
                return;
            }
        }

        setNodes((nodes) => {
            const hasInitialNode = nodes.some(
                (node) => node.type === NodeType.INITIAL,
            );

            const centreX = window.innerWidth / 2;
            const centreY = window.innerHeight / 2;

            const flowPosition = screenToFlowPosition({
                x: centreX + (Math.random() - 0.5) * 200,
                y: centreY + (Math.random() - 0.5) * 200,
            });

            const newNode = {
                id: createId(),
                data : {},
                position : flowPosition,
                type : selection.type,
            };

            if(hasInitialNode){
                return [newNode];
            }

            return [...nodes, newNode];
        });

        onOpenChange(false);
    }, [
        setNodes,
        getNodes,
        onOpenChange,
        screenToFlowPosition,
    ]);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>
                        What triggers this workflow?
                    </SheetTitle>
                    <SheetDescription>
                        A trigger is a step that starts your workdflow.
                    </SheetDescription>
                </SheetHeader>
                <div>
                    {triggerNodes.map((nodeType) =>{
                        const Icon = nodeType.icon;
                        return (
                            <div
                                key={nodeType.type}
                                className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary"
                                onClick={() => handleNodeSelect(nodeType)}
                            >
                                <div className="flex items-center gap-6 w-full overflow-hidden">
                                    {
                                        typeof Icon === "string" ? (
                                            <img src={Icon} alt={nodeType.label} className="size-5 object-contain rounded-sm" />
                                        ) : (
                                            <Icon className="size-5" />
                                        )
                                    }
                                    <div className="flex flex-col items-start text-left"> 
                                        < span className="font-medium text-sm">
                                            {nodeType.label}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {nodeType.description}
                                        </span>
                                    </div>
                                </div>

                            </div>
                        )
                    })}
                </div>
                <Separator/>
                 <div>
                    {executionNodes.map((nodeType) =>{
                        const Icon = nodeType.icon;
                        return (
                            <div
                                key={nodeType.type}
                                className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary"
                                onClick={() => handleNodeSelect(nodeType) }
                            >
                                <div className="flex items-center gap-6 w-full overflow-hidden">
                                    {
                                        typeof Icon === "string" ? (
                                            <img src={Icon} alt={nodeType.label} className="size-5 object-contain rounded-sm" />
                                        ) : (
                                            <Icon className="size-5" />
                                        )
                                    }
                                    <div className="flex flex-col items-start text-left"> 
                                        < span className="font-medium text-sm">
                                            {nodeType.label}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {nodeType.description}
                                        </span>
                                    </div>
                                </div>

                            </div>
                        )
                    })}
                </div>
            </SheetContent>
        </Sheet>
    );
};