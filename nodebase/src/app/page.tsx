"use client"

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const Page =  () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient( );
  const {data} = useQuery(trpc.getWorkflows.queryOptions());

  const testAi = useMutation(trpc.testAi.mutationOptions({
    onSuccess: () => {
      toast.success("AI Job Queued");
    }
  }));

  const create = useMutation(trpc.createWorkflow.mutationOptions({
    onSuccess : () => {
      queryClient.invalidateQueries(trpc.getWorkflows.queryOptions());
    }
  }));
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center flex-col gap-y-6">
      <div>
        {JSON.stringify(data, null, 2)}
      </div>

      <Button disabled={testAi.isPending} onClick={() => testAi.mutate()}>
        Test Ai
      </Button>

      <Button disabled={create.isPending} onClick={()=>{create.mutate()}}>
        Create Workflows
      </Button>
      
    </div>
  );
}; 

export default Page;