"use client";

import { Button } from "@/components/ui/button";
import { DialogDescription, DialogHeader, Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import z from "zod";
import { useEffect } from "react";
import { useCredentialByType } from "@/features/credentials/hooks/use-credentials";
import { CredentialType } from "@/generated/prisma/enums";

const AVAILABLE_MODELS = [
    "claude-3-5-sonnet-20240620",
    "claude-3-5-sonnet-latest",
    "claude-3-opus-20240229",
    "claude-3-opus-latest",
    "claude-3-sonnet-20240229",
    "claude-3-haiku-20240307",
] as const;

const formSchema = z.object({
    variableName : z.string()
                    .min(1, {message: "Variable name is required"})
                    .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {message: "Variable name must start with a letter or underscore and can only contain letters, numbers, and underscores"}),
    model : z.string().min(1, {message: "Model is required"}),  
    systemPrompt: z.string().optional(),
    userPrompt: z.string().min(1, {message: "User prompt is required"}),
    credentialId : z.string().min(1, {message: "Credential is required"}),
    body: z.
        string()
        .optional()
        // .refine()
})

export type AnthropicFormValues = z.infer<typeof formSchema>;

interface Props{
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit : (values : z.infer<typeof formSchema>) => void;
    defaultvalues?: Partial<AnthropicFormValues>;
};

export const AnthropicDialog = ({ open, onOpenChange, onSubmit, defaultvalues }: Props) => {
    const {data : credentials, isLoading : isLoadingCredentials} = useCredentialByType(CredentialType.ANTHROPIC);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            variableName: defaultvalues?.variableName,  
            model: defaultvalues?.model || AVAILABLE_MODELS[0],
            systemPrompt: defaultvalues?.systemPrompt,
            userPrompt: defaultvalues?.userPrompt,
            credentialId: defaultvalues?.credentialId,
        },
    });

    useEffect(() => {
        if(open){
            form.reset({
                variableName: defaultvalues?.variableName,
                model: defaultvalues?.model || AVAILABLE_MODELS[0],
                systemPrompt: defaultvalues?.systemPrompt,
                userPrompt: defaultvalues?.userPrompt,
                credentialId: defaultvalues?.credentialId,
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
                    <DialogTitle>Anthropic</DialogTitle>
                    <DialogDescription>
                        Configure the settings for Anthropic node.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-8 mt-4"
                    >
                    <FormField 
                        control={form.control}
                        name="credentialId"
                        render = {({field}) => (
                            <FormItem>
                                <FormLabel>Credential</FormLabel>
                                <FormControl>
                                    <Select {...field} onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingCredentials || credentials?.length === 0}>
                                        <SelectTrigger className="w-full ">
                                            <SelectValue placeholder="Select a credential" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {credentials?.map((credential) => (
                                                <SelectItem key={credential.id} value={credential.id}>
                                                    {credential.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />    
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
                                name="systemPrompt"
                                control={form.control}
                                render={({field}) => (
                                <FormItem>
                                    <FormLabel>System Prompt (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="You are a helpful assistant."
                                            {...field}
                                            className="min-h-[80px] font-mono text-sm"
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Sets the behavior of the assistant. Use {"{{variables}}"} for simple values or {"{{json variables}}"} to stringify complex variables.
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            ) }
                            />
                            <FormField
                                name="userPrompt"
                                control={form.control}
                                render={({field}) => (
                                <FormItem>
                                    <FormLabel>User Prompt</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Summarize this text: {{input.text}}"
                                            {...field}
                                            className="min-h-[80px] font-mono text-sm"
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        The main prompt for the Anthropic model. Use {"{{variables}}"} for simple values or {"{{json variables}}"} to stringify complex variables.
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            ) }
                            />
                            <FormField
                                name="model"
                                control={form.control}
                                render={({field}) => (
                                <FormItem>
                                    <FormLabel>Model</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}  
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a model" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {AVAILABLE_MODELS.map((model) => (
                                                <SelectItem key={model} value={model}>
                                                    {model}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        The Anthropic model to use for this node.
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
