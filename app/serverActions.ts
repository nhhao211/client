'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get('authToken')?.value;
}

// Documents
export async function createDocumentAction(data: { title: string; content?: string }) {
  const token = await getToken();
  if (!token) throw new Error("Unauthorized");

  const res = await fetch(`${API_URL}/v1/docs`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create document");
  
  const json = await res.json();
  revalidatePath('/documents');
  return json.data.document;
}

export async function updateDocumentAction(id: number | string, data: { title?: string; content?: string; isFavorite?: boolean }) {
  const token = await getToken();
  if (!token) throw new Error("Unauthorized");

  const res = await fetch(`${API_URL}/v1/docs/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to update document");
  
  const json = await res.json();
  revalidatePath('/documents');
  revalidatePath(`/editor/${id}`);
  return json.data.document;
}

export async function deleteDocumentAction(id: number | string) {
  const token = await getToken();
  if (!token) throw new Error("Unauthorized");

  const res = await fetch(`${API_URL}/v1/docs/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete document");
  
  revalidatePath('/documents');
}

export async function bulkDeleteDocumentsAction(ids: number[]) {
  const token = await getToken();
  if (!token) throw new Error("Unauthorized");

  // We'll execute these in parallel for better performance
  const deletePromises = ids.map(id => 
    fetch(`${API_URL}/v1/docs/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  );

  const results = await Promise.allSettled(deletePromises);
  
  // Check if any failed
  const failed = results.some(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.ok));
  
  if (failed && results.every(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.ok))) {
      throw new Error("Failed to delete documents");
  }

  revalidatePath('/documents');
}

// Projects
export async function createProjectAction(data: { title: string; description?: string }) {
    const token = await getToken();
    if (!token) throw new Error("Unauthorized");
  
    const res = await fetch(`${API_URL}/v1/projects`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    if (!res.ok) throw new Error("Failed to create project");
    
    const json = await res.json();
    revalidatePath('/projects');
    return json.data.project;
  }
  
  export async function updateProjectAction(id: number | string, data: { title?: string; description?: string; status?: string }) {
    const token = await getToken();
    if (!token) throw new Error("Unauthorized");
  
    const res = await fetch(`${API_URL}/v1/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    if (!res.ok) throw new Error("Failed to update project");
    
    const json = await res.json();
    revalidatePath('/projects');
    revalidatePath(`/projects/${id}`);
    return json.data.project;
  }
  
  export async function deleteProjectAction(id: number | string) {
    const token = await getToken();
    if (!token) throw new Error("Unauthorized");
  
    const res = await fetch(`${API_URL}/v1/projects/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  
    if (!res.ok) throw new Error("Failed to delete project");
    
    revalidatePath('/projects');
  }

  // Tasks
  export async function createTaskAction(columnId: number | string, data: any) {
    const token = await getToken();
    if (!token) throw new Error("Unauthorized");

    const res = await fetch(`${API_URL}/v1/projects/columns/${columnId}/tasks`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to create task");
    
    const json = await res.json();
    // We don't know the project ID here easily without returning it or passing it.
    // Ideally we revalidate the specific project page.
    // For now we can revalidate all projects or try to get project ID.
    // Assuming the user is on the board page, client side updates might be faster, 
    // but we should revalidate to keep cache fresh.
    // Let's pass projectId if possible or accept we might not revalidate strictly right 
    // (though cache: no-store in getProject helps).
    // revalidatePath(`/projects/${projectId}`); // We'd need projectId.
    // Let's rely on client state update + 'no-store' in fetch for now, 
    // OR we could return the project ID from backend.
    
    return json.data.task;
  }

  export async function updateTaskAction(taskId: number | string, data: any) {
    const token = await getToken();
    if (!token) throw new Error("Unauthorized");

    const res = await fetch(`${API_URL}/v1/projects/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to update task");
    
    const json = await res.json();
    return json.data.task;
  }

  export async function deleteTaskAction(taskId: number | string) {
    const token = await getToken();
    if (!token) throw new Error("Unauthorized");

    const res = await fetch(`${API_URL}/v1/projects/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!res.ok) throw new Error("Failed to delete task");
  }
