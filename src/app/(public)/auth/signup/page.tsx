import { Metadata } from "next";
import SignUp from "./SignUp";
import { APP_ROUTES } from "@/config/routes";

export const metadata: Metadata = {
    title: APP_ROUTES.SIGNUP.title,
}

export default function SignUpPage() {
  return <SignUp/>
}
