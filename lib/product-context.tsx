import { createContext, useContext, ReactNode } from 'react'
import type { ProductData } from './types'
import allProducts from './enriched-data.json'

const ProductContext = createContext<ProductData | null>(null)

export function ProductProvider({ slug, children }: { slug: string; children: ReactNode }) {
  const product = (allProducts as unknown as ProductData[]).find((p) => p.slug === slug) ?? (allProducts as unknown as ProductData[])[0]
  return <ProductContext.Provider value={product}>{children}</ProductContext.Provider>
}

export function useProduct(): ProductData {
  const ctx = useContext(ProductContext)
  if (!ctx) throw new Error('useProduct must be used within a ProductProvider')
  return ctx
}
