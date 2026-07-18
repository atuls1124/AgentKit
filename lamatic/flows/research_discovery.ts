const flowConfig = {
  "id": "faeed2c9-c3d0-4798-8cde-3eb62d304345",
  "name": "research_discovery",
  "edges": [],
  "status": "active",
  "created_at": "2026-07-18T05:03:31.690398+00:00",
  "trigger_id": null,
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
  ]
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