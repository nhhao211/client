import { Suspense } from "react";
import DocumentsView from "./DocumentsView";
import * as serverDocService from "@/services/serverDocService";
import { getFeaturesAction } from "@/app/serverActions";
import { redirect } from "next/navigation";
import Loading from "../loading"; // Reuse common loading

export const metadata = {
  title: "Documents - MemMart",
  description: "Manage your documents",
};

export default async function DocumentsPage() {
  try {
    const [docs, features] = await Promise.all([
      serverDocService.listDocuments(),
      getFeaturesAction()
    ]);
    return <DocumentsView initialDocs={docs} initialFeatures={features} />;
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      redirect("/logout");
    }
    throw error;
  }
}
