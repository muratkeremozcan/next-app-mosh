'use client'

export default function AddToCart() {
  return (
    <button
      data-cy="add-to-cart-comp"
      className="btn btn-primary"
      onClick={() => console.log('Clicked')}
    >
      Add to Cart
    </button>
  )
}
