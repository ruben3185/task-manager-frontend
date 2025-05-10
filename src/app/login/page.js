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
  const [loading, setLoading] = useState(false);  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Por favor, ingresa usuario y contraseña.");
      return;
    }

    setLoading(true); 
    const { success, message } = await login(username, password);
    setLoading(false); 

    if (success) {
      router.push("/tasks");
    } else {
      setError(message);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-80">
        <h1 className="text-xl font-bold mb-4 text-gray-800">Iniciar sesión</h1>
        {error && <Alert message={error} type="error" />}
        <input
          type="text"
          placeholder="Usuario"
          className="w-full p-2 mb-3 border rounded text-gray-800"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full p-2 mb-3 border rounded text-gray-800"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
          disabled={loading} 
        >
          {loading ? "Cargando..." : "Ingresar"}
        </button>
      </form>
    </main>
  );
}
