export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/decks/:path*",
    "/flashcards/:path*",
    "/generate/:path*",
    "/practice/:path*",
    "/notes/:path*",
    "/settings/:path*",
  ],
};

