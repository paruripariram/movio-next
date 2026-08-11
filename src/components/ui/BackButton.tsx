import { ArrowBigLeft } from 'lucide-react';

export default function BackButton() {
    return (
        <div className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 cursor-pointer">
            <ArrowBigLeft/>
        </div>
    )
}

