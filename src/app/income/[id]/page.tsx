// Definir el tipo para las props de `EditIncome`
interface EditIncome {
  params: {
    id: string;
  };
}

async function fetchIncome(id: string) {
  const res = await fetch(`http://localhost:3030/income/${id}`);
  if (!res.ok) {
    throw new Error("Error al cargar income");
  }
  return res.json();
}

export default async function EditIncome({ params }: EditIncome) {
  const { id } = params;
  const income = await fetchIncome(id);

  return (
    <div className="container">
      <h1 className="text-lg">Editar Income</h1>
      <p>{id}</p>
      <p>{income.description}</p>
    </div>
  );
}
