// src/lib/auth.js

export async function login(username, password) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Error de autenticación" };
    }

    // Guarda el token en localStorage
    localStorage.setItem("token", data.token);
    return { success: true };
  } catch (error) {
    return { success: false, message: "Error de red o del servidor" };
  }
}
