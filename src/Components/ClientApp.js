"use client";

import Post from "@/Components/post";
import { useEffect, useState, useMemo } from "react";
import getApi from "@/Components/newsApi";
import Navbar from "@/Components/navbar";
import { useRouter } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { debounce } from "lodash"; // 👈 Install: npm install lodash

export default function ClientApp() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [Country, setCountry] = useState("pk");
  const router = useRouter();

  // 👇 Debounce search
  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setDebouncedQuery(value);
      }, 500),
    []
  );

  const handleSearch = (finalQuery) => {
    setSearchQuery(finalQuery);
    debouncedSearch(finalQuery);
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["news", debouncedQuery, Country],
    queryFn: async ({ pageParam = null }) => {
      const result = await getApi(
        debouncedQuery || "latest",
        Country,
        pageParam
      );
      console.log(result);

      if (
        result?.error &&
        result?.message?.toLowerCase()?.includes("api credits")
      )
    //   ) {
    //     router.push("/error/429");
    //     return { articles: [], nextPage: false };
    //   }

    //   if (result?.error && result?.code === 429) {
    //     router.push("/error/429");
    //     return { articles: [], nextPage: false };
    //   }

      if (result?.error && result?.code === 500) {
        router.push("/error/500");
        return { articles: [], nextPage: false };
      }

      return result;
    },
    getNextPageParam: (lastPage) => lastPage.nextPage || false,
  });

  const articles = data?.pages?.flatMap((page) => page.articles) || [];

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const innerHeight = window.innerHeight;

      if (
        innerHeight + scrollTop + 300 >= scrollHeight &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage]);

  return (
    <>
      {isLoading ? (
        <div
          style={{
            background: "white",
            height: "100vh",
            width: "100vw",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 9999,
            flexDirection: "column",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100px",
              height: "100px",
            }}
          >
            <img
              src="/logoImg.png"
              alt="NewsIcon"
              style={{
                width: "70px",
                height: "50px",
                position: "absolute",
                top: "50%",
                left: "50%",
                background: "#0000",
                transform: "translate(-50%, -50%)",
                zIndex: 2,
                animation: "float 2s ease-in-out infinite",
              }}
            />

            <div
              className="spinner-border text-success"
              role="status"
              style={{
                width: "100px",
                height: "100px",
                borderWidth: "6px",
              }}
            />
          </div>

          <style jsx>{`
            @keyframes float {
              0% {
                transform: translate(-50%, -50%) translateY(0);
              }
              50% {
                transform: translate(-50%, -50%) translateY(-10px);
              }
              100% {
                transform: translate(-50%, -50%) translateY(0);
              }
            }
          `}</style>
        </div>
      ) : (
        <>
          <Navbar
            searchClick={handleSearch}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            country={Country}
            setCountry={setCountry}
          />

          {articles.length > 0 ? (
            <Post
              newsData={articles}
              loading={isFetchingNextPage}
              hasNextPage={hasNextPage}
            />
          ) : (
            <p className="mt-3 text-muted">No articles available</p>
          )}
        </>
      )}
    </>
  );
}
