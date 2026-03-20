import { NodeExecutor } from "@/features/executions/types";
import { googleFormTriggerChannel } from "@/inngest/channels/google-form-trigger";

type GoogleFormData = Record<string, unknown>;

export const googleFormExecutor : NodeExecutor<GoogleFormData> = async ({
    data,
    nodeId,
    context,
    step,
    publish,
}) => {
    await publish (
        googleFormTriggerChannel().status({
            nodeId,
            status : "loading",
        }),
    )
    const result = await step.run("google-form-trigger", async () => context);

    await publish (
        googleFormTriggerChannel().status({
            nodeId,
            status : "success",
        }),
    )

    return result;
};