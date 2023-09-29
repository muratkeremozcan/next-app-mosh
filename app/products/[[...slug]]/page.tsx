type ProductPageProps = {
  params: {
    slug: string[]
  }
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
