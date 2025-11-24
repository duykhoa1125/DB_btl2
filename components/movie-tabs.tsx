"use client"

import { MovieCard } from "@/components/movie-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

interface MovieTabsProps {
  nowShowingMovies: any[];
  comingSoonMovies: any[];
}


export function MovieTabs({ nowShowingMovies, comingSoonMovies }: MovieTabsProps) {
    const [activeTab, setActiveTab] = useState("now-showing");
    return (
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-fit grid-cols-2">
          <TabsTrigger value="now-showing">
            Đang chiếu ({nowShowingMovies.length})
          </TabsTrigger>
          <TabsTrigger value="coming-soon">
            Sắp chiếu ({comingSoonMovies.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="now-showing" className="mt-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {nowShowingMovies.length > 0 ? (
              nowShowingMovies.map((movie) => (
                <MovieCard key={movie.movieId} movie={movie} />
              ))
            ) : (
              <p className="col-span-full py-12 text-center text-muted-foreground">
                Không có phim đang chiếu
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="coming-soon" className="mt-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {comingSoonMovies.length > 0 ? (
              comingSoonMovies.map((movie) => (
                <MovieCard key={movie.movieId} movie={movie} />
              ))
            ) : (
              <p className="col-span-full py-12 text-center text-muted-foreground">
                Không có phim sắp chiếu
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    );
}