"use client"
import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination, EntitySearch, ErrorView, LoadingView } from "@/components/entity-components";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";
import { useEntitySearch } from "@/hooks/use-entity-search";
import {formatDistanceToNow} from "date-fns";
import { useCreateCredential, useRemoveCredential, useSuspenseCredentials } from "../hooks/use-credentials";
import { useCredentialParams } from "../hooks/use-credentials-params";
import { ShieldIcon } from "lucide-react";
import type { Credential } from "@/generated/prisma/client";

export const CredentialsSearch = () => {
    const [params, setParams] = useCredentialParams();
    const {searchValue, onSearchChange} = useEntitySearch({
        params,
        setParams,
    })

    return (
        <EntitySearch 
            value= {searchValue}
            onChange={onSearchChange}
            placeholder="Search Credentials"
        />
    );
};

export const CredentialsList = () => {
    const credentials = useSuspenseCredentials();

    return(
        <EntityList
            items={credentials.data.items}
            getKey={(credential) => credential.id}
            renderItem={(credential) =>  <CredentialItem data={credential}/>}
            emptyView={<CredentialsEmpty/>}
        />
    )
};

export const CredentialsHeader = ({disabled} : {disabled?: boolean}) => {
    return(
        <>
        <EntityHeader
            title="Credentials"
            description="Manage your credentials"
            newButtonLabel="New Credential"
            disabled={disabled}
            newButtonHref="/credentials/new"
        />
        </>
    );
};

export const CredentialsPagination = () => {
    const credentials = useSuspenseCredentials();
    const [params, setParams] = useCredentialParams();

    return (
        <EntityPagination
            page={credentials.data.page}
            totalPages={credentials.data.totalPages}
            onPageChange={(page) => setParams({...params, page})}
            disabled={credentials.isFetching}
        />
    )
}

export const CredentialsContainer = ({
    children
} : {children : React.ReactNode}) => {
    return (
        <EntityContainer
            header = {<CredentialsHeader/>}
            serach = {<CredentialsSearch/>}
            pagination = {<CredentialsPagination/>}
        >
            {children}
        </EntityContainer>
    );
};

export const CredentialsLoading = () => {
    return <LoadingView message="Loading Credentials..."/>;
};

export const CredentialsError = () => {
    return <ErrorView message="Failed to load credentials"/>;
};

export const CredentialsEmpty = () => {
    const router = useRouter();

    const {modal} = useUpgradeModal();

    const handleCreate = () => {
        router.push("/credentials/new");
    }

    return (
        <>
            {modal}
            <EmptyView
                message="No Credentials found. Create a credential to get started."
                onNew={handleCreate}
            />
        </>
    );
};

export const CredentialItem = ({data}: {data: Credential}) => {
    const removeCredential = useRemoveCredential();

    const handleRemove = () => {
        removeCredential.mutate({id: data.id});
    }
    return(
        <EntityItem
            href={`/credentials/${data.id}`}
            title ={data.name}
            subtitle ={
                <>
                    Updated {formatDistanceToNow(new Date(data.updatedAt), {addSuffix: true})}{" "}
                    &bull; Created{" "}
                    {formatDistanceToNow(new Date(data.createdAt), {addSuffix: true})}
                </>
            }
            image = {
                <div className="size-8 flex items-center justify-center">
                    <ShieldIcon className="size-5 text-muted-foreground"/>
                </div>
            }
            onRemove={handleRemove}
            isRemoving={removeCredential.isPending}
        />
    )
}

