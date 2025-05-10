"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";
import Alert from "@/components/Alert";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { success, message } = await login(username, password);
    if (success) {
      router.push("/tasks");
    } else {
      setError(message);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-80">
        <h1 className="text-xl font-bold mb-4">Iniciar sesión</h1>
        {error && <Alert message={error} type="error" />}
        <input
          type="text"
          placeholder="Usuario"
          className="w-full p-2 mb-3 border rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full p-2 mb-3 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Ingresar
        </button>
      </form>
    </main>
  );
}

// Tailwind CSS ya está aplicado correctamente en el formulario con clases como bg-white, rounded, shadow, text-xl, etc.
