import { fetchUserApi } from "@/services/authApi"
import { useAuthStore } from "@/store/useAuthStore"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"


export const useUser = () => {
    const setAuth = useAuthStore((s) => s.setAuth)
    
    const query = useQuery({
      queryKey: ["auth-user"],
      queryFn: fetchUserApi,
      enabled: !!localStorage.getItem("access"),
      retry: false,
    });

    useEffect(() => {
        if (query.isSuccess && query.data) {
            setAuth(query.data)
        }
    }, [query.data, query.isSuccess, setAuth])

    return query
}