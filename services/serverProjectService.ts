import { cookies } from "next/headers";
import { Project } from "./projectService";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function listProjects(): Promise<Project[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${API_URL}/v1/projects`, {
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
    throw new Error("Failed to fetch projects");
  }

  const data = await res.json();
  return data.data.projects;
}

export async function getProject(id: string | number): Promise<Project> {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${API_URL}/v1/projects/${id}`, {
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
    throw new Error("Failed to fetch project");
  }

  const data = await res.json();
  return data.data.project;
}
