export interface Banner {
  id: number;
  title: string;
  description?: string;
  image_url: string;
  category?: string;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
