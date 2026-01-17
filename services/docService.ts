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
  featureId?: number | null;
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

/**
 * Export a document as DOCX
 */
export async function exportDocumentAsDocx(id: string | number, fileName?: string): Promise<void> {
  try {
    console.log(`Requesting export for doc ${id}`);
    const response = await apiClient.get(`/v1/docs/${id}/export/docx`, {
      responseType: 'blob'
    });

    console.log("Export response received:", response);
    console.log("Blob size:", response.data.size);
    console.log("Blob type:", response.data.type);

    if (response.data.type === 'application/json') {
        const text = await response.data.text();
        console.error("Received JSON instead of blob:", text);
        throw new Error("Server returned JSON error: " + text);
    }

    // Create a blob URL and trigger download
    const blobUrl = window.URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName || `document-${id}.docx`;
    document.body.appendChild(link);
    link.click();
    
    // Delay cleanup to ensure download starts
    setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
        console.log("Download cleanup done");
    }, 100);
    
    console.log("Download triggered");
  } catch (error) {
    console.error('Failed to export document:', error);
    throw error;
  }
}
