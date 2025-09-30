import { Movie, Series, User } from '../types';

export const movies: Movie[] = [
  {
    id: 1,
    title: 'Inception',
    posterUrl: 'https://images.pexels.com/photos/15513767/pexels-photo-15513767.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    year: 2010,
    genre: ['Bilim Kurgu', 'Aksiyon'],
    rating: 8.8,
    isInWatchlist: false,
    isWatched: true,
    duration: '2s 28dk',
    director: 'Christopher Nolan'
  },
  {
    id: 2,
    title: 'The Godfather',
    posterUrl: 'https://images.pexels.com/photos/10802815/pexels-photo-10802815.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    year: 1972,
    genre: ['Suç', 'Drama'],
    rating: 9.2,
    isInWatchlist: true,
    isWatched: false,
    duration: '2s 55dk',
    director: 'Francis Ford Coppola'
  },
  {
    id: 3,
    title: 'Pulp Fiction',
    posterUrl: 'https://images.pexels.com/photos/15392148/pexels-photo-15392148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    year: 1994,
    genre: ['Suç', 'Drama'],
    rating: 8.9,
    isInWatchlist: true,
    isWatched: true,
    duration: '2s 34dk',
    director: 'Quentin Tarantino'
  },
  {
    id: 4,
    title: 'The Dark Knight',
    posterUrl: 'https://images.pexels.com/photos/9576124/pexels-photo-9576124.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    year: 2008,
    genre: ['Aksiyon', 'Suç', 'Drama'],
    rating: 9.0,
    isInWatchlist: false,
    isWatched: true,
    duration: '2s 32dk',
    director: 'Christopher Nolan'
  },
  {
    id: 5,
    title: 'Fight Club',
    posterUrl: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    year: 1999,
    genre: ['Drama'],
    rating: 8.8,
    isInWatchlist: true,
    isWatched: false,
    duration: '2s 19dk',
    director: 'David Fincher'
  },
  {
    id: 6,
    title: 'Interstellar',
    posterUrl: 'https://images.pexels.com/photos/3359671/pexels-photo-3359671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    year: 2014,
    genre: ['Macera', 'Drama', 'Bilim Kurgu'],
    rating: 8.6,
    isInWatchlist: false,
    isWatched: true,
    duration: '2s 49dk',
    director: 'Christopher Nolan'
  },
  {
    id: 7,
    title: 'The Matrix',
    posterUrl: 'https://images.pexels.com/photos/6447217/pexels-photo-6447217.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    year: 1999,
    genre: ['Aksiyon', 'Bilim Kurgu'],
    rating: 8.7,
    isInWatchlist: true,
    isWatched: true,
    duration: '2s 16dk',
    director: 'Lana Wachowski'
  },
  {
    id: 8,
    title: 'Parasite',
    posterUrl: 'https://images.pexels.com/photos/7232399/pexels-photo-7232399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    year: 2019,
    genre: ['Komedi', 'Drama', 'Gerilim'],
    rating: 8.5,
    isInWatchlist: false,
    isWatched: false,
    duration: '2s 12dk',
    director: 'Bong Joon-ho'
  }
];

export const series: Series[] = [
  {
    id: 101,
    title: 'Breaking Bad',
    posterUrl: 'https://images.pexels.com/photos/1444627/pexels-photo-1444627.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    year: 2008,
    genre: ['Suç', 'Drama', 'Gerilim'],
    rating: 9.5,
    isInWatchlist: true,
    isWatched: true,
    seasons: 5,
    creator: 'Vince Gilligan',
    status: 'Completed'
  },
  {
    id: 102,
    title: 'Game of Thrones',
    posterUrl: 'https://images.pexels.com/photos/1694900/pexels-photo-1694900.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    year: 2011,
    genre: ['Aksiyon', 'Macera', 'Drama'],
    rating: 9.2,
    isInWatchlist: false,
    isWatched: true,
    seasons: 8,
    creator: 'David Benioff',
    status: 'Completed'
  },
  {
    id: 103,
    title: 'Stranger Things',
    posterUrl: 'https://images.pexels.com/photos/7809465/pexels-photo-7809465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    year: 2016,
    genre: ['Drama', 'Fantastik', 'Korku'],
    rating: 8.7,
    isInWatchlist: true,
    isWatched: false,
    seasons: 4,
    creator: 'The Duffer Brothers',
    status: 'Ongoing'
  },
  {
    id: 104,
    title: 'The Wire',
    posterUrl: 'https://images.pexels.com/photos/6044198/pexels-photo-6044198.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    year: 2002,
    genre: ['Suç', 'Drama', 'Gerilim'],
    rating: 9.3,
    isInWatchlist: false,
    isWatched: false,
    seasons: 5,
    creator: 'David Simon',
    status: 'Completed'
  },
  {
    id: 105,
    title: 'The Crown',
    posterUrl: 'https://images.pexels.com/photos/15392150/pexels-photo-15392150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    year: 2016,
    genre: ['Biyografi', 'Drama', 'Tarih'],
    rating: 8.6,
    isInWatchlist: true,
    isWatched: true,
    seasons: 5,
    creator: 'Peter Morgan',
    status: 'Ongoing'
  },
  {
    id: 106,
    title: 'The Office',
    posterUrl: 'https://images.pexels.com/photos/2041627/pexels-photo-2041627.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    year: 2005,
    genre: ['Komedi'],
    rating: 8.9,
    isInWatchlist: true,
    isWatched: true,
    seasons: 9,
    creator: 'Greg Daniels',
    status: 'Completed'
  },
  {
    id: 107,
    title: 'Chernobyl',
    posterUrl: 'https://images.pexels.com/photos/157811/pexels-photo-157811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    year: 2019,
    genre: ['Drama', 'Tarih', 'Gerilim'],
    rating: 9.4,
    isInWatchlist: false,
    isWatched: true,
    seasons: 1,
    creator: 'Craig Mazin',
    status: 'Completed'
  },
  {
    id: 108,
    title: 'The Mandalorian',
    posterUrl: 'https://images.pexels.com/photos/4009401/pexels-photo-4009401.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    year: 2019,
    genre: ['Aksiyon', 'Macera', 'Bilim Kurgu'],
    rating: 8.8,
    isInWatchlist: true,
    isWatched: false,
    seasons: 3,
    creator: 'Jon Favreau',
    status: 'Ongoing'
  }
];

export const currentUser: User = {
  id: 1,
  username: 'Kullanıcı',
  profileImage: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  watchlist: [2, 3, 5, 7, 101, 103, 105, 106, 108],
  watched: [1, 3, 4, 6, 7, 101, 102, 105, 106, 107],
  ratings: [
    { contentId: 1, score: 9 },
    { contentId: 3, score: 8 },
    { contentId: 4, score: 10 },
    { contentId: 6, score: 7 },
    { contentId: 7, score: 9 },
    { contentId: 101, score: 10 },
    { contentId: 102, score: 8 },
    { contentId: 105, score: 7 },
    { contentId: 106, score: 9 },
    { contentId: 107, score: 10 }
  ],
  reviews: [
    { contentId: 1, text: 'Muhteşem bir film. Nolan yine harika bir iş çıkarmış.', date: '2023-10-15' },
    { contentId: 3, text: 'Tarantino\'nun en iyi filmlerinden.', date: '2023-09-22' },
    { contentId: 101, text: 'Tüm zamanların en iyi dizisi.', date: '2023-11-05' },
    { contentId: 102, text: 'Son sezon haricinde muhteşemdi.', date: '2023-08-17' }
  ]
};