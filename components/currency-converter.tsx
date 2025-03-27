"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Share2, RefreshCw } from "lucide-react"

// Default exchange rate as fallback
const DEFAULT_EXCHANGE_RATE = 6.35

export default function CurrencyConverter() {
  const [dollarAmount, setDollarAmount] = useState<string>("1")
  const [realAmount, setRealAmount] = useState<string>("6.35")
  const [exchangeRate, setExchangeRate] = useState<number>(DEFAULT_EXCHANGE_RATE)
  const [lastUpdated, setLastUpdated] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchExchangeRate = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Using our own API route to avoid CORS issues
      const response = await fetch("/api/exchange-rate")

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }

      const data = await response.json()

      if (data && data.rates && data.rates.BRL) {
        setExchangeRate(data.rates.BRL)
        setRealAmount((Number(dollarAmount) * data.rates.BRL).toFixed(2))
        setLastUpdated(new Date().toLocaleString("pt-BR"))
      } else if (data && data.error) {
        throw new Error(data.error)
      } else {
        throw new Error("Unexpected API response format")
      }
    } catch (err: any) {
      console.error("Error fetching exchange rate:", err)
      setError(`Failed to fetch exchange rate: ${err.message}. Using default rate.`)

      // Use default rate as fallback
      setRealAmount((Number(dollarAmount) * DEFAULT_EXCHANGE_RATE).toFixed(2))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchExchangeRate()

    // Set up auto-refresh every 5 minutes
    const intervalId = setInterval(fetchExchangeRate, 5 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [])

  const handleDollarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setDollarAmount(value)

    if (value === "" || isNaN(Number(value))) {
      setRealAmount("")
    } else {
      const converted = (Number(value) * exchangeRate).toFixed(2)
      setRealAmount(converted)
    }
  }

  const handleRealChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setRealAmount(value)

    if (value === "" || isNaN(Number(value))) {
      setDollarAmount("")
    } else {
      const converted = (Number(value) / exchangeRate).toFixed(2)
      setDollarAmount(converted)
    }
  }

  const handleRefresh = () => {
    fetchExchangeRate()
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-medium text-gray-800">1 Dólar americano igual a</CardTitle>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={isLoading} title="Atualizar taxa">
              <RefreshCw className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mt-1">
          {isLoading ? "Carregando..." : `${exchangeRate.toFixed(2)} Real brasileiro`}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {lastUpdated ? `${lastUpdated} · Fonte: API de Câmbio` : "Atualizando..."}
        </p>
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-2">
            <div className="flex border rounded-md overflow-hidden">
              <Input
                type="number"
                value={dollarAmount}
                onChange={handleDollarChange}
                className="border-0 text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="0"
              />
              <div className="flex items-center bg-white px-3 border-l">
                <span className="text-gray-700">Dólar americano</span>
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <div className="flex border rounded-md overflow-hidden">
              <Input
                type="number"
                value={realAmount}
                onChange={handleRealChange}
                className="border-0 text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="0"
              />
              <div className="flex items-center bg-white px-3 border-l">
                <span className="text-gray-700">Real brasileiro</span>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center text-sm text-gray-500">Taxa de câmbio atualizada em tempo real</div>
        </div>
      </CardContent>
    </Card>
  )
}

