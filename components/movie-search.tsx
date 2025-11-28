"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, Loader2 } from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import movieService from "@/services/movieService"
import { Movie } from "@/services/types"
import { cn } from "@/lib/utils"

export function MovieSearch() {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [movies, setMovies] = React.useState<Movie[]>([])
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    if (query.length === 0) {
      setMovies([])
      return
    }

    const fetchMovies = async () => {
        setLoading(true)
        try {
            const results = await movieService.search(query)
            setMovies(results)
        } catch (error) {
            console.error("Search failed", error)
            setMovies([])
        } finally {
            setLoading(false)
        }
    }

    const timer = setTimeout(fetchMovies, 300)
    return () => clearTimeout(timer)
  }, [query])

  const handleSelect = (movieId: string) => {
    setOpen(false)
    setQuery("")
    router.push(`/movie/${movieId}`)
  }

  return (
    <div className="relative w-full max-w-sm">
        <Popover open={open && query.length > 0} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        className="pl-9 bg-secondary/50 border-transparent focus-visible:bg-background focus-visible:border-primary/50 transition-all w-full md:w-[300px]"
                        placeholder="Tìm kiếm phim..."
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value)
                            if (!open) setOpen(true)
                        }}
                        onFocus={() => setOpen(true)}
                    />
                </div>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[300px]" align="start" onOpenAutoFocus={(e) => e.preventDefault()}>
                 <Command shouldFilter={false}>
                    <CommandList>
                        {loading ? (
                            <div className="py-6 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Đang tìm kiếm...
                            </div>
                        ) : movies.length === 0 ? (
                             <CommandEmpty>Không tìm thấy phim.</CommandEmpty>
                        ) : (
                            <CommandGroup heading="Phim">
                                {movies.map((movie) => (
                                    <CommandItem
                                        key={movie.movie_id}
                                        value={movie.name}
                                        onSelect={() => handleSelect(movie.movie_id)}
                                        className="cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2 w-full">
                                            {movie.image && (
                                                <div className="h-10 w-8 flex-shrink-0 overflow-hidden rounded bg-muted">
                                                    <img 
                                                        src={movie.image} 
                                                        alt={movie.name} 
                                                        className="h-full w-full object-cover" 
                                                    />
                                                </div>
                                            )}
                                            <div className="flex flex-col overflow-hidden">
                                                <span className="truncate font-medium">{movie.name}</span>
                                                <span className="truncate text-xs text-muted-foreground">
                                                    {new Date(movie.release_date).getFullYear()}
                                                </span>
                                            </div>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                    </CommandList>
                 </Command>
            </PopoverContent>
        </Popover>
    </div>
  )
}
