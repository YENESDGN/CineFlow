export interface Content {
  id: number;
  title: string;
  posterUrl: string;
  year: number;
  genre: string[];
  rating: number;
  isInWatchlist: boolean;
  isWatched: boolean;
}

export interface Movie extends Content {
  duration: string;
  director: string;
}

export interface Series extends Content {
  seasons: number;
  creator: string;
  status: 'Ongoing' | 'Completed' | 'Cancelled';
}

export interface User {
  id: number;
  username: string;
  profileImage: string;
  watchlist: number[];
  watched: number[];
  ratings: {
    contentId: number;
    score: number;
  }[];
  reviews: {
    contentId: number;
    text: string;
    date: string;
  }[];
}