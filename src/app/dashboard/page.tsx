"use client";
import React, { useEffect, useState, Suspense } from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ExpenseData {
  total: number;
  startOfMonth: string;
  today: string;
}

interface IncomeData {
  totalIncome: number;
  startOfMonthIncome: string;
  todayIncome: string;
}

// Tipos definidos
interface Transaction {
  id: number;
  amount: number;
  description: string;
  created_at: string;
  updated_at: string;
  type: "income" | "expense";
  id_category?: number | null;
}

interface TransactionResponse {
  total: number;
  data: Transaction[];
}

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--chart-1))",
  },
  expense: {
    label: "Expense",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

function DashboardPage() {
  const [expenseData, setExpenseData] = useState<ExpenseData | null>(null);
  const [incomeData, setIncomeData] = useState<IncomeData | null>(null);
  const [transactionData, settransactionData] =
    useState<TransactionResponse | null>(null);

  // Función para formatear el valor como moneda
  const formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString("es-CO")}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch total income
        const incomeResponse = await fetch(
          "http://localhost:3030/income?sum=true"
        );
        if (!incomeResponse.ok) {
          throw new Error(
            `Error en la API de income: ${incomeResponse.status}`
          );
        }
        const incomeData = await incomeResponse.json();
        setIncomeData(incomeData);
        console.log("Income:", incomeData);

        // Fetch total expense
        const expenseResponse = await fetch(
          "http://localhost:3030/expense?sum=true"
        );
        if (!expenseResponse.ok) {
          throw new Error(
            `Error en la API de expense: ${expenseResponse.status}`
          );
        }
        if (
          expenseResponse.headers
            .get("Content-Type")
            ?.includes("application/json")
        ) {
          const expenseData = await expenseResponse.json();
          setExpenseData(expenseData);
          console.log("Expense:", expenseData);
        } else {
          throw new Error("La respuesta no es JSON válida");
        }

        // Fetch total transaction
        const transactionResponse = await fetch(
          "http://localhost:3030/transaction"
        );
        if (!transactionResponse.ok) {
          throw new Error(
            `Error en la API de income: ${transactionResponse.status}`
          );
        }
        const transactionData = await transactionResponse.json();
        settransactionData(transactionData);
        //console.log("transacion:", transactionData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Comprobación para asegurarse de que ambos expenseData e incomeData no sean null
  if (!expenseData || !incomeData || !transactionData) {
    return <div>Loading...</div>; // Mostrar un mensaje de carga mientras los datos se obtienen
  }

  const { total, startOfMonth, today } = expenseData;
  const { totalIncome, startOfMonthIncome, todayIncome } = incomeData;

  // Obtener los totales desde enero hasta diciembre
  const getMonthLabel = (month: number) => {
    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    return months[month];
  };

  const formatDate = (date: string | Date) => {
    const newDate = new Date(date);
    const utcDate = new Date(
      Date.UTC(
        newDate.getUTCFullYear(),
        newDate.getUTCMonth(),
        newDate.getUTCDate()
      )
    );
    return utcDate.toLocaleDateString("es-CO");
  };

  // Establecer el valor de cada mes según los datos reales
  const monthsData = Array.from({ length: 12 }, (_, monthIndex) => {
    const currentMonth = new Date().getMonth(); // Mes actual (0-11)

    // Inicializar los valores por defecto en 0
    let incomeByMonth = 0;
    let expenseByMonth = 0;

    // Verificar si hay datos para este mes y asignarlos
    if (monthIndex <= currentMonth) {
      const incomeStartDate = new Date(incomeData.startOfMonthIncome);
      const expenseStartDate = new Date(expenseData.startOfMonth);

      // Asegurarse de que las fechas no tengan horas no deseadas (setear a medianoche)
      incomeStartDate.setHours(0, 0, 0, 0);
      expenseStartDate.setHours(0, 0, 0, 0);

      // Si el mes es el mes actual y los datos corresponden a este mes
      if (monthIndex === currentMonth) {
        incomeByMonth = incomeData.totalIncome;
        expenseByMonth = expenseData.total;
      }
      // Si el mes de inicio de los datos es el mes actual
      else if (monthIndex === incomeStartDate.getMonth()) {
        incomeByMonth = incomeData.totalIncome;
      } else if (monthIndex === expenseStartDate.getMonth()) {
        expenseByMonth = expenseData.total;
      }
    }

    return {
      month: getMonthLabel(monthIndex),
      income: incomeByMonth,
      expense: expenseByMonth,
    };
  });

  const chartData = monthsData.map((monthData) => ({
    month: monthData.month,
    income: monthData.income,
    expense: monthData.expense,
  }));
  //console.log(chartData);

  return (
    <div className="flex flex-1 flex-col gap-4 p-0 py-2">
      <div className="container">
        <div className="flex mb-4">
          <div className="w-full grid grid-cols-3 gap-4">
            <article className="rounded-2xl border border-gray-100 bg-white p-6 background-income">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm mb-4 text-gray-500">
                    Total monthly expenses
                  </p>

                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(total)}
                    <span className="text-sm ml-1.5 font-bold">COP</span>
                  </p>
                </div>

                <span className="rounded-full bg-blue-100 p-3 text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </span>
              </div>

              <div className="mt-1 flex gap-1 text-red-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                  />
                </svg>

                <p className="flex gap-2 text-xs">
                  <span className="font-medium"> 67.81% </span>
                  <span className="text-gray-500"> Since last week </span>
                </p>
              </div>
              <div>
                <p className="flex gap-2 text-xs">
                  <span className="text-gray-500">
                    {" "}
                    Desde: {new Date(startOfMonth).toLocaleDateString(
                      "es-CO"
                    )}{" "}
                    hasta as hoy: {formatDate(today)}
                  </span>
                </p>
              </div>
            </article>
            <article className="rounded-2xl border border-gray-100 bg-white p-6 background-expense">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm mb-4 text-gray-500">
                    Total monthly income
                  </p>

                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(totalIncome)}
                    <span className="text-sm ml-1.5 font-bold">COP</span>
                  </p>
                </div>

                <span className="rounded-full bg-blue-100 p-3 text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </span>
              </div>

              <div className="mt-1 flex gap-1 text-green-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>

                <p className="flex gap-2 text-xs">
                  <span className="font-medium"> 67.81% </span>

                  <span className="text-gray-500"> Since last week </span>
                </p>
              </div>
              <div>
                <p className="flex gap-2 text-xs">
                  <span className="text-gray-500">
                    {" "}
                    Desde: {formatDate(startOfMonthIncome)} hasta hoy:{" "}
                    {formatDate(todayIncome)}
                  </span>
                </p>
              </div>
            </article>
            <article className="rounded-2xl border border-gray-100 bg-white p-6 background-diference">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Profit</p>

                  <p className="text-2xl font-medium text-gray-900">$240.94</p>
                </div>

                <span className="rounded-full bg-blue-100 p-3 text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </span>
              </div>

              <div className="mt-1 flex gap-1 text-red-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                  />
                </svg>

                <p className="flex gap-2 text-xs">
                  <span className="font-medium"> 67.81% </span>

                  <span className="text-gray-500"> Since last week </span>
                </p>
              </div>
            </article>
          </div>
        </div>
        <div className="flex gap-4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Income - Expenses</CardTitle>
              <CardDescription>January - December 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <BarChart accessibilityLayer data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="income"
                    stackId="a"
                    fill="#dbeafe"
                    radius={[0, 0, 4, 4]}
                  />
                  <Bar
                    dataKey="expense"
                    stackId="a"
                    fill="#ffb0b0"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 font-medium leading-none">
                Trending up by 5.2% this month{" "}
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="leading-none text-muted-foreground">
                Showing total visitors for the last 6 months
              </div>
            </CardFooter>
          </Card>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
              <CardDescription>Recent activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flow-root">
                <ul role="list" className="divide-y divide-gray-100">
                  {transactionData.data
                    .sort((a, b) => {
                      const dateA = new Date(a.created_at);
                      const dateB = new Date(b.created_at);
                      return dateB.getTime() - dateA.getTime(); // Orden descendente: más reciente primero
                    })
                    .slice(0, 5) // Esto selecciona los últimos 5 registros
                    .map((transaction) => (
                      <li
                        key={`${transaction.id}-${transaction.created_at}`}
                        className="flex items-center justify-between gap-x-3 py-2"
                      >
                        <div className="flex min-w-0 gap-x-0">
                          <div className="min-w-0 flex-auto">
                            <div className="flex gap-2">
                              <p className="text-sm font-semibold text-gray-900">
                                {transaction.description}
                              </p>
                              <span
                                className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                                  transaction.type === "income"
                                    ? "bg-green-50 text-green-700 ring-green-700/10"
                                    : transaction.type === "expense"
                                    ? "bg-blue-50 text-blue-700 ring-red-700/10"
                                    : "bg-blue-50 text-blue-700 ring-blue-700/10" // Por si hay otros tipos
                                }`}
                              >
                                {transaction.type.charAt(0).toUpperCase() +
                                  transaction.type.slice(1).toLowerCase()}
                              </span>
                            </div>

                            <p className="mt-0 truncate text-xs text-gray-500">
                              by admin
                            </p>
                          </div>
                        </div>
                        <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                          <p className="text-sm/6 text-gray-900">
                            $ {transaction.amount}
                          </p>
                          <p className="mt-0 text-xs/5 text-gray-500">
                            {new Date(
                              transaction.created_at
                            ).toLocaleDateString("es-ES", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                            <time></time>
                          </p>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <DashboardPage />
    </Suspense>
  );
}
