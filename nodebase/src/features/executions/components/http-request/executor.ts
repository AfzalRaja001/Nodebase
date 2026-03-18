import { NodeExecutor } from "@/features/executions/types";
import { da } from "date-fns/locale";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions} from "ky";

type HttpRequestData = {
    variableName?: string;
    endpoint?: string;
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: string;
}

export const httpRequestExecutor : NodeExecutor<HttpRequestData> = async ({
    data,
    nodeId,
    context,
    step,
}) => {
    if(!data.endpoint || !data.method){
        throw new NonRetriableError("Endpoint and method are required for HTTP Request node");
    }
    if(!data.variableName){
        throw new NonRetriableError("Variable name is required to store the HTTP response");
    }
    const result = await step.run("http-request", async () => {
        const method = data.method || "GET";
        const endpoint = data.endpoint!;

        const options : KyOptions = {method};

        if(["POST", "PUT", "PATCH"].includes(method) ){
            options.body = data.body;
            options.headers = {
                "Content-Type": "application/json",
            }
        }

        const response = await ky(endpoint, options);
        const contentType = response.headers.get("content-type") ;
        const responseData = contentType?.includes("application/json") ? await response.json() : await response.text();
        const responsePayload = {
             httpResponse: {
                status: response.status,
                statusText: response.statusText,
                data: responseData,
            },
        }
        if(data.variableName){
            return {
                ...context,
                [data.variableName]: responsePayload,
            }
        }
        // Fallback to direct httpResponse for backwards compatibility
        return {
            ...context,
            ...responsePayload,
        }
    });

    return result;
};