"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from 'lucide-react'

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<string>("")
  const [convertedAmount, setConvertedAmount] = useState<string>("")
  const [isUsdToBrl, setIsUsdToBrl] = useState(true)
  const [exchangeRate, setExchangeRate] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchExchangeRate()
  }, [])

  const fetchExchangeRate = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD")
      const data = await response.json()
      setExchangeRate(data.rates.BRL)
    } catch (err) {
      setError("Failed to fetch exchange rate. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleConvert = () => {
    if (!exchangeRate) return

    const numAmount = parseFloat(amount)
    if (isNaN(numAmount)) {
      setConvertedAmount("")
      return
    }

    let result: number
    if (isUsdToBrl) {
      result = numAmount * exchangeRate
    } else {
      result = numAmount / exchangeRate
    }

    setConvertedAmount(result.toFixed(2))
  }

  const handleToggle = () => {
    setIsUsdToBrl(!isUsdToBrl)
    setAmount("")
    setConvertedAmount("")
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Conversor de moeda</CardTitle>
        <CardDescription>Converta USD e BRL em tempo real</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <Label htmlFor="currency-toggle">
                {isUsdToBrl ? "USD para BRL" : "BRL para USD"}
              </Label>
              <Switch
                id="currency-toggle"
                checked={!isUsdToBrl}
                onCheckedChange={handleToggle}
              />
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">
                  {isUsdToBrl ? "Quantia (USD)" : "Quantia (BRL)"}
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Entre com a quantia"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <Button onClick={handleConvert} className="w-full">
                Converter
              </Button>
              <div>
                <Label htmlFor="converted-amount">
                  {isUsdToBrl ? "Converter quantia (BRL)" : "Converter quantia (USD)"}
                </Label>
                <Input
                  id="converted-amount"
                  type="text"
                  value={convertedAmount}
                  readOnly
                />
              </div>
              <div className="text-sm text-gray-500 text-center">
                Taxa de câmbio: 1 USD = {exchangeRate?.toFixed(4)} BRL
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

