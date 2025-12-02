import localFont from "next/font/local"

export const ggsans = localFont({
  src: [
    {
      path: "./font/ggsans-Normal.ttf",
      weight: "400"
    },
    {
      path: "./font/ggsans-Medium.ttf",
      weight: "500"
    },
    {
      path: "./font/ggsans-SemiBold.ttf",
      weight: "600"
    },
    {
      path: "./font/ggsans-Bold.ttf",
      weight: "700"
    },
    {
      path: "./font/ggsans-ExtraBold.ttf",
      weight: "800"
    },
  ],
})