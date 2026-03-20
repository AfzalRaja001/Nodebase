"use client";

import { Button } from "@/components/ui/button";
import { DialogDescription, DialogHeader, Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

interface Props{
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export const StripeTriggerDialog = ({ open, onOpenChange }: Props) => {
    const params = useParams();
    const workflowId = params.workflowId as string;

    // Construct webhook URL
    const baseURL = process.env.NEXT_PUBLIC_NGROK_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const webhookURL = `${baseURL}/api/webhooks/stripe?workflowId=${workflowId}`;

    const  copyToClipboard = async ()  => {
        try{
            await navigator.clipboard.writeText(webhookURL);
            toast.success("Webhook URL copied to clipboard");
        }catch{
            toast.error("Failed to copy webhook URL");
        }
    }
    return(
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Stripe Trigger Configuration</DialogTitle>
                    <DialogDescription>
                        Congifure your Stripe Trigger by copying the webhook URL below and adding it to your Stripe account's webhook settings. This will allow Nodebase to receive events from Stripe and trigger your workflow accordingly.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="webhook-url">  Webhook URL</Label>
                        <div className="flex gap-2">
                            <Input id="webhook-url" className="font-mono text-sm" value={webhookURL} readOnly />
                            <Button
                                type="button"
                                size="icon"
                                onClick={copyToClipboard}
                                variant = "outline"
                            >
                                <CopyIcon className="size-4" />
                            </Button>

                        </div>
                    </div>
                    <div className="rounded-lg bg-muted p-4 space-y-2">
                        <h4 className="font-medium text-sm">Setup Instructions</h4>
                        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                            <li>Open your Stripe Dashboard</li>
                            <li>Go to Developers - Webhooks</li>
                            <li>Click on "Add Endpoint" and copy the URL.</li>
                            <li>Paste the URL into the "Webhook URL" field above.</li>
                        </ol>
                    </div>
                    <div>
                        <div className="rounded-lg bg-muted p-4 space-y-2">
                            <h4 className="font-medium text-sm"> Avaliable variables</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>
                                    <code className="bg-background px-1 py-0.5 rounded">
                                        {"{{stripe.amount}}"}
                                    </code>
                                    - Payment Amount
                                </li>
                                <li>
                                    <code className="bg-background px-1 py-0.5 rounded">
                                        {"{{stripe.currency}}"}
                                    </code>
                                    - Payment Currency
                                </li>
                                <li>
                                    <code className="bg-background px-1 py-0.5 rounded">
                                        {"{{json stripe}}"}
                                    </code>
                                    - Full event data as JSON object
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};