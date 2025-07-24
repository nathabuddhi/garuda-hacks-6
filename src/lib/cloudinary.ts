export async function uploadImage(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'painting')
  
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )
  
    const data = await response.json()
    return data.secure_url
  }