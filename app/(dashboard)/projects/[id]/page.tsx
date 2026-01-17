import { Suspense } from "react";
import ProjectBoardView from "../ProjectBoardView"; // Move View to [id] folder? Or shared? Let's put in [id] folder if possible or just import.
// Actually I put ProjectBoardView in ../ProjectBoardView.tsx which is weird.
// Let's assume I created it in `client/app/(dashboard)/projects/ProjectBoardView.tsx` but user asked for [id]/page.tsx refactor.
// Ah, ProjectBoardView is for single project view.
// Let's correct file location in next step if needed, but for now lets write page.

import * as serverProjectService from "@/services/serverProjectService";
import { redirect } from "next/navigation";
import Loading from "../../loading"; // Use dashboard loading

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
      const project = await serverProjectService.getProject(id);
      return { title: `${project.title} - MemMart` };
  } catch {
      return { title: "Project Board - MemMart" };
  }
}

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ProjectBoardPage({ params }: PageProps) {
  const { id } = await params;
  
  try {
    const project = await serverProjectService.getProject(id);
    return <ProjectBoardView initialProject={project} />;
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      redirect("/login");
    }
    // Handle error
    console.error("Failed to load project", error);
    // throw error; // or redirect to list
    redirect("/projects");
  }
}
