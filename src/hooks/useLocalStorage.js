export default function useLocalStorage() {
    const GetUserLogged = () => {
        const raw = localStorage.getItem("usuarioLogueado")
        if (!raw) return null
        return JSON.parse(raw)
    }

    return { GetUserLogged }
}