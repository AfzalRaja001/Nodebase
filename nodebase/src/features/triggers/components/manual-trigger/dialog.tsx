"use client";

import { DialogDescription, DialogHeader, Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface Props{
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export const ManualTriggerDialog = ({ open, onOpenChange }: Props) => {
    return(
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Manual Trigger</DialogTitle>
                    <DialogDescription>
                        Configure the settings for manual trigger node.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm text-muted-foreground">
                        Used to manually execute the workflow, no configuration needed. Just connect it to the start of your workflow, and click "Execute Workflow" button on the top right of the editor to trigger the workflow.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
};