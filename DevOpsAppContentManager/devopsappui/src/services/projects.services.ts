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

const API_URL = import.meta.env.VITE_API_URL;

export async function getProjects(): Promise<Project[]> {
  const response = await fetch(`${API_URL}/Projects`, {
    headers: { accept: "*/*" },
  });

  if (!response.ok) throw new Error("Error al obtener proyectos");
  return response.json();
}

export async function insertProject(payload: ProjectDtoToInsert): Promise<Project> {
  const response = await fetch(`${API_URL}/Projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "*/*",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    // intenta leer el error del backend (tu controller devuelve string si falla)
    const msg = await response.text().catch(() => "");
    throw new Error(msg || "Error al insertar proyecto");
  }

  return response.json();
}
