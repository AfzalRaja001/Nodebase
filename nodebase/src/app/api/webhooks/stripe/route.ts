import { sendWorkflowExecution } from "@/inngest/utils";
import { time } from "console";
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
            eventId: body.id,
            eventType: body.type,
            timestamp: body.created,
            livemode: body.livemode,
            raw: body.data?.object
        }

        // Trigger an inngest job
        await sendWorkflowExecution({
            workflowId,
            initialData : {
                stripe : formData,
            }
        })

        return NextResponse.json(
            {success: true},
            {status: 200},
        );
    }catch(error){
        console.error("Error handling Stripe trigger:", error);
        return NextResponse.json(
            {success: false, error: "Failed to process Stripe trigger"},
            {status: 500},
        );
    }
}