"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/Command";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Prisma, Subreddit } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import { Users } from "lucide-react";
import debounce from "lodash.debounce";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";

function SearchBar() {
  const [input, setInput] = useState<string>(""); // The input value

 
  const {
    data: queryResults,
    refetch,
    isFetched,
    isFetching,
  } = useQuery({
    queryFn: async () => {
      if (!input) return []; // If there is no input, don't fetch
      const { data } = await axios.get(`/api/search?q=${input}`);
      return data as (Subreddit & {
        _count: Prisma.SubredditCountOutputType;
      })[];
    },
    queryKey: ["search-query"], // To identify the query
    enabled: false, // If the query should be executed or not, we only want to fetch only when the user types not when the component renders
  });

  const request = debounce(() => {
      refetch()
  }, 300)

   // Maintains its integrity thourghout the component rerenders for the debounce to not get triggered multiple times
   // This method is what we call in each key stroke
   const debounceRequest = useCallback(() => { 
    request();
  }, [])

  const router = useRouter()
  const commandRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname()

  useOnClickOutside(commandRef, () => {
    setInput("");
  })

  useEffect(() => {
    setInput("")
  }, [pathname])

  return (
    <Command ref={commandRef} className="relative rounded-lg border max-w-lg z-50 overflow-visible">
      <CommandInput
        value={input}
        onValueChange={(text) => {
          setInput(text);
          debounceRequest()
        }}
        className="outline-none border-none focus:border-none focus:outline-none ring-0"
        placeholder="Search communitites"
      />

      {input.length > 0 ? (
        <CommandList className="absolute bg-white top-full inset-x-0 shadow rounded-b-md">
          {isFetched && <CommandEmpty>No results found.</CommandEmpty>}
          {(queryResults?.length ?? 0) > 0 ? <CommandGroup heading='Communities'>
            {queryResults?.map((subreddit) => (
              <CommandItem key={subreddit.id} onSelect={(e) => {
                router.push(`/r/${e}`)
                router.refresh() // To show the user the latest posts for that subreddit
              }}
              value={subreddit.name}
              >
                <Users className="mr-2 h-4 w-4" />
                <a href={`/r/${subreddit.name}`}>r/{subreddit.name}</a>
              </CommandItem>
            ))}
          </CommandGroup> : null}
        </CommandList>
      ) : null}
    </Command>
  );
}

export default SearchBar;
