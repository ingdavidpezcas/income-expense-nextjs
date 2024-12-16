// Obtener categorias
interface Category {
  id_category: number;
  name_category: string;
  type: string;
}
export const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch("http://localhost:3030/categories");
  if (!response.ok) {
    throw new Error("Error al cargar las categorías");
  }
  const responseData = await response.json();
  return Array.isArray(responseData.data) ? responseData.data : [];
};
