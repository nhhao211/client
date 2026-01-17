import { Suspense } from "react";
import DashboardView from "./DashboardView";
import * as serverDocService from "@/services/serverDocService";
import { redirect } from "next/navigation";
import Loading from "../loading";

export const metadata = {
  title: "Dashboard - MemMart",
  description: "Manage your documents and projects",
};

export default async function DashboardPage() {
  try {
    const documents = await serverDocService.listDocuments();
    return <DashboardView initialDocuments={documents} />;
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      redirect("/login");
    }
    throw error; // Let error.tsx handle other errors
  }
}
