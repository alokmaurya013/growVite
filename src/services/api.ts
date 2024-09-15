import axios from 'axios';

export const fetchPaginatedData = async (page: number) => {
  try {
    const response = await axios.get(`https://api.artic.edu/api/v1/artworks?page=${page}`);
    const results = response.data.data.map((item: any) => ({
      id: item.id,
      title: item.title,
      place_of_origin: item.place_of_origin,
      artist_display: item.artist_display,
      inscriptions: item.inscriptions,
      date_start: item.date_start,
      date_end: item.date_end,
    }));
    
    return {
      data: results,
      totalRecords: response.data.pagination.total,
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      data: [],
      totalRecords: 0,
    };
  }
};
