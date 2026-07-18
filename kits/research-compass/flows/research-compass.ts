/*
 * # Research Compass — Paper Intelligence & Comparison
 *
 * ## Purpose
 * This flow implements Nodes 1 and 2 of the Research Compass pipeline.
 * Node 1 (Paper Intelligence) extracts structured metadata and generates
 * summaries from research papers. Node 2 (Comparison & Insights) compares
 * papers across 6 dimensions and identifies agreements, contradictions,
 * and key insights.
 *
 * ## Inputs
 * | Field | Type | Required | Description |
 * |---|---|---|---|
 * | `papers` | `PaperInput[]` | Yes | Preprocessed paper objects |
 * | `researchArea` | `string` | No | Optional domain hint |
 *
 * ## Outputs
 * | Field | Type | Description |
 * |---|---|---|
 * | `result` | `string` | JSON string matching ComparisonResult schema |
 *
 * TODO (Phase 5.5): Replace response outputMapping with full
 * ResearchCompassResponse after all 5 nodes are connected.
 */

// Flow: research-compass

export const meta = {
  "name": "Research Compass - Paper Intelligence & Comparison",
  "description": "Extracts paper metadata generates summaries and compares papers across dimensions",
  "tags": [],
  "testInput": {
    "papers": [
      {
        "id": "paper-1",
        "title": "Attention-Guided Transformer Network for Polyp Segmentation",
        "abstract": "We propose a transformer-based network with a multi-scale attention decoder for polyp segmentation in colonoscopy images."
      },
      {
        "id": "paper-2",
        "title": "Efficient U-Net with Depthwise Separable Convolutions",
        "abstract": "We present a lightweight U-Net architecture using depthwise separable convolutions for real-time polyp segmentation on edge devices."
      },
      {
        "id": "paper-3",
        "title": "Cross-Domain Polyp Segmentation via Style Transfer",
        "abstract": "We address domain shift in polyp segmentation using style transfer and domain adaptation techniques."
      }
    ],
    "researchArea": "Medical Image Segmentation"
  },
  "githubUrl": "",
  "documentationUrl": "",
  "deployUrl": ""
};

export const inputs = {
  "LLMNode_010": [
    {
      "name": "generativeModelName",
      "label": "Generative Model Name (Paper Intelligence)",
      "type": "model",
      "modelType": "generator/text",
      "mode": "chat",
      "description": "Select the model to extract paper intelligence.",
      "required": true,
      "defaultValue": [
        {
          "configName": "configA",
          "type": "generator/text",
          "provider_name": "",
          "credential_name": "",
          "params": {}
        }
      ],
      "typeOptions": {
        "loadOptionsMethod": "listModels"
      },
      "isPrivate": true
    }
  ],
  "LLMNode_020": [
    {
      "name": "generativeModelName",
      "label": "Generative Model Name (Comparison & Insights)",
      "type": "model",
      "modelType": "generator/text",
      "mode": "chat",
      "description": "Select the model to compare papers and generate insights.",
      "required": true,
      "defaultValue": [
        {
          "configName": "configA",
          "type": "generator/text",
          "provider_name": "",
          "credential_name": "",
          "params": {}
        }
      ],
      "typeOptions": {
        "loadOptionsMethod": "listModels"
      },
      "isPrivate": true
    }
  ]
};

export const references = {
  "constitutions": {
    "default": "@constitutions/default.md"
  },
  "prompts": {
    "paper_intelligence_system": "@prompts/paper-intelligence/system.md",
    "paper_intelligence_user": "@prompts/paper-intelligence/user.md",
    "comparison_system": "@prompts/comparison/system.md",
    "comparison_user": "@prompts/comparison/user.md"
  },
  "modelConfigs": {
    "paper_intelligence": "@model-configs/research-compass_paper-intelligence.ts",
    "comparison": "@model-configs/research-compass_comparison.ts"
  }
};

