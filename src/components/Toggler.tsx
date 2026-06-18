'use client'

type MediaType = "movie" | "tv"
interface TogglerProps {
    type: MediaType
    typeHandler: () => void
}

export default function Toggler({type, typeHandler}: TogglerProps) {

    return (
        <div className="flex items-center justify-between w-40 h-10 bg-bgcolor rounded-full relative">
            <div className={`absolute w-1/2 h-10 bg-back-link-color rounded-full z-2 transition-transform duration-300 ${type === "movie" ? "translate-x-0" : "translate-x-full"}`}></div>
            <button onClick={() => typeHandler()} className={`relative z-3 rounded-full flex-1 h-full font-extrabold transition-colors duration-300 ${type === "movie" ? "text-primary" : "text-gray-500"}`}>Movie</button>
            <button onClick={() => typeHandler()} className={`relative z-3 rounded-full flex-1 h-full font-extrabold transition-colors duration-300 ${type === "tv" ? "text-primary" : "text-gray-500"}`}>TV show</button>
        </div>
    )
}
