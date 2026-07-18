/*
 * # Research Compass — Full Pipeline (5 Nodes)
 *
 * ## Purpose
 * Complete Research Compass pipeline that reads research papers, extracts
 * structured metadata, compares methodologies, detects research gaps,
 * proposes future directions, and generates a literature review.
 *
 * ## Pipeline
 *   Trigger (GraphQLInput)
 *     ↓
 *   Node 1 — Paper Intelligence (PaperIntelligenceOutput)
 *     ↓
 *   Node 2 — Comparison & Insights (ComparisonResult)
 *     ↓
 *   Node 3 — Gap Detector (GapAnalysis)
 *     ↓
 *   Node 4 — Research Idea Generator (ResearchIdeaGeneratorOutput)
 *     ↓
 *   Node 5 — Literature Review (LiteratureReview)
 *     ↓
 *   Response (ResearchCompassResponse)
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
 * | `result` | `object` | ResearchCompassResponse with all node outputs |
 *
 * PROVISIONAL — Response mapping assumes the Response Node can reference
 * multiple upstream node outputs via {{nodeId.output.generatedResponse}}.
 * If Lamatic treats LLM output as a JSON string rather than a parsed object,
 * this mapping will return string values. Verify at runtime and adjust
 * (add Code Node or parse in orchestrate.ts) if needed.
 *
 * ## Dependencies
 * - Lamatic API runtime
 * - LLM provider for text generation (5 nodes, generator/text, chat mode)
 * - Constitutions applied at runtime
 */

// Flow: research-compass

