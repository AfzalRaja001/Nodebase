import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/db";
import { topologicalSort } from "./utils";
import { ExecutionStatus, NodeType } from "@/generated/prisma/enums";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import { httpRequestChannel } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual-request";
import { googleFormTriggerChannel } from "./channels/google-form-trigger";
import { stripeTriggerChannel } from "./channels/stripe-trigger";
import { geminiChannel } from "./channels/gemini";
import { discordChannel } from "./channels/discord";

export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow",
    retries : 0,  // TODO : Change in production
    onFailure : async ({event, step}) => {
      return prisma.execution.update({
        where : {
          inngestEventId : event.data.event.id,
        },
        data : {
          status : ExecutionStatus.FAILED,
          finishedAt : new Date(),
          error : event.data.error.message,
          errorStack : event.data.error.stack, 
        },
      });
    }
   },
  { event: "workflows/execute.workflow",
    channels: [
      httpRequestChannel(),
      manualTriggerChannel(),
      googleFormTriggerChannel(),
      stripeTriggerChannel(),
      geminiChannel(),
      discordChannel(),
    ],
   },

  async ({ event, step, publish }) => {
      const workflowId = event.data.workflowId;
      const inngestEventId = event.id;

      if(!workflowId || !inngestEventId){
        throw new NonRetriableError("Workflow ID or Inngest Event ID is required");
      }

      await step.run("create-execution", async () => {
        return prisma.execution.create({
          data :{
            workflowId,
            inngestEventId,
          },
        });
      });

      const sortedNodes = await step.run("prepare-workflow", async () => {
        const workflow = await prisma.workflow.findUniqueOrThrow({
          where : {
            id: workflowId,
          },
          include : { nodes : true , connections : true},
        });
          return topologicalSort(workflow.nodes, workflow.connections);
      });

      const userId = await step.run("find-user-id", async () => {
        const workflow = await prisma.workflow.findUniqueOrThrow({
          where : {
              id: workflowId,
          },
          select : {
            userId : true,
          },
        });

        return workflow.userId;
      })

      // Initalize te context with any initial data from the trigger
      let context = event.data.initialData || {};

      for(const node of sortedNodes){
        const executor = getExecutor(node.type as NodeType);
        context = await executor({
          data : node.data as Record<string, unknown>,
          nodeId : node.id,
          context,
          step,
          publish,
          userId,
        });
      }

      await step.run("update-execution", async () => {
        await prisma.execution.update({
          where : {
            inngestEventId,
            workflowId
          },
          data : {
            status : ExecutionStatus.SUCCESS,
            output : context,
            finishedAt : new Date(),
          },
        });
      });

      return {
        workflowId,
        result: context,
      };
    },
);