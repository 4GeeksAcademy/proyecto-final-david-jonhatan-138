const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:3001";

async function getAllClientsByUser(user_id) {
    const res = await fetch(`${backendUrl}/api/clients/user/${user_id}`)
    const data = await res.json()
    return data;
}

async function deleteClientById(client_id) {
    const res = await fetch(`${backendUrl}/api/clients/${client_id}`, {
        method: "DELETE",
    })
}

async function postClient(client) {
    const res = await fetch(`${backendUrl}/api/clients`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(client)
    })
    const data = await res.json()
    return data;
}

async function updateClient(id, client) {
    const res = await fetch(`${backendUrl}/api/clients/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(client)
    });

    return await res.json();
}


const clientsServices = {
    getAllClientsByUser,
    deleteClientById,
    postClient,
    updateClient
}


export default clientsServices