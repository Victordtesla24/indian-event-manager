interface UploadResponse {
  url: string;
  error?: string;
}

export const uploadFile = async (file: File): Promise<UploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/v1/uploads/image', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to upload file');
    }

    const data = await response.json();
    return { url: data.url };
  } catch (error) {
    return {
      url: '',
      error: error instanceof Error ? error.message : 'Failed to upload file',
    };
  }
};
