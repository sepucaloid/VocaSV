import React, { forwardRef, useRef } from "react";
import * as htmlToImage from "html-to-image";
import { saveAs } from "file-saver";
import { useTheme } from "../utils/ThemeProvider";

export const DownloadImage = forwardRef((props, ref) => {
  const { theme } = useTheme();
  const darkMode = theme === "dark";

  const handleDownload = async () => {
    if (!ref.current) return;

    try {
      const dataUrl = await htmlToImage.toPng(ref.current, {
        quality: 1,
      });

      saveAs(dataUrl, (props.label === 'Published' ? 'date' : props.label?.toLowerCase()) + '.png');
    } catch (error) {
      console.error("Oops, something went during image generation!", error);
    }
  };

  return (
    <div
      ref={ref}
      onClick={handleDownload}
      style={{
        background: darkMode ? "#1e1e32" : "#e8e8e8",
        borderRadius: 14,
        padding: "14px 16px",
      }}
    >
      {props.children}
    </div>
  );
});
