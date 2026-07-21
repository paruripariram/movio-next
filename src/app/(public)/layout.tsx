import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";
import PageTransition from "@/components/PageTransition";
import { AppInitializer } from "@/components/providers/AppInitializer";
import { SessionProvider } from "next-auth/react";
import { ModalProvider } from "@/components/providers/ModalProvider";

const roboto = Roboto({
    variable: "--font-roboto",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: { template: "%s - Movio", default: "Movio" },
    description:
        "Movio — персональный веб-сервис для поиска фильмов, управления личной коллекцией и отслеживания просмотренного медиа-контента.",
    icons: { icon: "/logoMovio.webp" },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${roboto.className} h-full antialiased`}>
            <body className="min-h-full flex bg-bgcolor">
                <SessionProvider>
                    <AppInitializer>
                        <Navbar />
                        <PageTransition className="flex-1 min-w-0 ml-0 md:ml-60 2xl:ml-70 px-4 pb-4 pt-20 sm:px-6 sm:pb-6 sm:pt-24 md:p-6 lg:p-8 2xl:p-13 min-h-screen flex flex-col">
                            {children}
                        </PageTransition>
                        <Toaster position="top-center" richColors closeButton />
                        <ModalProvider />
                    </AppInitializer>
                </SessionProvider>
            </body>
        </html>
    );
}