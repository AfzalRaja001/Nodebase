"use client";

import { Button } from "@/components/ui/button";
import { DialogDescription, DialogHeader, Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import z from "zod";
import { useEffect } from "react";


const formSchema = z.object({
    variableName : z.string()
                    .min(1, {message: "Variable name is required"})
                    .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {message: "Variable name must start with a letter or underscore and can only contain letters, numbers, and underscores"}),
    username : z.string().optional(),
    content : z
        .string()
        .min(1, {message: "Content is required"})
        .max(2000, {message: "Content must be less than 2000 characters"}),

    webhookUrl : z.string().min(1, {message: "Webhook URL is required"})    
})

export type DiscordFormValues = z.infer<typeof formSchema>;

interface Props{
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit : (values : z.infer<typeof formSchema>) => void;
    defaultvalues?: Partial<DiscordFormValues>;
};

export const DiscordDialog    = ({ open, onOpenChange, onSubmit, defaultvalues }: Props) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            variableName: defaultvalues?.variableName,  
            username: defaultvalues?.username,
            content: defaultvalues?.content,
            webhookUrl: defaultvalues?.webhookUrl,
        },
    });

    useEffect(() => {
        if(open){
            form.reset({
                variableName: defaultvalues?.variableName,
                username: defaultvalues?.username,
                content: defaultvalues?.content,
                webhookUrl: defaultvalues?.webhookUrl,
            }); 
        }
    }, [open, defaultvalues, form]);

    const watchVariableName = form.watch("variableName") || "myApiCall";

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(values);
        onOpenChange(false);
    }
    return(
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Discord Configuration</DialogTitle>
                    <DialogDescription>
                        Configure the Discord webhook settings for this node.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-8 mt-4"
                    >   
                        <FormField
                            control={form.control}
                            name="variableName"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Variable Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter variable name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Use this name to reference the result in other nodes:
                                        {" "}
                                        {`{{${watchVariableName}.text}}`},
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            ) }
                        />
                        
                            <FormField
                                name="webhookUrl"
                                control={form.control}
                                render={({field}) => (
                                <FormItem>
                                    <FormLabel>Webhook URL</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter the Discord webhook URL"
                                            {...field}
                                            className="min-h-[80px] font-mono text-sm"
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        The URL of the Discord webhook to send messages to.
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            ) }
                            />
                            <FormField
                                name="content"
                                control={form.control}
                                render={({field}) => (
                                <FormItem>
                                    <FormLabel>Message Content</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter the message content. You can use variables like {{myVariable}} to include data from other nodes."
                                            {...field}
                                            className="min-h-[80px] font-mono text-sm"
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        The main prompt for the Gemini model. Use {"{{variables}}"} for simple values or {"{{json variables}}"} to stringify complex variables.
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            ) }
                            />
                            <FormField
                                name="username"
                                control={form.control}
                                render={({field}) => (
                                <FormItem>
                                    <FormLabel>Username (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter the username for the Discord bot"
                                            {...field}
                                            className="min-h-[80px] font-mono text-sm"
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        The username that will appear when the bot sends messages.
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            ) }
                            />
                        <DialogFooter className="mt-4">
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};