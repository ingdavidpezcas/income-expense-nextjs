"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FilePenLine, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { fetchCategories } from "../../api/categories";

interface Category {
  id_category: number;
  name_category: string;
  type: string;
}

export default function AddExpense() {
  const [isOpen, setIsOpen] = useState(false);
  const [expense, setExpense] = useState({
    description: "",
    amount: 0,
    id_category: 0,
    type: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory] = useState<number>(0);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        console.log("Datos recibidos:", data); // Verifica lo que realmente estás recibiendo
        if (Array.isArray(data)) {
          // Filtrar las categorías por el tipo 'income'
          const filteredCategories = data.filter(
            (category: Category) => category.type === "expense"
          );
          setCategories(filteredCategories);
        } else {
          console.error("La respuesta no es un array:", data);
          setCategories([]); // Si no es un array, establecer un array vacío
        }
      } catch (error) {
        console.error("Error al cargar las categorías:", error);
        setCategories([]); // En caso de error, asigna un array vacío
      }
    };

    loadCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setExpense({
      ...expense,
      [name]: name === "amount" ? parseFloat(value) : value,
    });
  };

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (expense.id_category === null || expense.id_category === 0) {
      alert("Por favor, selecciona una categoría.");
      return;
    }

    console.log({ selectedCategory });
    // Verificar si selectedCategory tiene el valor correcto
    console.log("Selected category:", selectedCategory);

    console.log("Form Submitted:", expense);
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:3030/expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expense),
      });

      if (!response.ok) {
        throw new Error("Failed to add expense");
      }

      const result = await response.json();
      console.log("Data submitted successfully:", result);
      toast({
        title: "Hurry!",
        description: "Expense Add",
        action: <ToastAction altText="Try again">Expense</ToastAction>,
        className: "bg-black text-black gradient-dev",
      });

      // Limpiar los campos del formulario después del envío exitoso
      setExpense({ description: "", amount: 0, id_category: 0, type: "" });
      // Cerrar el modal
      setIsOpen(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const [date, setDate] = React.useState<Date>();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="px-4 py-2 text-xs h-8"
          variant="outline"
          onClick={() => setIsOpen(true)}
        >
          <FilePenLine />
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
          <DialogDescription>
            Make changes to your expense here. Click save when youre done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="sm:col-span-3">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                className="col-span-3"
                name="description"
                value={expense.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="sm:col-span-3">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                className="col-span-3"
                type="number"
                name="amount"
                value={expense.amount}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
            <div className="sm:col-span-3">
              <Label htmlFor="amount" className="text-right">
                Category
              </Label>
              <select
                id="id_category"
                className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                value={expense.id_category ?? ""}
                onChange={(e) =>
                  setExpense({
                    ...expense,
                    id_category: Number(e.target.value),
                  })
                }
              >
                <option value="">Selecciona una categoría</option>
                {Array.isArray(categories) &&
                  categories.map((category) => (
                    <option
                      key={category.id_category}
                      value={category.id_category}
                    >
                      {category.name_category}
                    </option>
                  ))}
              </select>
            </div>
            <div className="grid-cols-4 items-center gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            {error && <p>{error}</p>}
            <Button
              className="px-4 py-2 text-xs h-8"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
