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

//#region Painting
export interface PaintingApiRes {
  id: number;
  description: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface SinglePaintingApiRes {
  id: number;
  gallery_id: number;
  file: string;
  mime_type: string;
  size: number;
  created_at: string;
  updated_at: string;
}
//#endregion

//#region Audio
export interface Album {
  id: number;
  title: string;
  status: string;
  user_id: number;
  draft: number;
  trash: number;
  created_at: string;
  updated_at: string;
}
//#endregion

//#region Books
export interface BookApiRes {
  id: number;
  name: string;
  author: string;
  description: string;
  cover_photo: string;
  file: string;
  mime_type: string;
  size: number;
}
//#endregion 

//#region Biography
export interface BiographyApiRes{
  id:number;
  description:string;
}
