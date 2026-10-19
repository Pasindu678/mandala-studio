import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart/cart-context";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import CartDrawer from "@/components/cart/CartDrawer";

export const metadata: Metadata = {
  title: "Mandala Studio — Ceylon Heritage & Sacred Geometry Art | ශ්‍රී ලාංකීය පූජනීය මණ්ඩල",
  description:
    "Discover authentic Sri Lankan Moonstone (Sandakada Pahana), sacred lotus rosettes, Kandyan liya wela filigree, and digital coloring books inspired by 2,500 years of Ceylon artistry.",
  keywords: [
    "mandala art sri lanka",
    "sandakada pahana vector",
    "sri lankan coloring book pdf",
    "sacred geometry ceylon",
    "kandyan filigree art",
    "nelum mal mandala",
    "nil manel vector design",
    "traditional sinhala art",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#FAF6EF] text-[#181512] selection:bg-[#D4AF37]/30 selection:text-[#72121E]">
        <CartProvider>
          <Navbar />
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
