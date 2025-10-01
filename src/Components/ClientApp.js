'use client';

import Post from "@/Components/post";
import { useEffect, useState } from "react";
import getApi from "@/Components/newsApi";
import Navbar from "@/Components/navbar";
import { useRouter } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import AiNewsSearch from "./AiNewsSearch";

export default function ClientApp() {
  const [searchQuery, setSearchQuery] = useState("latest");
  const [country, setCountry] = useState("pk");
  const [user, setUser] = useState(null);
  const [loader, setLoader] = useState(false);

  const router = useRouter();

  const fetchNews = async ({ pageParam = null }) => {
    const result = await getApi(searchQuery || "latest", country, pageParam, "en");

    if (result?.error) {
      if (result?.code === 429) router.push("/error/429");
      else if (result?.code === 500) router.push("/error/500");
      return { articles: [], nextPage: false };
    }

    return result;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useInfiniteQuery({
    queryKey: ["news", searchQuery, country, loader],
    queryFn: fetchNews,
    getNextPageParam: (lastPage) => lastPage.nextPage || false,
    refetchOnWindowFocus: false
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
        if (data.success) setUser(data.user);
      } catch (error) {
        console.log("Error While Fetching: ", error);
      }
    };
    GetUser();
  }, []);

  const handleSearchChange = (query, countryCode) => {
    setSearchQuery(query || "latest");
    setCountry(countryCode);
  };

  return (
    <>
      <AiNewsSearch />
      <Navbar
        onSearchChange={handleSearchChange}
        country={country}
        setCountry={setCountry}
        isSavedPage={false}
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
          layout="timeline"
        />
      ) : articles.length > 0 ? (
        <Post
          newsData={articles}
          scrollLoading={isFetchingNextPage}
          loading={false}
          hasNextPage={hasNextPage}
          layout="timeline"
        />
      ) : (
        <p className="mt-3 text-muted">No articles available</p>
      )}
    </>
  );
}
