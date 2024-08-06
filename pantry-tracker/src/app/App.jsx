"use client"

import React from "react"; 
import { useState, useEffect } from "react";
import Footer from './components/Footer'
import Main from './components/Main'
import Header from './components/Header'


export default function App () {
    const [items, setItems] = useState([
        {id: 1, item: "Tomato", quantity: 4, expiry: Date()}
    ])

    const handleChange = (id, newQuantity) => {
        setItems(prevItems => 
            prevItems.map(item => 
                item.id === id? {...items, quantity: newQuantity}: null
            )
        )
    }
    return (
        <main>
            <Header />
            <Main />
            <Footer />
        </main>
    )
}