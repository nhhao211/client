import { Suspense } from "react";
import DocumentsView from "./DocumentsView";
import * as serverDocService from "@/services/serverDocService";
import { redirect } from "next/navigation";
import Loading from "../loading"; // Reuse common loading

export const metadata = {
  title: "Documents - MemMart",
  description: "Manage your documents",
};

export default async function DocumentsPage() {
  try {
    const docs = await serverDocService.listDocuments();
    return <DocumentsView initialDocs={docs} />;
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      redirect("/login");
    }
    throw error;
  }
}
