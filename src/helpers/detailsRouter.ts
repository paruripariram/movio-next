import { APP_ROUTES } from "@/config/routes";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export default function detailsRouter(router: AppRouterInstance, id: number, type: "movie" | "tv") {

            router.push(APP_ROUTES.DETAILS.path(type, id));

        }
