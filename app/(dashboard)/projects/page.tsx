import { Suspense } from "react";
import ProjectsView from "./ProjectsView";
import * as serverProjectService from "@/services/serverProjectService";
import { redirect } from "next/navigation";
import Loading from "../loading";

export const metadata = {
  title: "Projects - MemMart",
  description: "Manage your projects",
};

export default async function ProjectsPage() {
  try {
    const projects = await serverProjectService.listProjects();
    return <ProjectsView initialProjects={projects} />;
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      redirect("/login");
    }
    throw error;
  }
}
