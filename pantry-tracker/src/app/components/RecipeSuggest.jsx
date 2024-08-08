'use client'
import React, { useState } from 'react'
import { LightbulbCircleOutlined } from '@mui/icons-material'
import LlamaAI from 'llamaai'

export default function RecipeSuggest({ availableItems = [] }) {
    const [loading, setLoading] = useState(false)
    const [recipes, setRecipes] = useState([])
    const [error, setError] = useState('')

    const apiToken = process.env.NEXT_PUBLIC_LLAMA_API_KEY

    const getRecipes = async () => {
        if (availableItems.length !== 0) {
            setLoading(true)
            setError('')
            const items = availableItems.map(item => item.name).join(", ")
            
            // Make request to api
            try {
                const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${apiToken}`,
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  "model": "meta-llama/llama-3.1-8b-instruct:free",
                  "messages": [
                    {
                        "role": "user", 
                        "content": `Give me at most 5 recipes simply by name and steps, that you can make with this available ingredient: ${items}. Do not give me any response other than a json format only with the recipes in an array with the following structure: "[
                    {
                        "name": "Buttered Toast",
                        "steps": ["Toast bread", "Spread butter on top"]
                    },".`},
                  ],
                })
              })
                const data = await response.json()
                var output = data.choices[0].message.content
                output = JSON.parse(output)
                setRecipes(output)
            } catch(err) {
                setError("")
            }
            setLoading(false)
    }}

    return (
        <main className='mt-5 items-center m-auto max-w-lg'>
            <button 
                onClick={getRecipes}
                className='p-5 border-none rounded-lg mr-10 m-auto bg-yellow-400 text-black font-bold items-right'
                disabled={loading}
            >
                <LightbulbCircleOutlined /> Get Recipe Suggestions
            </button>
            {loading && <p className='italic text-lg'>Loading...</p>}
            {error && <p className='text-red-500 text-lg'>{error}</p>}
            {recipes.length > 0 ? (
            <div className='mt-6'>
                <h2 className='text-2xl font-bold text-yellow-500 mb-4'>Recipes</h2>
                <div className='grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
                    {recipes.map((recipe, index) => (
                        <div key={index} className='p-5 rounded-lg bg-white shadow-md border-2 border-yellow-200'>
                            <h3 className='text-xl font-semibold text-gray-800'>{recipe.name}</h3>
                            <ul className='mt-3 list-disc list-inside'>
                                {recipe.steps.map((step, stepIndex) => (
                                    <li key={stepIndex} className='text-gray-700'>{step}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            ) : null}
        </main>
    )
}
