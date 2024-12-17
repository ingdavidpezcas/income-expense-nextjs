"use client";
import * as React from "react";

import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Shell } from "@/components/shell";

import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";

// Define el tipo Income
type Transaction = {
  id: string;
  amount: number;
  description: string;
  id_category: number;
  created_at: string;
  actions: string;
};
export default function Transaction() {
  const [transaction, setExpense] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3030/transaction");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();

        console.log("Fetched data:", result); // Verifica el formato aquí
        setExpense(Array.isArray(result.data) ? result.data : []);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
          console.log(error);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setIsLoading(false);
        console.log(isLoading);
      }
    };

    fetchData();
  }, []);

  return (
    <Shell className="gap-2">
      <React.Suspense
        fallback={
          <DataTableSkeleton
            columnCount={5}
            cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
            shrinkZero
          />
        }
      >
        <DataTable columns={columns} data={transaction} />
      </React.Suspense>
    </Shell>
  );
}
