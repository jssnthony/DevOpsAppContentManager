export type ProjectTaskDtoToInsert = {
  title: string;
  description?: string | null;
};

export type ProjectTaskRowDto = {
  taskId: string;
  taskTitle: string;
  taskDescription?: string | null;
  taskProgressStatus: number;
  taskPriority: number;
  taskCreatedAt?: string | null;
  taskUpdatedAt?: string | null;

  projectId: string;
  projectTitle?: string;
};

const API_URL = import.meta.env.VITE_API_URL;

export async function getAllTasks(): Promise<ProjectTaskRowDto[]> {
  const response = await fetch(`${API_URL}/ProjectsTasks`);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Error obteniendo tareas");
  }

  return await response.json();
}

export async function insertTask(
  projectId: string,
  payload: ProjectTaskDtoToInsert
) {
  const response = await fetch(`${API_URL}/ProjectsTasks/${projectId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Error insertando tarea");
  }

  return await response.json();
}
