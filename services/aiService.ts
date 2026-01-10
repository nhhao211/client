import apiClient from "@/lib/axios";

interface RefineResponse {
  success: boolean;
  data: {
    content: string;
  };
}

export async function refine(content: string): Promise<string> {
  const response = await apiClient.post<RefineResponse>("/v1/ai/refine", { content });
  return response.data.data.content;
}
