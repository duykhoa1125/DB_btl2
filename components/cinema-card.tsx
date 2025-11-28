import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Film, ArrowRight } from "lucide-react";
import { Cinema } from "@/services/types";

interface CinemaCardProps {
  cinema: Cinema;
}

export function CinemaCard({ cinema }: CinemaCardProps) {
  return (
    <Card className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 flex flex-col h-full">
      {/* Decorative Header */}
      <div className="relative h-32 overflow-hidden bg-gradient-to-br from-primary/20 via-background to-accent/20 group-hover:from-primary/30 transition-all duration-500">
        <div className="absolute inset-0 flex items-center justify-center">
          <Film className="w-12 h-12 text-primary/40 group-hover:scale-110 transition-transform duration-500" />
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
            {cinema.name}
          </h3>
        </div>
      </div>

      <CardContent className="p-6 flex-1 space-y-4">
        <div className="flex items-start gap-3 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" />
          <span className="line-clamp-2">{cinema.address}</span>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 mt-auto">
        <Button
          className="w-full group/btn bg-gradient-to-r from-primary to-primary/90 hover:from-primary hover:to-primary shadow-lg hover:shadow-primary/30 transition-all duration-300"
          asChild
        >
          <Link href={`/cinemas/${cinema.cinema_id}`}>
            <span>Xem Lịch Chiếu</span>
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
