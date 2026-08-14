async function getAllServicesByUser(user_id) {
    const res = await fetch(`https://fuzzy-garbanzo-pjgwgr5jqwpwhr96p-3001.app.github.dev/api/services/user/${user_id}`);
    const data = await res.json();
    return data;
}

async function deleteServiceById(service_id) {
    const res = await fetch(`https://fuzzy-garbanzo-pjgwgr5jqwpwhr96p-3001.app.github.dev/api/services/${service_id}`, {
        method: "DELETE",
    });
}

async function postService(service) {
    const res = await fetch("https://fuzzy-garbanzo-pjgwgr5jqwpwhr96p-3001.app.github.dev/api/services", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(service)
    });

    const data = await res.json();
    return data;
}

async function updateService(id, service) {
    const res = await fetch(`https://fuzzy-garbanzo-pjgwgr5jqwpwhr96p-3001.app.github.dev/api/services/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(service)
    });

    return await res.json();
}

const servicesServices = {
    getAllServicesByUser,
    deleteServiceById,
    postService,
    updateService
};

export default servicesServices;
