"use client";
import React, { useEffect, useState, Suspense } from "react";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import AddIncome from "./addIncome";
import { Download, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define el tipo Income
type Income = {
  id: string;
  status: "pending" | "processing" | "success" | "failed";
  amount: number;
  description: string;
  id_category: number;
  name_category: string;
  created_at: string;
  actions: string;
};

type Category = {
  id_category: number;
  name_category: string;
};

function IncomePage() {
  const [income, setIncome] = useState<Income[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  console.log(categories);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Hacemos las dos peticiones en paralelo
        const [incomeResponse, categoriesResponse] = await Promise.all([
          fetch("http://localhost:3030/income"),
          fetch("http://localhost:3030/categories"), // Asegúrate de tener esta API disponible
        ]);

        if (!incomeResponse.ok || !categoriesResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const incomeResult = await incomeResponse.json();
        const categoriesResult = await categoriesResponse.json();

        console.log("Fetched data:", incomeResult);
        console.log("Fetched categories:", categoriesResult);

        // Verifica si las respuestas tienen la estructura esperada
        const incomeData = Array.isArray(incomeResult.data)
          ? incomeResult.data
          : [];
        const categoriesData = Array.isArray(categoriesResult.data)
          ? categoriesResult.data
          : [];

        // Mapea los nombres de categorías a los datos de income
        const incomeWithCategoryNames = incomeData.map((item: Income) => {
          const category = categoriesData.find(
            (category: Category) =>
              category.id_category === Number(item.id_category)
          );
          return {
            ...item,
            name_category: category ? category.name_category : "Unknown",
          };
        });

        setIncome(incomeWithCategoryNames);
        setCategories(categoriesData); // Si necesitas usar las categorías por alguna razón
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-2 p-0 py-2">
      {/* <h1>Dashboard</h1> */}
      <div className="container mx-auto pb-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex">
            <div className="flex items-center justify-end gap-4">
              <span className="p-2 bg-slate-200 rounded">
                <CreditCard />
              </span>
              <div className="flex flex-col gap-0">
                <h3 className="text-xl font-semibold">Income</h3>
                <span className="text-xs">Colocar algo aqui para rellenar</span>
              </div>
            </div>

            <p className="truncate"></p>
          </div>
          <div className="flex items-center justify-end gap-2">
            <AddIncome />
            <Button className="px-8 py-2 rounded-xl text-xs h-10 button_inc_exp_secondary">
              <Download />
              Donwload
            </Button>
            <Button
              className="px-8 py-2 rounded-xl text-xs h-10 button_inc_exp_primary"
              variant="secondary"
            >
              Add Income
            </Button>
          </div>
        </div>
      </div>
      {/* Muestra la tabla solo cuando los datos se han cargado */}
      <DataTable columns={columns} data={income} />
    </div>
  );
}

export default function Income() {
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <IncomePage />
    </Suspense>
  );
}
