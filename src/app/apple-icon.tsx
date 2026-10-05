/* eslint-disable @next/next/no-img-element -- next/og renders plain <img> */
import { ImageResponse } from "next/og";
import { brandColors, logoSvg } from "@/lib/brand";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const mark = `data:image/svg+xml;base64,${Buffer.from(logoSvg("light", "#07146e")).toString("base64")}`;

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: brandColors.blue,
      }}
    >
      <img src={mark} width={98} height={129} alt="" />
    </div>,
    size,
  );
}
