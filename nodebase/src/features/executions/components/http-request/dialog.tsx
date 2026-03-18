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
import { useReactFlow } from "@xyflow/react";
import { useEffect } from "react";

const formSchema = z.object({
    endpoint : z.url({message: "Please enter valid URL"}),
    method : z.enum(["POST", "PUT", "GET", "PATCH", "DELETE"]),
    body: z.
        string()
        .optional()
        // .refine()
})

export type HttpRequestFormValues = z.infer<typeof formSchema>;

interface Props{
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit : (values : z.infer<typeof formSchema>) => void;
    defaultvalues?: Partial<HttpRequestFormValues>;
};

export const HttpRequestDialog = ({ open, onOpenChange, onSubmit, defaultvalues }: Props) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            endpoint: defaultvalues?.endpoint,
            method: defaultvalues?.method,
            body: defaultvalues?.body,
        },
    });

    useEffect(() => {
        if(open){
            form.reset({
                endpoint: defaultvalues?.endpoint,
                method: defaultvalues?.method,
                body: defaultvalues?.body,
            }); 
        }
    }, [open, defaultvalues, form]);

    const watchMethod = form.watch("method");
    const showBodyField = ["POST", "PUT", "PATCH"].includes(watchMethod);

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(values);
        onOpenChange(false);
    }
    return(
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Http Request</DialogTitle>
                    <DialogDescription>
                        Configure the settings for HTTP Request node.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-8 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="method"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Method</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >   
                                     <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a method" />
                                        </SelectTrigger>
                                     </FormControl>
                                     <SelectContent>
                                        <SelectItem value="GET">GET</SelectItem>
                                        <SelectItem value="POST">POST</SelectItem>
                                        <SelectItem value="PUT">PUT</SelectItem>
                                        <SelectItem value="DELETE">DELETE</SelectItem>
                                        <SelectItem value="PATCH">PATCH</SelectItem>
                                     </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        The HTTP method to use for this request
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            ) }
                        />
                        <FormField
                            control={form.control}
                            name="endpoint"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Endpoint URL</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="https://api.example.com/users/{{httpResponse.data.id}}"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Static URL or use {"{{variables}}"} for simple values or {"{{json variable}}"} to stringify the objects
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            ) }
                        />
                        {showBodyField && (
                            <FormField
                                name="body"
                                control={form.control}
                                render={({field}) => (
                                <FormItem>
                                    <FormLabel>Request Body</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder={
                                                '{\n  "userId": "{{httpResponse.data.id}}",\n  "name": "{{httpResponse.data.name}}",\n  "items": "{{httpResponse.data.items}}"\n}'
                                            }
                                            {...field}
                                            className="min-h-[120px] font-mono text-sm"
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        JSON with template variables. Use {"{{variables}}"} for simple values or {"{{json variable}}"} to stringify the objects
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            ) }
                            />
                        )}
                        <DialogFooter className="mt-4">
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};