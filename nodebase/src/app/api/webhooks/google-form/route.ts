import { sendWorkflowExecution } from "@/inngest/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try{
        const url = new URL(request.url);
        const workflowId = url.searchParams.get("workflowId");
        if(!workflowId){
            return NextResponse.json(
                {success: false, error: "Missing workflowId"},
                {status: 400},
            );
        }

        const body = await request.json();

        const formData = {
            formId : body.formId,
            formTitle : body.formTitle,
            responseId : body.responseId,
            timestamp : body.timestamp,
            respondentEmail : body.respondentEmail,
            responses : body.responses,
            raw : body, 
        }

        // Trigger an inngest job
        await sendWorkflowExecution({
            workflowId,
            initialData : {
                googleForm : formData,
            }
        })

        return NextResponse.json(
            {success: true},
            {status: 200},
        );
    }catch(error){
        console.error("Error handling Google Form trigger:", error);
        return NextResponse.json(
            {success: false, error: "Failed to process Google Form trigger"},
            {status: 500},
        );
    }
}