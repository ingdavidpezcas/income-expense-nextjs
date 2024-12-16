"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const EditIncomeForm = ({ id }) => {
  const [income, setIncome] = useState({ amount: "", description: "" });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchIncome = async () => {
      const res = await fetch(`http://localhost:3030/income/${id}`);
      const data = await res.json();
      setIncome(data);
    };

    fetchIncome();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    console.log("Datos enviados:", {
      amount: income.amount,
      description: income.description,
    });

    try {
      const res = await fetch(`http://localhost:3030/income/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: income.amount,
          description: income.description,
        }),
      });

      const data = await res.json();
      console.log("Respuesta del servidor:", data);

      if (res.ok) {
        alert("Producto actualizado con éxito");
        router.push("/income");
      } else {
        const errorResponse = await res.json();
        console.error("Error al actualizar el producto:", errorResponse);
        alert("Error al actualizar el producto: " + errorResponse.message);
      }
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      alert("Error al actualizar el producto");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Profile
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            This information will be displayed publicly so be careful what you
            share.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Username
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={income.amount}
                    onChange={(e) =>
                      setIncome({ ...income, amount: e.target.value })
                    }
                    placeholder="Nombre del producto"
                    autoComplete="name"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Username
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    id="price"
                    name="price"
                    type="text"
                    value={income.description}
                    onChange={(e) =>
                      setIncome({ ...income, description: e.target.value })
                    }
                    placeholder="Precio del producto"
                    autoComplete="price"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {isLoading ? "Actualizando..." : "Actualizar Producto"}
        </button>
      </div>
    </form>
  );
};

export default EditIncomeForm;
