import axios from "axios";
import { toast } from "sonner";

interface ErrorHandlerOptions {
    setErrorCallback?: (message: string) => void;
    skipToast?: boolean;
}

export function handleError(
    error: unknown,
    contextMessage: string,
    options: ErrorHandlerOptions = {},
) {
    const { setErrorCallback, skipToast } = options;

    if (axios.isCancel(error)) return true;
    if (error instanceof DOMException && error.name === "AbortError") return true;
    if (error instanceof Error && error.message === "canceled") return true;

    let errorMessage = "An unknown error occurred";

    if (error instanceof Error) {
        console.error(`${contextMessage}: ${error.message}`);
        errorMessage = error.message;
    } else {
        console.error(`${contextMessage}: Неизвестная ошибка`, error);
    }

    if (setErrorCallback) setErrorCallback(errorMessage);

    if (!skipToast) {
        toast.error(`${contextMessage}: ${errorMessage}`);
    }
    return false;
}
