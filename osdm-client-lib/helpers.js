import * as osdm_core from "./osdm";

export const expensiveSearchPlaces = async (searchQuery) => {
  let response = await osdm_core.getPlaces();
  return response?.places.filter((place) => place.name?.includes(searchQuery));
};
