export async function uploadImage(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'GarudaHacks')
  
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )
  
    const data = await response.json()
    console.log('Cloudinary upload response:', data)
    return data.secure_url
  }