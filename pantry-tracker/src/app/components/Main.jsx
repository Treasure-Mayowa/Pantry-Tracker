import React, { useState, useEffect } from "react"
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore" 
import { db } from "../firebase/firebase" 
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import RecipeSuggest from './RecipeSuggest'

export default function Main() {
    const [items, setItems] = useState([]) 
    const [newItem, setNewItem] = useState({ name: '', quantity: 0, expiry: '' }) 
    const [loading, setLoading] = useState(false) 
    const [error, setError] = useState('')
    const [searchQuery, setSearchQuery] = useState('')

    // Clear error message
    const clearError = () => {
        setTimeout(() => {
            setError('')
        }, 5000)
    }

    // Add items to firestore
    const handleSubmit = async (e) => {
        e.preventDefault() 
        setLoading(true) 
        setError('') 
        try {
            const docRef = await addDoc(collection(db, "items"), {
                name: newItem.name.trim(),
                quantity: newItem.quantity,
                expiry: newItem.expiry
            }) 
            setItems([...items, { id: docRef.id, ...newItem }]) 
            setNewItem({ name: '', quantity: 0, expiry: '' }) 
            readItems() 
        } catch (err) {
            setError('Failed to add item') 
            clearError()
        }
        setLoading(false) 
    } 

    // Read items from firestore
    const readItems = async () => {
        setLoading(true) 
        try {
            const querySnapshot = await getDocs(collection(db, "items")) 
            const itemsList = [] 
            querySnapshot.forEach((doc) => {
                itemsList.push({ id: doc.id, ...doc.data() }) 
            }) 
            setItems(itemsList) 
        } catch (err) {
            setError('Failed to fetch items') 
            clearError()
        }
        setLoading(false) 
    } 

    useEffect(() => { readItems() }, []) 

    // Delete item from firestore
    const deleteItems = async (itemId) => {
        setLoading(true) 
        setError('') 
        try {
            const itemDoc = doc(db, "items", itemId) 
            await deleteDoc(itemDoc) 
            readItems() 
        } catch (err) {
            setError('Failed to delete item') 
            clearError()
        }
        setLoading(false) 
    } 

    //Search and display results 
    const searchResults = async () => { 
        if (searchQuery !== '') {
            setLoading(true)
            setError('')
            try {
                const itemsList = items.filter((item)=> {
                    return item.name.toLowerCase().includes(searchQuery.toLowerCase()) 
                })
                setItems(itemsList)
            }
            catch (err) {
                setError("Couldn't search items")
                clearError()
            }
            setLoading(false)
        } else {
            readItems()
        }
    }

    return (
        <main className="p-10 items-center text-white bg-gray-800 min-h-screen">
            <div className="border-2 rounded-lg p-6 bg-gray-700 shadow-lg max-w-lg mx-auto">
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <input 
                            type="text" required 
                            className="w-full p-3 rounded-lg border border-gray-600 bg-gray-900 text-white focus:border-green-500 focus:outline-none" 
                            placeholder="Enter item name"
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} 
                        />
                    </div>
                    <div>
                        <input 
                            type="number" required 
                            className="w-full p-3 rounded-lg border border-gray-600 bg-gray-900 text-white focus:border-green-500 focus:outline-none" 
                            placeholder="Enter quantity"
                            value={newItem.quantity}
                            onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })} 
                        />
                    </div>
                    <div>
                        <input 
                            type="date" required 
                            className="w-full p-3 rounded-lg border border-gray-600 bg-gray-900 text-white focus:border-green-500 focus:outline-none" 
                            value={newItem.expiry}
                            onChange={(e) => setNewItem({ ...newItem, expiry: e.target.value })} 
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full p-3 rounded-lg bg-green-500 text-white font-bold hover:bg-green-600 focus:outline-none"
                        disabled={loading}
                    > 
                        {loading ? 'Adding...' : 'Add Item'}
                    </button>
                    {error && <p className="text-red-500 text-center mt-2">{error}</p>}
                </form>
            </div>
            <div className="flex mt-9 mx-auto max-w-lg">
                <input
                    type="text"
                    className="w-[90%] border bg-gray-800 border-white focus:border-green-300 rounded-lg p-4"
                    value={searchQuery}
                    onChange={(e)=> setSearchQuery(e.target.value)}
                    placeholder="Search items..."
                />
                <button
                    onClick={searchResults} 
                    className="flex w-[10%] p-4 rounded-full bg-green-800 text-center align-middle justify-center">
                    <SearchRoundedIcon className="w-4 h-4" />
                </button>
            </div>
            <RecipeSuggest availableItems={items}/>
            <div className="mt-10 max-w-lg mx-auto">
            <h2 className='text-2xl font-bold text-green-500 mb-4 text-center'>Items</h2>
                {loading && <p className="text-center text-gray-400 text-lg">Loading...</p>}
                {!loading && items.length === 0 && <p className="text-center text-gray-400 text-lg">No items found</p>}
                <div className="space-y-4">
                    {items.map(item => (
                        <div key={item.id} className="p-4 rounded-lg bg-gray-900 text-white shadow-md flex justify-between items-center">
                            <div>
                                <p className="font-bold">{item.name}</p>
                                <p>Quantity: {item.quantity}</p>
                                <p>Expiry Date: {item.expiry}</p>
                            </div>
                            <button
                                className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 focus:outline-none"
                                onClick={() => deleteItems(item.id)}
                                disabled={loading}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    ) 
}