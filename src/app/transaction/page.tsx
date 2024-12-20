"use client";
import React, { useEffect, useState, Suspense } from "react";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Shell } from "@/components/shell";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";

// Define el tipo Income
export type Transaction = {
  id: string;
  amount: number;
  description: string;
  created_at: string;
  updated_at: string;
  type: "income" | "expense";
  id_category?: number | null;
};

function TransactionPage() {
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
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setIsLoading(false);
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

export default function Transaction() {
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <TransactionPage />
    </Suspense>
  );
}
