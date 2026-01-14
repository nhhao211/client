import apiClient from "@/lib/axios";

interface RefineResponse {
  success: boolean;
  data: {
    content: string;
  };
}

interface GenerateDiagramResponse {
  success: boolean;
  data: {
    code: string;
  };
}

export async function refine(content: string): Promise<string> {
  const response = await apiClient.post<RefineResponse>("/v1/ai/refine", { content });
  return response.data.data.content;
}

export async function generateDiagram(prompt: string, type: string = "flowchart"): Promise<string> {
  const response = await apiClient.post<GenerateDiagramResponse>("/v1/ai/generate-diagram", { 
    prompt, 
    type 
  });
  return response.data.data.code;
}
