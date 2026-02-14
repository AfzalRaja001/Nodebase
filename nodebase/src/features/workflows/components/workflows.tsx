"use client"
import { EntityContainer, EntityHeader } from "@/components/entity-components";
import { useCreateWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows"
import { fastifyIntegration } from "@sentry/nextjs";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { router } from "better-auth/api";
import { useRouter } from "next/router";

export const WorkflowsList = () => {
    const workflows = useSuspenseWorkflows();

    return (
        <div className="flex-1 flex justify-center items-center">
            <p>
                {JSON.stringify(workflows.data, null, 2)}
            </p>
        </div>
    );
};

export const WorkflowsHeader = ({disabled} : {disabled?: boolean}) => {
    const createWorkflow = useCreateWorkflow();
    const {handleError, modal} = useUpgradeModal(); 
    const router = useRouter();

    const handleCreate = () => {
        createWorkflow.mutate(undefined, {
            onSuccess: (data) => {
                router.push(`/workflows/${data.id}`);
            },
            onError: (error) => {
                handleError(error);
            },
        });
    }
    return(
        <>
        {modal}
        <EntityHeader
            title="Workflows"
            description="Manage your workflows"
            newButtonLabel="New Workflow"
            disabled={disabled}
            onNew={handleCreate}
            isCreating  = {createWorkflow.isPending}
        />
        </>
    );
};

export const WorkflowsContainer = ({
    children
} : {children : React.ReactNode}) => {
    return (
        <EntityContainer
            header = {<WorkflowsHeader/>}
            serach = {<></>}
            pagination = {<></>}
        >
            {children}
        </EntityContainer>
    );
}