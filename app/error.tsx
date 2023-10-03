'use client'

type ErrorComponentProps = {
  error: Error
  reset: () => void
}

export default function ErrorComponent({error, reset}: ErrorComponentProps) {
  console.error({error})
  return (
    <>
      <div>An unexpected error has occurred:</div>
      <button className="btn" onClick={() => reset()}>
        Retry
      </button>
    </>
  )
}
