export const numberFormatter = (value: number): string => {
  return Number(value).toLocaleString()
}

export const compactFormatter = (value: number): string => {
  return Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)
}

export const currencyFormatter = (
  value: number,
  currency = "Rp"
): string => {
  return `${currency} ${Number(value).toLocaleString()}`
}

export const percentFormatter = (value: number): string => {
  return `${value.toFixed(1)}%`
}

export const thousandFormatter = (value: number): string => {
  return `${(value / 1000).toFixed(1)}k`
}