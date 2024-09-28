export interface ApiRes<T> {
  status: boolean;
  message: string;
  data: {
    results: T;
  };
}

export interface ApiWithPaginations<T> {
  status: boolean;
  message: string;
  data: {
    results: {
      current_page: number;
      data: T;
      first_page_url: string;
      from: number;
      last_page: number;
      last_page_url: string;
      next_page_url: string;
      path: string;
      per_page: number;
      prev_page_url: string;
      to: number;
      total: number;
    };
  };
}

export interface PaintingApiRes {
  id: number;
  description: string;
  category: string;
  created_at: string;
  updated_at: string;
}
