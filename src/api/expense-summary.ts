import type { NextApiRequest, NextApiResponse } from "next";

const EXPENSE_API_URL = "http://localhost:3030/expense?sum=true"; // URL de tu API de Feathers

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Llamada al backend de Feathers
    const response = await fetch(EXPENSE_API_URL);
    const result = await response.json();

    // Enviar la respuesta al frontend
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching expense summary:", error);
    res.status(500).json({ error: "Error fetching expense summary" });
  }
}
