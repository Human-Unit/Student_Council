/* eslint-disable @next/next/no-img-element -- next/og renders plain <img> */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/data/site";
import { brandColors, logoSvg } from "@/lib/brand";

export const alt = "Студенческий совет филиала МГУ в Душанбе";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Static NT Somic instances (SIL OFL 1.1) so the image renders at build time
// in the brandbook typeface without network access.
const assets = join(process.cwd(), "src/assets");

const svgData = (svg: string) =>
  `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

export default async function OpenGraphImage() {
  const [regular, semibold, emblem] = await Promise.all([
    readFile(join(assets, "og-fonts/NTSomic-Regular.ttf")),
    readFile(join(assets, "og-fonts/NTSomic-Semibold.ttf")),
    readFile(join(assets, "og-emblem.png")),
  ]);

  return new ImageResponse(
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        background: brandColors.blue,
        color: brandColors.white,
        fontFamily: "NT Somic",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1200,
          height: 630,
          display: "flex",
          backgroundImage:
            "radial-gradient(circle at 76% 34%, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0) 52%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -260,
          top: 520,
          width: 1720,
          height: 560,
          borderRadius: "50%",
          background: brandColors.blueDeep,
          display: "flex",
        }}
      />
      <img
        src={svgData(logoSvg("light", "#07146e"))}
        width={366}
        height={480}
        alt=""
        style={{ position: "absolute", left: 770, top: 58 }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          padding: "54px 72px",
          width: 760,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <img
            src={`data:image/png;base64,${emblem.toString("base64")}`}
            width={72}
            height={68}
            alt=""
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 20,
              lineHeight: 1.3,
              color: "rgba(238, 238, 238, 0.86)",
            }}
          >
            <span>Филиал МГУ имени М. В. Ломоносова</span>
            <span>в городе Душанбе</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 54,
            fontSize: 86,
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: -2.6,
            textShadow: "0 8px 22px rgba(8, 22, 120, 0.3)",
          }}
        >
          <span>Студенческий</span>
          <span>совет филиала</span>
          <span>МГУ в Душанбе</span>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 28,
            lineHeight: 1.3,
            color: "rgba(238, 238, 238, 0.9)",
          }}
        >
          {site.tagline}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "NT Somic", data: regular, weight: 400, style: "normal" },
        { name: "NT Somic", data: semibold, weight: 600, style: "normal" },
      ],
    },
  );
}
