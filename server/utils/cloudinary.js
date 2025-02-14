const cloudinary = require('cloudinary').v2;


export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
      folder: 'Asbab',
    });
    console.log('file is uploaded on cloudinary', response.secure_url);
    return { secure_url: response.secure_url, public_id: response.public_id };
  } catch (error) {
    console.log(error);
  }
};

export const deleteImageFromCloudinary = async (publicId) => {
  try {
    if (!publicId) {
      console.error('Public ID is required for deletion.');
      return null;
    }
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Image deleted successfully:', result);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};