export interface Project {
  id: string;
  title: string;
  description: string;
  repository: string;
}

const API_URL = "https://localhost:7101";

export async function getProjects(): Promise<Project[]> {
  const response = await fetch(`${API_URL}/Projects`, {
    headers: {
      accept: "*/*",
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener proyectos");
  }

  return response.json();
}
