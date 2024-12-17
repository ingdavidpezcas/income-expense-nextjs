"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  FilePenLine,
  CircleCheck,
  Calendar as CalendarIcon,
} from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
import {} from "@/components/ui/toast";

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
      toast({
        className: "bg-red-600 text-gray-50 p-4",
        action: (
          <div className="w-full flex items-center ">
            <CircleCheck className="mr-2 text-gray-50" />
            <span className="first-letter:capitalize text-gray-50">
              Por favor, selecciona una categoría.
            </span>
          </div>
        ),
      });
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
        className: "bg-gray-900 text-green-500",
        action: (
          <div className="w-full flex items-center ">
            <CircleCheck className="mr-2 text-green-500" />
            <span className="first-letter:capitalize text-green-500">
              successfully updated
            </span>
          </div>
        ),
      });

      // Limpiar los campos del formulario después del envío exitoso
      setExpense({ description: "", amount: 0, id_category: 0 });
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
          className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none 
          focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border 
          border-input bg-slate-100 hover:bg-accent hover:text-accent-foreground h-10 rounded-xl px-8 py-2 text-xs"
          variant="outline"
          onClick={() => setIsOpen(true)}
        >
          <FilePenLine />
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="p-10 sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
          <DialogDescription>
            Make changes to your expense here. Click save when youre done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col sm:col-span-3">
              <Label htmlFor="description" className="text-left mb-4">
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
            <div className="flex flex-col sm:col-span-3">
              <Label htmlFor="amount" className="text-left mb-4">
                Amount
              </Label>

              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="currency">
                  Enter the amount in your local currency
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-gray-500 dark:text-gray-400">
                    COP &nbsp;
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    name="amount"
                    className="pl-12"
                    value={expense.amount}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/*    <Input
                id="amount"
                className="col-span-3"
                type="number"
                name="amount"
                value={expense.amount}
                onChange={handleChange}
                required
                min="0"
              /> */}
            </div>
            <div className="flex flex-col sm:col-span-3">
              <Label htmlFor="amount" className="text-left mb-4">
                Category
              </Label>

              <Select
                onValueChange={(value) =>
                  setExpense({
                    ...expense,
                    id_category: value ? Number(value) : 0, // Use 0 or any other default number instead of null
                  })
                }
                value={expense.id_category?.toString() ?? ""}
              >
                <SelectTrigger id="id_category" className="w-full">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    <SelectItem value="0">Selecciona una categoría</SelectItem>
                    {Array.isArray(categories) &&
                      categories.map((category) => (
                        <SelectItem
                          key={category.id_category}
                          value={category.id_category.toString()}
                        >
                          {category.name_category}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {/*    <select
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
              </select> */}
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
              className="px-4 py-2 text-xs h-10 rounded-xl"
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
