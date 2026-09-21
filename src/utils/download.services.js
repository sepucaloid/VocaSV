const SAVEFROM_API = "https://api-wh.savefrom.co.id/api/convert";

export const getDownloadLinks = async (youtubeUrl) => {
  const res = await fetch(SAVEFROM_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: youtubeUrl }),
  });

  if (!res.ok) throw new Error("Failed to fetch download links");

  const data = await res.json();

  return {
    title: data.meta?.title,
    thumbnail: data.thumb,
    mp4: data.url?.filter((u) => u.ext === "mp4" && u.isConverterUI) || [],
    mp3: {
      192: data.stream?.mp3?.["192"]?.streams?.[0] || null,
      256: data.stream?.mp3?.["256"]?.streams?.[0] || null,
      320: data.stream?.mp3?.["320"]?.streams?.[0] || null,
    },
  };
};

export const downloadFile = (url) => {
  window.open(url, "_blank");
};
