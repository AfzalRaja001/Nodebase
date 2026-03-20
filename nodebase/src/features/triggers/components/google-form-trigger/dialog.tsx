"use client";

import { Button } from "@/components/ui/button";
import { DialogDescription, DialogHeader, Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { generateGoogleFormScript } from "./utils";

interface Props{
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export const GoogleFormTriggerDialog = ({ open, onOpenChange }: Props) => {
    const params = useParams();
    const workflowId = params.workflowId as string;

    // Construct webhook URL
    const baseURL = process.env.NEXT_PUBLIC_NGROK_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const webhookURL = `${baseURL}/api/webhooks/google-form?workflowId=${workflowId}`;

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
                    <DialogTitle>Google Form Trigger</DialogTitle>
                    <DialogDescription>
                        Configure the settings for Google Form trigger node.
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
                            <li>Open your Google Form.</li>
                            <li>Navigate to the "Responses" tab.</li>
                            <li>Click on "Get pre-filled link" and copy the URL.</li>
                            <li>Paste the URL into the "Webhook URL" field above.</li>
                        </ol>
                    </div>
                    <div className="rounded-lg bg-muted p-4 space-y-3">
                        <h4 className="font-medium text-sm">
                            Google Apps Scripts:
                        </h4>    
                            <Button
                                variant="outline"
                                type="button"
                                onClick={async () => {
                                    const script = generateGoogleFormScript(webhookURL);
                                    try {
                                        await navigator.clipboard.writeText(script);
                                        toast.success("Google Apps Script copied to clipboard");
                                    } catch {
                                        toast.error("Failed to copy Google Apps Script");
                                    }
                                }}
                            >
                                <CopyIcon className="size-4 mr-2" />
                                Copy Google Apps Script
                            </Button>
                            <p className="text-xs text-muted-foreground">
                                This Script includes your Webhook URL and can be added to your Google Form to send responses to Nodebase when the form is submitted.
                            </p>
                        
                    </div>
                    <div>
                        <div className="rounded-lg bg-muted p-4 space-y-2">
                            <h4 className="font-medium text-sm"> Avaliable variables</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>
                                    <code className="bg-background px-1 py-0.5 rounded">
                                        {"{{googleForm.respondentEmail}}"}
                                    </code>
                                    - Respondent's email
                                </li>
                                <li>
                                    <code className="bg-background px-1 py-0.5 rounded">
                                        {"{{googleForm.responses['Question Name']}}"}
                                    </code>
                                    - Specific answer
                                </li>
                                <li>
                                    <code className="bg-background px-1 py-0.5 rounded">
                                        {"{{json googleForm.responses}}"}
                                    </code>
                                    - All responses as JSON object
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};