import { cookies } from "next/headers";
import { Document } from "./docService";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function listDocuments(): Promise<Document[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${API_URL}/v1/docs`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store", // Ensure dynamic data
  });

  if (!res.ok) {
        if (res.status === 401) {
             throw new Error("Unauthorized");
        }
    throw new Error("Failed to fetch documents");
  }

  const data = await res.json();
  return data.data.documents;
}

export async function getDocument(id: string | number): Promise<Document> {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${API_URL}/v1/docs/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

   if (!res.ok) {
        if (res.status === 401) {
             throw new Error("Unauthorized");
        }
    throw new Error("Failed to fetch document");
  }

  const data = await res.json();
  return data.data.document;
}
