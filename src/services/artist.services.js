import axios from "axios";

const Axios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: "text/plain",
  },
});

export const getDetailArtist = async (id) => {
  try {
    const res = await Axios.get(`/artists/${id}/details`);
    console.log(res.data);
    return res.data;
  } catch (e) {
    console.error(e);
  }
};
