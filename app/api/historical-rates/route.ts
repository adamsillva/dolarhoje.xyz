import { NextResponse } from "next/server"
import { format, subDays } from "date-fns"

export async function GET() {
  try {
    // Get data for the last 30 days
    const endDate = new Date()
    const startDate = subDays(endDate, 30)

    const formattedStartDate = format(startDate, "yyyy-MM-dd")
    const formattedEndDate = format(endDate, "yyyy-MM-dd")

    const response = await fetch(
      `https://api.exchangerate.host/timeseries?start_date=${formattedStartDate}&end_date=${formattedEndDate}&base=USD&symbols=BRL`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch historical rates")
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching historical rates:", error)
    return NextResponse.json({ error: "Failed to fetch historical rates" }, { status: 500 })
  }
}

