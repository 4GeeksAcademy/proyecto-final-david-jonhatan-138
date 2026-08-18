const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const loginService = async ({ email, password }) => {
    try {
        const response = await fetch(backendUrl + "/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            return [null, "Error al iniciar sesion"];
        }

        const data = await response.json();
        return [data, null];
    } catch (err) {
        return [null, err.message];
    }
};

export const getProfile = async (token) => {
    try {
        const response = await fetch(backendUrl + "/api/profile", {
            headers: { "Authorization": "Bearer " + token },
        });

        if (!response.ok) {
            return [null, "Token invalido"];
        }

        const data = await response.json();
        return [data, null];
    } catch (err) {
        return [null, err.message];
    }
};

export const signinService = async ({email ,name ,last_name ,password ,category ,biografi, role}) => {
    try {
        const response = await fetch(backendUrl + "/api/signin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email ,name ,last_name ,password ,category ,biografi, role}),
        });

        if (!response.ok) {
            return [null, "Error al registrarse"];
        }

        const data = await response.json();
        return [data, null];
    } catch (err) {
        return [null, err.message];
    }
};

export const updateUserService = async (id, userData) => {
    try {
        const response = await fetch(`${backendUrl}/api/user/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            return [null, "Error al actualizar el usuario"];
        }

        const data = await response.json();
        return [data, null];

    } catch (err) {
        return [null, err.message];
    }
};

export const getUserByEmail = async ({ email }) => {
    try {
        const response = await fetch(backendUrl + "/api/user-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            return [null, "Error al encontrar el email"];
        }

        const data = await response.json();
        return [data, null];
    } catch (err) {
        return [null, err.message];
    }
};