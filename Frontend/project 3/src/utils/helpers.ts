export const formatRating = (rating: number | undefined | null): string => {
  if (rating === undefined || rating === null) {
    return 'N/A';
  }
  return rating.toFixed(1);
};

export const toggleWatchlist = (id: number, currentStatus: boolean) => {
  // In a real application, this would make an API call
  console.log(`${currentStatus ? 'Removing' : 'Adding'} item ${id} ${currentStatus ? 'from' : 'to'} watchlist`);
  return !currentStatus;
};

export const toggleWatched = (id: number, currentStatus: boolean) => {
  // In a real application, this would make an API call
  console.log(`Marking item ${id} as ${currentStatus ? 'unwatched' : 'watched'}`);
  return !currentStatus;
};

export const getTopRated = (items: any[], limit = 10) => {
  return [...items].sort((a, b) => b.rating - a.rating).slice(0, limit);
};

export const getNewest = (items: any[], limit = 10) => {
  return [...items].sort((a, b) => b.year - a.year).slice(0, limit);
};

export const getRandomSubset = (items: any[], limit = 10) => {
  const shuffled = [...items].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, limit);
};