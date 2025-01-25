import api from './api';

interface UploadResponse {
  filename: string;
  filepath: string;
  size: number;
  url: string;
  error?: string;
}

export const uploadFile = async (
  file: File,
  category: 'events' | 'sponsors' | 'banners'
): Promise<UploadResponse> => {
  try {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        'Invalid file type. Please upload a JPEG, PNG, or WebP image.'
      );
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('File size exceeds 5MB limit.');
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(
      `/uploads/image/${category}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return {
      filename: response.data.filename,
      filepath: response.data.filepath,
      size: response.data.size,
      url: response.data.url,
    };
  } catch (error) {
    console.error('File upload error:', error);
    if (error instanceof Error) {
      return {
      filename: '',
      filepath: '',
      size: 0,
      url: '',
      error: error.message,
      };
    }
    return {
      filename: '',
      filepath: '',
      size: 0,
      url: '',
      error: 'Failed to upload file',
    };
  }
};

export const deleteFile = async (
  category: 'events' | 'sponsors' | 'banners',
  filename: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    await api.delete(`/uploads/image/${category}/${filename}`);
    return { success: true };
  } catch (error) {
    console.error('File deletion error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete file',
    };
  }
};

// Helper function to get file extension from mime type
export const getFileExtFromMimeType = (mimeType: string): string => {
  const map: { [key: string]: string } = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
  };
  return map[mimeType] || '.jpg';
};

// Helper function to validate image dimensions
export const validateImageDimensions = async (
  file: File,
  minWidth = 400,
  minHeight = 300
): Promise<boolean> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        resolve(img.width >= minWidth && img.height >= minHeight);
      };
      img.onerror = () => resolve(false);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve(false);
    reader.readAsDataURL(file);
  });
};
