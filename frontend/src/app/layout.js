import "./globals.css";

export const metadata = {
  title: "Metro Route Finder",
  description: "Find the shortest path in metro network",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
