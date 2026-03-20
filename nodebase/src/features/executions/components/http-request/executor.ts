import { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions} from "ky";
import Handlebars from "handlebars"; 
import { Handle } from "vaul";
import { httpRequestChannel } from "@/inngest/channels/http-request";

Handlebars.registerHelper("json", function(context) {
    const stringified = JSON.stringify(context, null, 2);
    return new Handlebars.SafeString(stringified); ;
});

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
    publish,
}) => {
    await publish(
        httpRequestChannel().status({
            nodeId,
            status : "loading",
        })
    )

    
    const result = await step.run("http-request", async () => {
        if(!data.endpoint || !data.method){
        await publish(
        httpRequestChannel().status({
            nodeId,
            status : "error",
        })
    )
        throw new NonRetriableError("Endpoint and method are required for HTTP Request node");
    }
    if(!data.variableName){
        await publish(
        httpRequestChannel().status({
            nodeId,
            status : "error",
        })
    )
        throw new NonRetriableError("Variable name is required to store the HTTP response");
    }
    if(!data.method){
        throw new NonRetriableError("HTTP method is required");
    }
        const method = data.method || "GET";
        const endpoint = Handlebars.compile(data.endpoint)(context);

        const options : KyOptions = {method};

        if(["POST", "PUT", "PATCH"].includes(method) ){
            const resolved = Handlebars.compile(data.body || "{}")(context);
            JSON.parse(resolved); // validate JSON
            options.body = resolved;
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
        };
        return {
            ...context,
            [data.variableName]: responsePayload,
        }
    });

    await publish(
        httpRequestChannel().status({
            nodeId,
            status : "success",
        })
    )


    return result;
};