export const nodes = [
  {
    "id": "triggerNode_1",
    "data": {
      "modes": {},
      "nodeId": "graphqlNode",
      "values": {
        "id": "triggerNode_1",
        "nodeName": "API Request",
        "responeType": "realtime",
        "advance_schema": ""
      },
      "trigger": true
    },
    "type": "triggerNode",
    "measured": { "width": 218, "height": 95 },
    "position": { "x": 675, "y": 0 },
    "selected": false
  },
  {
    "id": "LLMNode_010",
    "data": {
      "label": "New",
      "modes": {},
      "nodeId": "LLMNode",
      "values": {
        "tools": [],
        "prompts": [
          {
            "id": "prompt-system-010",
            "role": "system",
            "content": "@prompts/paper-intelligence/system.md"
          },
          {
            "id": "prompt-user-010",
            "role": "user",
            "content": "@prompts/paper-intelligence/user.md"
          }
        ],
        "memories": "@model-configs/research-compass_paper-intelligence.ts",
        "messages": "@model-configs/research-compass_paper-intelligence.ts",
        "nodeName": "Paper Intelligence",
        "attachments": "@model-configs/research-compass_paper-intelligence.ts",
        "credentials": "@model-configs/research-compass_paper-intelligence.ts",
        "generativeModelName": "@model-configs/research-compass_paper-intelligence.ts"
      }
    },
    "type": "dynamicNode",
    "measured": { "width": 218, "height": 95 },
    "position": { "x": 675, "y": 300 },
    "selected": false
  },
  {
    "id": "LLMNode_020",
    "data": {
      "label": "New",
      "modes": {},
      "nodeId": "LLMNode",
      "values": {
        "tools": [],
        "prompts": [
          {
            "id": "prompt-system-020",
            "role": "system",
            "content": "@prompts/comparison/system.md"
          },
          {
            "id": "prompt-user-020",
            "role": "user",
            "content": "@prompts/comparison/user.md"
          }
        ],
        "memories": "@model-configs/research-compass_comparison.ts",
        "messages": "@model-configs/research-compass_comparison.ts",
        "nodeName": "Comparison & Insights",
        "attachments": "@model-configs/research-compass_comparison.ts",
        "credentials": "@model-configs/research-compass_comparison.ts",
        "generativeModelName": "@model-configs/research-compass_comparison.ts"
      }
    },
    "type": "dynamicNode",
    "measured": { "width": 218, "height": 95 },
    "position": { "x": 675, "y": 500 },
    "selected": false
  },
  {
    "id": "responseNode_triggerNode_1",
    "data": {
      "nodeId": "graphqlResponseNode",
      "values": {
        "id": "responseNode_triggerNode_1",
        "headers": "{}",
        "retries": "0",
        "nodeName": "API Response",
        "webhookUrl": "",
        "retry_delay": "0",
        "outputMapping": "{\n  \"result\": \"{{LLMNode_020.output.generatedResponse}}\"\n}"
      }
    },
    "type": "responseNode",
    "measured": { "width": 218, "height": 95 },
    "position": { "x": 675, "y": 700 },
    "selected": false
  }
];

export const edges = [
  {
    "id": "triggerNode_1-LLMNode_010",
    "type": "defaultEdge",
    "source": "triggerNode_1",
    "target": "LLMNode_010",
    "sourceHandle": "bottom",
    "targetHandle": "top"
  },
  {
    "id": "LLMNode_010-LLMNode_020",
    "type": "defaultEdge",
    "source": "LLMNode_010",
    "target": "LLMNode_020",
    "sourceHandle": "bottom",
    "targetHandle": "top"
  },
  {
    "id": "LLMNode_020-responseNode_triggerNode_1",
    "type": "defaultEdge",
    "source": "LLMNode_020",
    "target": "responseNode_triggerNode_1",
    "sourceHandle": "bottom",
    "targetHandle": "top"
  },
  {
    "id": "response-responseNode_triggerNode_1",
    "type": "responseEdge",
    "source": "triggerNode_1",
    "target": "responseNode_triggerNode_1",
    "sourceHandle": "to-response",
    "targetHandle": "from-trigger"
  }
];

export default { meta, inputs, references, nodes, edges };
