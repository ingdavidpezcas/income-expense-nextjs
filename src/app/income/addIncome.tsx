"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FilePenLine } from "lucide-react";

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

import { fetchCategories } from "../../api/categories";

interface Category {
  id_category: number;
  name_category: string;
  type: string;
}

export default function AddIncome() {
  const [isOpen, setIsOpen] = useState(false);
  const [income, setIncome] = useState({
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
            (category: Category) => category.type === "income"
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
    setIncome({
      ...income,
      [name]: name === "amount" ? parseFloat(value) : value,
    });
  };

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (income.id_category === null || income.id_category === 0) {
      alert("Por favor, selecciona una categoría.");
      return;
    }

    console.log("Form Submitted:", income);
    setIsSubmitting(true);

    console.log({ selectedCategory });
    // Verificar si selectedCategory tiene el valor correcto
    console.log("Selected category:", selectedCategory);

    try {
      const response = await fetch("http://localhost:3030/income", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(income),
      });

      if (!response.ok) {
        throw new Error("Failed to add income");
      }

      const result = await response.json();
      console.log("Data submitted successfully:", result);
      toast({
        title: "Hurry!",
        description: "Income Add",
        action: <ToastAction altText="Try again">Income</ToastAction>,
        className: "bg-green-100 text-green-700",
      });
      // Limpiar los campos del formulario después del envío exitoso
      setIncome({ description: "", amount: 0, id_category: 0, type: "" });
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none 
          focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border 
          border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 rounded-xl px-8 py-2 text-xs"
          variant="outline"
          onClick={() => setIsOpen(true)}
        >
          <FilePenLine />
          Add Income
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg sm:max-w-[1024px] ">
        <DialogHeader>
          <DialogTitle>Add Income</DialogTitle>
          <DialogDescription>
            Make changes to your income here. Click save when youre done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid py-4 grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                className="col-span-3"
                name="description"
                value={income.description}
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
                value={income.amount}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
            <div className="sm:col-span-3">
              <Label htmlFor="amount" className="text-right">
                Category
              </Label>
              <select
                id="id_category"
                className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                value={income.id_category ?? ""}
                onChange={(e) =>
                  setIncome({ ...income, id_category: Number(e.target.value) })
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
            <div className="sm:col-span-3">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                className="col-span-3"
                type="date"
                name="date"
                value=""
                onChange={handleChange}
                min="0"
              />
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
