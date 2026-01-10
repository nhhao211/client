import apiClient from "@/lib/axios";

/**
 * Document Service - API calls for document management
 */

export interface Document {
  id: number;
  title: string;
  content: string;
  status: "draft" | "archived";
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDocumentRequest {
  title?: string;
  content?: string;
}

export interface UpdateDocumentRequest {
  title?: string;
  content?: string;
  status?: "draft" | "archived";
  isFavorite?: boolean;
}

/**
 * Create a new document
 */
export async function createDocument(
  data: CreateDocumentRequest
): Promise<Document> {
  const response = await apiClient.post<{ success: boolean; data: { document: Document } }>(
    "/v1/docs",
    data
  );
  return response.data.data.document;
}

/**
 * Get all documents for current user
 */
export async function listDocuments(): Promise<Document[]> {
  const response = await apiClient.get<{ success: boolean; data: { documents: Document[] } }>(
    "/v1/docs"
  );
  return response.data.data.documents;
}

/**
 * Get a specific document by ID
 */
export async function getDocument(id: string | number): Promise<Document> {
  const response = await apiClient.get<{ success: boolean; data: { document: Document } }>(
    `/v1/docs/${id}`
  );
  return response.data.data.document;
}

/**
 * Update a document
 */
export async function updateDocument(
  id: string | number,
  data: UpdateDocumentRequest
): Promise<Document> {
  const response = await apiClient.put<{ success: boolean; data: { document: Document } }>(
    `/v1/docs/${id}`,
    data
  );
  return response.data.data.document;
}

/**
 * Delete a document
 */
export async function deleteDocument(id: string | number): Promise<void> {
  await apiClient.delete(`/v1/docs/${id}`);
}
