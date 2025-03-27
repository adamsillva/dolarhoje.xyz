import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Fetch the latest exchange rate from USD to BRL using a reliable API
    const response = await fetch("https://open.er-api.com/v6/latest/USD")

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()

    // Check if the API returned the expected data structure
    if (!data || !data.rates || !data.rates.BRL) {
      throw new Error("API response missing BRL rate")
    }

    return NextResponse.json({
      success: true,
      rates: {
        BRL: data.rates.BRL,
      },
      timestamp: data.time_last_update_unix,
    })
  } catch (error: any) {
    console.error("Error fetching exchange rate:", error)

    // Return a more detailed error message
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch exchange rate",
        fallbackRate: 6.35, // Provide a fallback rate
      },
      { status: 500 },
    )
  }
}

