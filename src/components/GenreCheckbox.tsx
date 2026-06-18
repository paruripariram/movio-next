'use client'

interface GenreCheckboxProps {
    genreId: number
    name: string
    checked: boolean
    onChange: (genreId: number, checked: boolean) => void
}

function GenreCheckbox({ genreId, name, checked, onChange }: GenreCheckboxProps) {
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        onChange(genreId, e.target.checked);
    }

    return (
        <label className="group cursor-pointer flex items-center gap-2">
            <input 
                type="checkbox" 
                checked={checked} 
                className="hidden"
                onChange={handleChange}
            />
            <div className={`w-4 h-4 rounded-md transition-all duration-300 ${checked ? "bg-primary" : "bg-gray-500"}`}></div>
            <span>{name}</span>
        </label>
    )
}

export default GenreCheckbox
