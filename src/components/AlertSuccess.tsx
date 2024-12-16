import React from "react";

interface AlertProps {
  message: string; // Mensaje de la alerta
  type?: "success" | "error" | "info" | "warning"; // Tipo de alerta (opcional)
  data?: Record<string, unknown> | string | number; // Propiedad adicional para datos dinámicos
  onClose?: () => void; // Función para cerrar la alerta (opcional)
}

const Alert: React.FC<AlertProps> = ({
  message,
  type = "info",
  data,
  onClose,
}) => {
  const alertStyles = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-white",
    warning: "bg-yellow-500 text-black",
  };

  return (
    <div className={`p-4 rounded ${alertStyles[type]}`}>
      <p>{message}</p>
      {data && (
        <pre className="mt-2 bg-gray-100 p-2 rounded text-sm overflow-auto">
          {typeof data === "object" ? JSON.stringify(data, null, 2) : data}
        </pre>
      )}
      {onClose && (
        <button
          className="mt-2 bg-gray-800 text-white px-2 py-1 rounded hover:bg-gray-700"
          onClick={onClose}
        >
          Close
        </button>
      )}
    </div>
  );
};

export default Alert;
