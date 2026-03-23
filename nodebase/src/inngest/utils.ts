import { Node,Connection } from "@/generated/prisma/client";
import toposort from "toposort";
import { inngest } from "./client";
import { createId } from "@paralleldrive/cuid2";

export const topologicalSort = (
    nodes: Node[],
    connections : Connection[]
): Node[] => {
    if(connections.length === 0) return nodes;

    // Create edges for toposort
    const edges: [string, string][] = connections.map((conn) => [
        conn.fromNodeId,
        conn.toNodeId,
    ]);

    // Add nodes without connections to the edges list to ensure they are included in the sort
    const connectedNodeIds = new Set<string>();
    for(const conn of connections){
        connectedNodeIds.add(conn.fromNodeId);
        connectedNodeIds.add(conn.toNodeId);
    }

    for(const node of nodes){
        if(!connectedNodeIds.has(node.id)){
            edges.push([node.id, node.id]); // Self-loop to include isolated nodes
        }
    }
    
    // Perform topological sort
    let sortedNodeIds: string[];
    try{
        sortedNodeIds = toposort(edges);
        // Remove the duplicates while preserving order
        sortedNodeIds = [...new Set(sortedNodeIds)];
    }catch(error){
        if(error instanceof Error && error.message.includes("Cyclic dependency")){
            throw new Error("Cyclic dependency detected in workflow nodes");
        }
        throw error;    
    }
    
    // Map sorted idsack to node objects
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    return sortedNodeIds.map((id) => 
        nodeMap.get(id)!).filter(Boolean); // Filter out any undefined nodes
    

};

export const sendWorkflowExecution = async (data : {
    workflowId : string;
    [key : string] : any;
}) => {
    return inngest.send({
        name : "workflows/execute.workflow",
        data,
        id : createId(),
    });
};