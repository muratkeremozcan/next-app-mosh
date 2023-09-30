// Dynamic route + catch-all segment + query string param:
type ProductPageProps = {
  params: {
    // for catch-all segments, the convention is to name the param "slug"
    slug: string[]
  }
  // to access query string parameters
  // we use `searchParams` object as a prop in the component
  searchParams: {
    sortOrder: string
  }
}

export default function ProductPage({
  params: {slug},
  searchParams: {sortOrder},
}: ProductPageProps) {
  return (
    <div>
      ProductPage {slug}, SortOrder {sortOrder}
    </div>
  )
}
