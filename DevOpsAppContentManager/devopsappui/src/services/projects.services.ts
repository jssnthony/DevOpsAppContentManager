export interface Project {
  id: string;
  title: string;
  description: string;
  repository: string;
}

export interface ProjectDtoToInsert {
  title: string;
  description?: string | null;
  repository?: string | null;
}

export interface ProjectDtoToUpdate {
  id: string; // IMPORTANTÍSIMO para tu backend
  title: string;
  description?: string | null;
  repository?: string | null;
}

export type ProjectsStats = {
  totalItems: number;
};

const API_URL = import.meta.env.VITE_API_URL;

export async function getProjectsStats(): Promise<ProjectsStats> {
  const response = await fetch(`${API_URL}/Projects/stats`, {
    headers: { accept: "*/*" },
  });

  if (!response.ok) throw new Error("Error al obtener stats de proyectos");

  return response.json() as Promise<ProjectsStats>;
}

export async function getProjects(): Promise<Project[]> {
  const response = await fetch(`${API_URL}/Projects`, {
    headers: { accept: "*/*" },
  });
  if (!response.ok) throw new Error("Error al obtener proyectos");
  return response.json();
}

export async function getProjectById(id: string): Promise<Project> {
  const response = await fetch(`${API_URL}/Projects/${id}`, {
    headers: { accept: "*/*" },
  });

  if (!response.ok) {
    const msg = await response.text().catch(() => "");
    throw new Error(msg || "Error al obtener el proyecto");
  }

  return response.json();
}

export async function insertProject(payload: ProjectDtoToInsert): Promise<Project> {
  const response = await fetch(`${API_URL}/Projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json", accept: "*/*" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const msg = await response.text().catch(() => "");
    throw new Error(msg || "Error al insertar proyecto");
  }

  return response.json();
}

export async function updateProject(id: string, payload: Omit<ProjectDtoToUpdate, "id">): Promise<Project> {
  // el backend valida que route id == body id
  const body: ProjectDtoToUpdate = {
    id,
    title: payload.title,
    description: payload.description ?? null,
    repository: payload.repository ?? null,
  };

  const response = await fetch(`${API_URL}/Projects/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", accept: "*/*" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const msg = await response.text().catch(() => "");
    throw new Error(msg || "Error al actualizar el proyecto");
  }

  return response.json();
}
