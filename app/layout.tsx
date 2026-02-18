import type { Metadata } from "next";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import SideBar from "@/components/SideBar/SideBar";
import QueryProvider from "@/query/QueryProvider";
import { categoriesQueries, tagsQueries } from "@/query";
import { AppStateProvider } from "@/context/AppStateContext";
import { SidebarProvider } from "@/context/SidebarContext";
import { QUERY_CLIENT_DEFAULT_OPTIONS } from "@/lib";
import { Header } from "@/ui";
import { Suspense } from "react";
import "@/styles/index.css";

export const metadata: Metadata = {
  title: {
    template: "%s | 일상의실천",
    default: "일상의실천 - 데모",
  },
  description:
    "일상의실천은 다양한 창작 프로젝트를 선보이는 크리에이티브 스튜디오입니다. 브랜딩, 디자인, 전시 등 다양한 작업을 확인해보세요.",
  keywords: [
    "일상의실천",
    "크리에이티브",
    "디자인",
    "브랜딩",
    "전시",
    "everyday practice",
    "creative studio",
  ],
  authors: [{ name: "일상의실천" }],
  creator: "일상의실천",
  publisher: "일상의실천",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://hello-ep-seongeun.vercel.app/"),
  alternates: {
    canonical: "/",
    languages: {
      "ko-KR": "/",
      "en-US": "/en",
    },
  },
  openGraph: {
    title: "일상의실천 - 데모",
    description:
      "일상의실천은 다양한 창작 프로젝트를 선보이는 크리에이티브 스튜디오입니다.",
    url: "https://hello-ep-seongeun.vercel.app/",
    siteName: "일상의실천",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/assets/main.png",
        width: 1200,
        height: 630,
        alt: "일상의실천",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "일상의실천 - 데모",
    description:
      "일상의실천은 다양한 창작 프로젝트를 선보이는 크리에이티브 스튜디오입니다.",
    images: ["/assets/main.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/favicon.png", sizes: "180x180" }],
    shortcut: "/favicon.png",
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#131313",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient({
    defaultOptions: QUERY_CLIENT_DEFAULT_OPTIONS,
  });

  // 카테고리와 태그 데이터를 미리 패칭하여 초기 상태로 제공
  await Promise.all([
    queryClient.prefetchQuery(categoriesQueries.all()),
    queryClient.prefetchQuery(tagsQueries.all()),
  ]);

  return (
    <html lang="en">
      <body className="antialiased font-normal text-s flex flex-row gap-spacing-10 w-full">
        <AppStateProvider>
          <SidebarProvider defaultOpen={false}>
            <QueryProvider>
              <HydrationBoundary state={dehydrate(queryClient)}>
                <div className="flex flex-col w-full">
                  <Suspense fallback={<div className="h-headerH bg-black" />}>
                    <Header />
                  </Suspense>
                  {children}
                </div>
                <SideBar />
              </HydrationBoundary>
            </QueryProvider>
          </SidebarProvider>
        </AppStateProvider>
      </body>
    </html>
  );
}
