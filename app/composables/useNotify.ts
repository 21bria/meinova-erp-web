import { toast } from 'vue-sonner'

export function useNotify() {
    const success = (message: string) => {
        toast.success(message)
    }

    const error = (message: string) => {
        toast.error(message)
    }

    const deleted = (message: string) => {
        toast("Deleted", {
            description: message,
            style: {
                background: '#dc2626',
                color: 'white'
            }
        })
    }

    const info = (message: string) => {
        toast(message)
    }

    return {
        success,
        error,
        deleted,
        info,
    }
}
