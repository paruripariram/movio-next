import { auth } from "@/config/firebase";
import {
    createUserWithEmailAndPassword,
    updateProfile,
    signInWithEmailAndPassword,
} from "firebase/auth";

export const registerUser = async (
    email: string,
    password: string,
    username: string,
) => {
    const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
    );
    await updateProfile(userCredential.user, {
        displayName: username,
    });

    return userCredential.user;
};

export const loginUser = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
    );
    return userCredential.user;
};