export const meta = {
  "name": "Research Compass - Full Pipeline",
  "description": "Extracts paper metadata compares papers detects gaps generates research ideas and produces a literature review",
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
      "label": "Generative Model (Paper Intelligence)",
      "type": "model",
      "modelType": "generator/text",
      "mode": "chat",
      "description": "Select model for paper intelligence extraction.",
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
      "typeOptions": { "loadOptionsMethod": "listModels" },
      "isPrivate": true
    }
  ],
  "LLMNode_020": [
    {
      "name": "generativeModelName",
      "label": "Generative Model (Comparison & Insights)",
      "type": "model",
      "modelType": "generator/text",
      "mode": "chat",
      "description": "Select model for paper comparison.",
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
      "typeOptions": { "loadOptionsMethod": "listModels" },
      "isPrivate": true
    }
  ],
  "LLMNode_030": [
    {
      "name": "generativeModelName",
      "label": "Generative Model (Gap Detector)",
      "type": "model",
      "modelType": "generator/text",
      "mode": "chat",
      "description": "Select model for gap detection.",
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
      "typeOptions": { "loadOptionsMethod": "listModels" },
      "isPrivate": true
    }
  ],
  "LLMNode_040": [
    {
      "name": "generativeModelName",
      "label": "Generative Model (Idea Generator)",
      "type": "model",
      "modelType": "generator/text",
      "mode": "chat",
      "description": "Select model for research idea generation.",
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
      "typeOptions": { "loadOptionsMethod": "listModels" },
      "isPrivate": true
    }
  ],
  "LLMNode_050": [
    {
      "name": "generativeModelName",
      "label": "Generative Model (Literature Review)",
      "type": "model",
      "modelType": "generator/text",
      "mode": "chat",
      "description": "Select model for literature review generation.",
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
      "typeOptions": { "loadOptionsMethod": "listModels" },
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
    "comparison_user": "@prompts/comparison/user.md",
    "gap_detector_system": "@prompts/gap-detector/system.md",
    "gap_detector_user": "@prompts/gap-detector/user.md",
    "idea_generator_system": "@prompts/idea-generator/system.md",
    "idea_generator_user": "@prompts/idea-generator/user.md",
    "literature_review_system": "@prompts/literature-review/system.md",
    "literature_review_user": "@prompts/literature-review/user.md"
  },
  "modelConfigs": {
    "paper_intelligence": "@model-configs/research-compass_paper-intelligence.ts",
    "comparison": "@model-configs/research-compass_comparison.ts",
    "gap_detector": "@model-configs/research-compass_gap-detector.ts",
    "idea_generator": "@model-configs/research-compass_idea-generator.ts",
    "literature_review": "@model-configs/research-compass_literature-review.ts"
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
          { "id": "prompt-system-010", "role": "system", "content": "@prompts/paper-intelligence/system.md" },
          { "id": "prompt-user-010", "role": "user", "content": "@prompts/paper-intelligence/user.md" }
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
    "position": { "x": 675, "y": 150 },
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
          { "id": "prompt-system-020", "role": "system", "content": "@prompts/comparison/system.md" },
          { "id": "prompt-user-020", "role": "user", "content": "@prompts/comparison/user.md" }
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
    "position": { "x": 675, "y": 300 },
    "selected": false
  },
  {
    "id": "LLMNode_030",
    "data": {
      "label": "New",
      "modes": {},
      "nodeId": "LLMNode",
      "values": {
        "tools": [],
        "prompts": [
          { "id": "prompt-system-030", "role": "system", "content": "@prompts/gap-detector/system.md" },
          { "id": "prompt-user-030", "role": "user", "content": "@prompts/gap-detector/user.md" }
        ],
        "memories": "@model-configs/research-compass_gap-detector.ts",
        "messages": "@model-configs/research-compass_gap-detector.ts",
        "nodeName": "Gap Detector",
        "attachments": "@model-configs/research-compass_gap-detector.ts",
        "credentials": "@model-configs/research-compass_gap-detector.ts",
        "generativeModelName": "@model-configs/research-compass_gap-detector.ts"
      }
    },
    "type": "dynamicNode",
    "measured": { "width": 218, "height": 95 },
    "position": { "x": 675, "y": 450 },
    "selected": false
  },
  {
    "id": "LLMNode_040",
    "data": {
      "label": "New",
      "modes": {},
      "nodeId": "LLMNode",
      "values": {
        "tools": [],
        "prompts": [
          { "id": "prompt-system-040", "role": "system", "content": "@prompts/idea-generator/system.md" },
          { "id": "prompt-user-040", "role": "user", "content": "@prompts/idea-generator/user.md" }
        ],
        "memories": "@model-configs/research-compass_idea-generator.ts",
        "messages": "@model-configs/research-compass_idea-generator.ts",
        "nodeName": "Research Idea Generator",
        "attachments": "@model-configs/research-compass_idea-generator.ts",
        "credentials": "@model-configs/research-compass_idea-generator.ts",
        "generativeModelName": "@model-configs/research-compass_idea-generator.ts"
      }
    },
    "type": "dynamicNode",
    "measured": { "width": 218, "height": 95 },
    "position": { "x": 675, "y": 600 },
    "selected": false
  },
  {
    "id": "LLMNode_050",
    "data": {
      "label": "New",
      "modes": {},
      "nodeId": "LLMNode",
      "values": {
        "tools": [],
        "prompts": [
          { "id": "prompt-system-050", "role": "system", "content": "@prompts/literature-review/system.md" },
          { "id": "prompt-user-050", "role": "user", "content": "@prompts/literature-review/user.md" }
        ],
        "memories": "@model-configs/research-compass_literature-review.ts",
        "messages": "@model-configs/research-compass_literature-review.ts",
        "nodeName": "Literature Review Generator",
        "attachments": "@model-configs/research-compass_literature-review.ts",
        "credentials": "@model-configs/research-compass_literature-review.ts",
        "generativeModelName": "@model-configs/research-compass_literature-review.ts"
      }
    },
    "type": "dynamicNode",
    "measured": { "width": 218, "height": 95 },
    "position": { "x": 675, "y": 750 },
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
        "outputMapping": "{\n  \"result\": {\n    \"metadata\": {\n      \"name\": \"Research Compass\",\n      \"version\": \"1.0.0\"\n    },\n    \"paperIntelligence\": \"{{LLMNode_010.output.generatedResponse}}\",\n    \"comparison\": \"{{LLMNode_020.output.generatedResponse}}\",\n    \"gaps\": \"{{LLMNode_030.output.generatedResponse}}\",\n    \"futureWork\": \"{{LLMNode_040.output.generatedResponse}}\",\n    \"literatureReview\": \"{{LLMNode_050.output.generatedResponse}}\"\n  }\n}"
      }
    },
    "type": "responseNode",
    "measured": { "width": 218, "height": 95 },
    "position": { "x": 675, "y": 900 },
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
    "id": "LLMNode_020-LLMNode_030",
    "type": "defaultEdge",
    "source": "LLMNode_020",
    "target": "LLMNode_030",
    "sourceHandle": "bottom",
    "targetHandle": "top"
  },
  {
    "id": "LLMNode_030-LLMNode_040",
    "type": "defaultEdge",
    "source": "LLMNode_030",
    "target": "LLMNode_040",
    "sourceHandle": "bottom",
    "targetHandle": "top"
  },
  {
    "id": "LLMNode_040-LLMNode_050",
    "type": "defaultEdge",
    "source": "LLMNode_040",
    "target": "LLMNode_050",
    "sourceHandle": "bottom",
    "targetHandle": "top"
  },
  {
    "id": "LLMNode_050-responseNode_triggerNode_1",
    "type": "defaultEdge",
    "source": "LLMNode_050",
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
