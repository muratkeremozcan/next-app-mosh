type ProductPageProps = {
  params: {
    slug: string[]
  }
}

export default function ProductPage({params: {slug}}: ProductPageProps) {
  return <div>ProductPage {slug}</div>
}
