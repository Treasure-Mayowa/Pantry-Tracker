import React from "react";



export default function Main () {
    const handleSubmit = () => {
        null
    }
    return (
        <>
            <div className="">
                <form className="grid grid-cols-6 items-center text-black" onSubmit={handleSubmit}>
                    <input type="text" required className="px-2 py-2 w-full border-b-2 focus:border-[#333] outline-none" placeholder="Name" />
                    <input type="number" required className="" placeholder="Quantity" />
                    <input type="date" required className="" placeholder="Expiry Date" />
                    <button type="submit" className="px-5 py-2.5 rounded-lg text-sm tracking-wider font-medium border border-current outline-none bg-red-400 text-black">Add Item</button>
                </form>
            </div>
        </>
    )
}