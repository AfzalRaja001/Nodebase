
"use client";

import { CredentialType } from "@/generated/prisma/enums";
import { useCreateCredential,  useSuspenseCredential,  useUpdateCredential } from "../hooks/use-credentials";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useParams, useRouter } from "next/navigation";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
    name : z.string().min(1, "Name is required"),
    type: z.enum(CredentialType, "Invalid credential type"),
    value: z.string().min(1, "Value is required"),
})

type FormValues = z.infer<typeof formSchema>;

const credentialTypeOptions = [
    {
        value : CredentialType.OPENAI,
        label : "OpenAI",
        logo : "/logos/openai.svg",
    },
    {
        value : CredentialType.ANTHROPIC,
        label : "Anthropic",
        logo : "/logos/anthropic.svg",
    },
    {
        value : CredentialType.GEMINI,
        label : "Gemini",
        logo : "/logos/gemini.svg",
    },
]

interface CredentialFormProps{
    initialData?: {
        id?: string;
        name :string;
        type: CredentialType;
        value: string;
    } | null;
};

export const CredentialForm = ({initialData}: CredentialFormProps) => {
    const router = useRouter();
    const createCredential = useCreateCredential();
    const updateCredential = useUpdateCredential();
    const { handleError, modal} = useUpgradeModal();

    const isEdit = !!initialData?.id;

    const form = useForm<FormValues>({
        resolver : zodResolver(formSchema),
        defaultValues: initialData || {
            name : "",
            type: CredentialType.OPENAI,
            value: "",
        }
    });

    const onSubmit = async (data: FormValues) => {
        if(isEdit && initialData?.id){
            await updateCredential.mutateAsync({
                id: initialData.id,
                ...data,
            })
        }else{
            await createCredential.mutateAsync(data, {
                onError: (error) => {
                    handleError(error)
                }
            }
            )
        }


    }

    return (
        <>
        {modal}
        <Card className="shadow-none">
            <CardHeader>
                <CardTitle>
                    {isEdit ? "Edit Credential" : "Create Credential"}
                </CardTitle>
                <CardDescription>
                    {isEdit ? "Update your credential information." : "Add a new credential to use with your AI agents."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render = {({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="My Api Key" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="type"
                            render = {({field}) => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <FormControl>
                                        <Select {...field} onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="w-full ">
                                                <SelectValue placeholder="Select a credential type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {credentialTypeOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
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
                            name="value"
                            render = {({field}) => (
                                <FormItem>
                                    <FormLabel>API Key</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="sk-..." />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-4">
                            <Button type="submit" disabled={createCredential.isPending|| updateCredential.isPending}>
                                {isEdit ? "Update" : "Create"}
                            </Button>
                            <Button variant="outline" onClick={() => router.push("/credentials")} disabled={createCredential.isPending|| updateCredential.isPending}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
        </>
    );
};

export const CredentialView = ({credentialId} : { credentialId: string }) => {
    const {data : credential} = useSuspenseCredential(credentialId);
    return (
        <CredentialForm initialData={credential} />
    );
};  