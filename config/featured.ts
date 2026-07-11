import { Movie } from "@/config/intefaces";

// The public API URL is configured per environment. The fallback keeps older
// deployments working while their environment variable is rolled out.
const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  "https://buzzflix2.titranx.com";

type FeaturedResponse = Movie | { movie?: Movie; data?: Movie | { movie?: Movie } };

export async function getFeaturedMovie(signal?: AbortSignal): Promise<Movie> {
  const response = await fetch(`${apiBaseUrl}/movie/featured`, {
    signal,
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Unable to load featured movie (${response.status})`);
  }

  const payload = (await response.json()) as FeaturedResponse;

  if ("data" in payload && payload.data) {
    return typeof payload.data === "object" && "movie" in payload.data
      ? payload.data.movie as Movie
      : payload.data as Movie;
  }

  return "movie" in payload && payload.movie ? payload.movie : payload as Movie;
}
