import { Metadata } from "next";
import Login from "./SignIn";
import { APP_ROUTES } from "@/config/routes";

export const metadata: Metadata = {
    title: APP_ROUTES.SIGNIN.title,
};

export default function SignInPage() {
    return <Login />;
}
