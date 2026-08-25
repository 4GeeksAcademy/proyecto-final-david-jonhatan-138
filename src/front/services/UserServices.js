const userServices = {
  getAllUsers: async () => {
    try {
      // Usamos ruta relativa pura para que el proxy de Vite maneje el puerto automáticamente y evite CORS
      const response = await fetch("/api/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok)
        throw new Error("Error al obtener la lista de usuarios");
      return await response.json();
    } catch (error) {
      console.error("Error en userServices.getAllUsers:", error);
      return [];
    }
  },

  updateUserField: async (userId, updateData) => {
    try {
      const response = await fetch(`/api/user/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) throw new Error("Error al actualizar el usuario");
      return await response.json();
    } catch (error) {
      console.error("Error en userServices.updateUserField:", error);
      throw error;
    }
  },
};

export default userServices;
