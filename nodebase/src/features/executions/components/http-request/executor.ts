import { NodeExecutor } from "@/features/executions/types";
import { da } from "date-fns/locale";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions} from "ky";

type HttpRequestData = {
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
    const result = await step.run("http-request", async () => {
        const method = data.method || "GET";
        const endpoint = data.endpoint!;

        const options : KyOptions = {method};

        if(["POST", "PUT", "PATCH"].includes(method) ){
            options.body = data.body;
        }

        const response = await ky(endpoint, options);
        const contentType = response.headers.get("content-type") ;
        const responseData = contentType?.includes("application/json") ? await response.json() : await response.text();

        return {
            ...context,
            httpResponse: {
                status: response.status,
                statusText: response.statusText,
                data: responseData,
            }
        }
    });

    return result;
};