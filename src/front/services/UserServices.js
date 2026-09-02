const userServices = {
  getAllUsers: async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
      const response = await fetch(`${backendUrl}/api/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) throw new Error("Error al obtener la lista de usuarios");
      
      const data = await response.json();
      // Retornamos los datos directamente si es un array, o si vienen dentro de una propiedad "users"
      return Array.isArray(data) ? data : (data.users || []);
    } catch (error) {
      console.error("Error en userServices.getAllUsers:", error);
      return [];
    }
  },

  updateUserField: async (userId, updateData) => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
      const response = await fetch(`${backendUrl}/api/user/${userId}`, {
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