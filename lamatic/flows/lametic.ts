const flowConfig = {
  "id": "e4120acc-7d20-46b9-a514-7f424620babf",
  "name": "lametic",
  "nodes": [
    {
      "id": "triggerNode_1",
      "data": {},
      "type": "triggerNode",
      "position": {
        "x": 0,
        "y": 0
      }
    }
  ],
  "edges": [],
  "status": "active",
  "created_at": "2026-07-18T05:48:02.755194+00:00"
};

export async function getNodesAndEdges(): Promise<{
    nodes: Record<string, any>[],
    edges: Record<string, any>[],
}> {
    return {
        nodes: flowConfig.nodes,
        edges: flowConfig.edges,
    }
}

export async function getFlowConfig(): Promise<Record<string, any>> {
    return flowConfig;
}