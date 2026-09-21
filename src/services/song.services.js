import axios from "axios";
import { useState } from "react";

const Axios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: "text/plain",
  },
});

export const GetAllSongs = async (pages, search, tags) => {
  try {
    const res = await Axios.get(
      `/songs?start=${pages}&getTotalCount=true&maxResults=20&query=${search}&fields=AdditionalNames,MainPicture,Pvs&lang=Default&nameMatchMode=Auto&sort=RatingScore&${tags}childTags=false&artistParticipationStatus=Everything&onlyWithPvs=false`,
    );
    return res.data.items;
  } catch (e) {
    console.error(e);
  }
};

export const getDetail = async (id) => {
  try {
    const res = await Axios.get(`/songs/${id}/details`);
    return res;
  } catch (e) {
    console.error(e);
  }
};

export const getLyric = async (id) => {
  try {
    const res = await Axios.get(`songs/lyrics/${id}?v=39`);
    console.log(res);
    return res;
  } catch (e) {
    console.error(e);
  }
};

export const getType = async (id) => {
  try {
    const res = await Axios.get(`/tags/top?lang=Default&categoryName=Genres`);
    console.log("type", res);
    return res;
  } catch (e) {
    console.error(e);
  }
};
