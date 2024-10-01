import * as osdm_core from "./osdm";

export const expensiveSearchPlaces = async (base_url, searchQuery) => {
  let response = await osdm_core.getPlaces(base_url);
  return response?.places.filter((place) => place.name?.includes(searchQuery));
};
