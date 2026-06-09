import { useState, useEffect } from 'react'

function readLS(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v !== null ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}

export default function useStore(storageKey, seedData = []) {
  const [data, setData] = useState(() => {
    const stored = readLS(storageKey, null)
    if (stored !== null) return stored
    return seedData
  })

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(data))
  }, [storageKey, data])

  function create(item) {
    const newItem = { ...item, id: Date.now() }
    setData(prev => [newItem, ...prev])
    return newItem
  }

  function update(id, updates) {
    setData(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item))
  }

  function remove(id) {
    setData(prev => prev.filter(item => item.id !== id))
  }

  function getById(id) {
    return data.find(item => item.id === id) ?? null
  }

  return { data, create, update, remove, getById }
}
