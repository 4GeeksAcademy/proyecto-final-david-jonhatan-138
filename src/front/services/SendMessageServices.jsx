const backendUrl = import.meta.env.VITE_BACKEND_URL;

export async function sendMessage(email) {
    const res = await fetch(`${backendUrl}/api/mail-reset-pass`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(email)
    })
    const data = await res.json()
    return data;
}