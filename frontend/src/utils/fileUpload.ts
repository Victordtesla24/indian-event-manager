import api from './api';

interface UploadResponse {
  filename: string;
  filepath: string;
  size: number;
  url: string;
}

interface UploadError {
  message: string;
}

export async function uploadFile(file: File, path = 'uploads'): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('path', path);

  try {
    const response = await api.post<UploadResponse>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.data) {
      throw new Error('No data received from upload');
    }

    return {
      filename: response.data.filename,
      filepath: response.data.filepath,
      size: response.data.size,
      url: response.data.url,
    };
  } catch (error) {
    const err = error as UploadError;
    throw new Error(err.message || 'Failed to upload file');
  }
}

export async function deleteFile(filepath: string): Promise<void> {
  try {
    await api.delete(`/upload/${encodeURIComponent(filepath)}`);
  } catch (error) {
    const err = error as UploadError;
    throw new Error(err.message || 'Failed to delete file');
  }
}
