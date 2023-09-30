// multiple params case for dynamic route,
// where params object has all the parameters we are using
type PhotosDetailsPageProps = {
  params: {
    id: number
    photoId: number
  }
}

export default function PhotoDetailPage({
  params: {id, photoId},
}: PhotosDetailsPageProps) {
  return (
    <div>
      User {id}, PhotoDetailPage {photoId}
    </div>
  )
}
