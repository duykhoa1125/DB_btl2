"use client"

import { MovieCard } from "@/components/movie-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Sparkles, Clock } from "lucide-react";

interface MovieTabsProps {
  nowShowingMovies: any[];
  comingSoonMovies: any[];
}

export function MovieTabs({ nowShowingMovies, comingSoonMovies }: MovieTabsProps) {
    const [activeTab, setActiveTab] = useState("now-showing");
    
    return (
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
        <div className="flex justify-center">
          <TabsList className="grid w-full max-w-md grid-cols-2 p-1 bg-muted/50 backdrop-blur-sm rounded-full border border-border/50">
            <TabsTrigger 
              value="now-showing"
              className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Đang chiếu ({nowShowingMovies.length})
            </TabsTrigger>
            <TabsTrigger 
              value="coming-soon"
              className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300"
            >
              <Clock className="w-4 h-4 mr-2" />
              Sắp chiếu ({comingSoonMovies.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="now-showing" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {nowShowingMovies.length > 0 ? (
              nowShowingMovies.map((movie) => (
                <MovieCard key={movie.movieId} movie={movie} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-border/50 rounded-3xl bg-muted/20">
                <Sparkles className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                <p className="text-lg text-muted-foreground">
                  Không có phim đang chiếu
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="coming-soon" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {comingSoonMovies.length > 0 ? (
              comingSoonMovies.map((movie) => (
                <MovieCard key={movie.movieId} movie={movie} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-border/50 rounded-3xl bg-muted/20">
                <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                <p className="text-lg text-muted-foreground">
                  Không có phim sắp chiếu
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    );
}