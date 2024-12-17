"use client";
import React from "react";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddExpense from "./addExpense";
import { Shell } from "@/components/shell";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";

// Define el tipo Income
type Expense = {
  id: string;
  amount: number;
  description: string;
  id_category: number;
  created_at: string;
  actions: string;
};

export default function Expenses() {
  const [expense, setExpense] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3030/expense");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();

        console.log("Fetched data:", result); // Verifica el formato aquí
        const expensesData = Array.isArray(result.data) ? result.data : [];
        //setExpense(Array.isArray(result.data) ? result.data : []);
        setExpense(expensesData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
          setError(error);
        } else {
          setError("An unexpected error occurred");
          setError(error);
        }
      } finally {
        setIsLoading(false);
        setIsLoading(isLoading);
      }
    };

    fetchData();
  }, [error, isLoading]);

  return (
    <div className="flex flex-1 flex-col gap-2 p-0 py-2">
      <Shell className="gap-2 pb-4 pt-0 md:py-0">
        <div className="container mx-auto pb-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex">
              <h1 className="text-2xl">Expense</h1>
              <p className="truncate"></p>
            </div>
            <div className="flex items-center justify-end gap-2">
              <AddExpense />
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
        <div className="flex flex-col gap-6"></div>
        <React.Suspense
          fallback={
            <DataTableSkeleton
              columnCount={5}
              cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
              shrinkZero
            />
          }
        >
          {/* Muestra la tabla solo cuando los datos se han cargado */}
          <DataTable columns={columns} data={expense} />
        </React.Suspense>
      </Shell>
    </div>
  );
}
