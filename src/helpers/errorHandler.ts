import axios from "axios";

export function handleError(error: unknown, contextMessage: string, setErrorCallback?: (message: string) => void) {
    if(axios.isCancel(error)){
        console.log(`${contextMessage}: Request canceled`);
        return;
    }
    if( error instanceof DOMException && error.name === "AbortError") return
    if (error instanceof Error && error.message === "canceled") return;
    if (error instanceof Error) {
        console.error(`${contextMessage}: ${error.message}`);
        if(setErrorCallback) setErrorCallback(error.message);

        //TOAST


    }else {
        console.error(`${contextMessage}: Неизвестная ошибка`, error);
        if(setErrorCallback) setErrorCallback("An unknown error occurred");
    }
}