import { loginApi } from "@/services/authApi"
import { useAuthStore } from "@/store/useAuthStore"
import { useMutation } from "@tanstack/react-query"

export const useLogin = () => {
    const setAuth = useAuthStore((s) => s.setAuth)

    return useMutation({
        mutationFn: loginApi,
        onSuccess: (data) => {
            localStorage.setItem("access", data.access)
            localStorage.setItem("refresh", data.refresh)
            setAuth(data.user)
        }
    })
}