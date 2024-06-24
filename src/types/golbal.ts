export interface SinglePaintingDetialsProps {
  id: number;
  title: string;
  imageUrl: string;
  video: {
    id: number;
    videoId: string;
    title: string;
    description: string;
  };
  music: {
    id: number;
    url: string;
    title: string;
    artist: string;
    album: string;
    date: string;
    artwork: string;
    categoryId: number;
  };
  desc: string;
}
