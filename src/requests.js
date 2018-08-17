import request from 'superagent';

export const GOOGLE_API_KEY = 'AIzaSyDGYkn6S3EH53_oP3r9X16CU2EfBAfBtNQ';

export const getNearbyPlaces = async (query) => {
  const res = await request
    .get('https://maps.googleapis.com/maps/api/place/nearbysearch/json')
    .query({ key: GOOGLE_API_KEY, language: 'en' })
    .query(query);

  return res.body;
};
