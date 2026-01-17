import { Suspense } from "react";
import EditorView from "./EditorView";
import * as serverDocService from "@/services/serverDocService";
import { redirect } from "next/navigation";
import Loading from "../../loading"; // Use dashboard loading or a specific one

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id === "new") {
    return {
      title: "New Document - MemMart",
    };
  }
  // Optional: fetch doc title for metadata
  // const doc = await serverDocService.getDocument(id);
  // return { title: `${doc.title} - MemMart` };
  // But be careful about performance, maybe unnecessary to double fetch if not cached?
  // NextJS dedupes requests, so it's fine.
  try {
      const doc = await serverDocService.getDocument(id);
      return { title: `${doc.title} - MemMart` };
  } catch {
      return { title: "Editor - MemMart" };
  }
}

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditorPage({ params }: PageProps) {
  const { id } = await params;
  
  if (id === "new") {
    return <EditorView isNew={true} />;
  }

  try {
    const doc = await serverDocService.getDocument(id);
    return <EditorView initialDoc={doc} />;
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      redirect("/login");
    }
    // Handle not found or other errors
    // We could return a "Not Found" UI or redirect to new
    console.error("Failed to load document on server", error);
    // Behave like valid new doc or show error?
    // Let's redirect to new for safety if ID invalid
    // Or throw to error boundary.
    throw error;
  }
}
