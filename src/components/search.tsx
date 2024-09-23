"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Input } from "./ui/input";

export const Search = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [query, setQuery] = useState("");

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <Input
      placeholder="Search for a recipe..."
      className="w-full"
      onChange={(e) => {
        setQuery(e.target.value);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleSearch(query);
        }
      }}
    />
  );
};
