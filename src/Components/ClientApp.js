"use client";

import Post from "@/Components/post";
import { useEffect, useState, useMemo } from "react";
import getApi from "@/Components/newsApi";
import Navbar from "@/Components/navbar";
import { useRouter } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function ClientApp() {
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [Country, setCountry] = useState("pk");
  const [user, setUser] = useState(null);
  const [loader, setLoader] = useState(false);
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSearch = (finalQuery) => {
    setInputValue(finalQuery);
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["news", inputValue || "latest", Country , loader],
    queryFn: async ({ pageParam = null }) => {
      const result = await getApi(inputValue || "latest", Country, pageParam);

      if (
        result?.error &&
        result?.message?.toLowerCase()?.includes("api credits")
      ) {
        router.push("/error/429");
        return { articles: [], nextPage: false };
      }

      if (result?.error && result?.code === 429) {
        router.push("/error/429");
        return { articles: [], nextPage: false };
      }

      if (result?.error && result?.code === 500) {
        router.push("/error/500");
        return { articles: [], nextPage: false };
      }
      return result;
    },
    getNextPageParam: (lastPage) => lastPage.nextPage || false,

    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
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
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const GetUser = async () => {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        console.log("Error While Fetching: " , error);
        
      }
    };
    GetUser();
  }, []);

  return (
    <>
      <Navbar
        searchClick={handleSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        country={Country}
        setCountry={setCountry}
        setFinalValue={setInputValue}
        user={user}
        setUser={setUser}
        setLoader={setLoader}
      />

      {isLoading ? (
        <Post
          newsData={articles}
          scrollLoading={isFetchingNextPage}
          loading={true}
          hasNextPage={hasNextPage}
        />
      ) : articles.length > 0 ? (
        <Post
          newsData={articles}
          scrollLoading={isFetchingNextPage}
          loading={false}
          hasNextPage={hasNextPage}
        />
      ) : (
        <p className="mt-3 text-muted">No articles available</p>
      )}
    </>
  );
}
