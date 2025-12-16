import { registerApi } from "@/services/authApi"
import { useMutation } from "@tanstack/react-query"


export const useRegister = () => {
    return useMutation({
        mutationFn: registerApi,
    })
}