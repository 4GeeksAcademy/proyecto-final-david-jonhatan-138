async function getAllClientsByUser(user_id) {
    const res = await fetch(`https://fuzzy-garbanzo-pjgwgr5jqwpwhr96p-3001.app.github.dev/api/clients/user/${user_id}`)
    const data = await res.json()
    return data;
}

async function deleteClientById(client_id) {
    const res = await fetch(`https://fuzzy-garbanzo-pjgwgr5jqwpwhr96p-3001.app.github.dev/api/clients/${client_id}`, {
        method: "DELETE",
    })
}

async function postClient(client) {
    const res = await fetch("https://fuzzy-garbanzo-pjgwgr5jqwpwhr96p-3001.app.github.dev/api/clients", {
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
    const res = await fetch(`https://fuzzy-garbanzo-pjgwgr5jqwpwhr96p-3001.app.github.dev/api/clients/${id}`, {
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