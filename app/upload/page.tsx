'use client'
import {CldImage, CldUploadWidget} from 'next-cloudinary'
import {useState} from 'react'

export default function UploadPage() {
  const [publicId, setPublicId] = useState('')

  return (
    <>
      {publicId && (
        <CldImage src={publicId} width={270} height={180} alt="avatar" />
      )}
      <CldUploadWidget
        uploadPreset="o3jqdvra"
        options={{
          sources: ['local'],
          multiple: false,
        }}
        onUpload={result => {
          if (result.event !== 'success') return
          // @ts-expect-error why they don't have types?
          setPublicId(result.info.public_id)
        }}
      >
        {({open}) => (
          <button className="btn btn-primary" onClick={() => open()}>
            Upload an Image
          </button>
        )}
      </CldUploadWidget>
    </>
  )
}
