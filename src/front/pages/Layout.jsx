import { Outlet } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import clientsServices from "../services/ClientsServices"
import { useEffect } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer"
import toast, { Toaster } from "react-hot-toast"
import servicesServices from "../services/ServicesServices"


// Base component that maintains the navbar and footer throughout the page and the scroll to top functionality.
export const Layout = () => {
    const { store, dispatch } = useGlobalReducer()

    useEffect(() => {
        async function getAllClients() {
            try {
                const dataClients = await clientsServices.getAllClientsByUser(store.user.id)
                dispatch({ type: 'setClients', payload: dataClients })
            } catch (error) {
                toast.error("Characters didn't work.")
            }
        }

        async function getAllServices() {
            try {
                const dataServices = await servicesServices.getAllServicesByUser(store.user.id);                
                dispatch({ type: 'setServices', payload: dataServices });
            } catch (error) {
                toast.error("Services didn't work.");
            }
        }

        if (store.isAuthenticated) {
            getAllClients()
            getAllServices()
        }
    }, []);
    return (
        <ScrollToTop>
            <Toaster toastOptions={{ style: { zIndex: 999 } }} />
            <Navbar />
            <Outlet />
            <Footer />
        </ScrollToTop>
    )
}