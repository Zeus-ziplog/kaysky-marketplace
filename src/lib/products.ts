import p1 from "@/assets/product-1.jpg";
import p2 from "@/assets/product-2.jpg";
import p3 from "@/assets/product-3.jpg";
import p4 from "@/assets/product-4.jpg";
import p5 from "@/assets/product-5.jpg";
import p6 from "@/assets/product-6.jpg";

export type Product = {
  id: string;
  name: string;
  tagline: string;
  price: number; // KES
  image: string;
  category: string;
  stock: number;
};

export const products: Product[] = [
  { id: "kx-01", name: "Pop Block Tee", tagline: "Bold cut color-block print",     price: 2200, image: p1, category: "Tees",    stock: 12 },
  { id: "kx-02", name: "Hayls Slogan",  tagline: "Heavy typographic statement",     price: 2500, image: p2, category: "Tees",    stock: 8  },
  { id: "kx-03", name: "Face Study",    tagline: "Hand drawn portrait print",        price: 2400, image: p3, category: "Tees",    stock: 5  },
  { id: "kx-04", name: "Mask Mosaic",   tagline: "Heritage mask in pop palette",     price: 2800, image: p4, category: "Tees",    stock: 0  },
  { id: "kx-05", name: "Neon Hoodie",   tagline: "Statement hood in lime",           price: 4500, image: p5, category: "Hoodies", stock: 6  },
  { id: "kx-06", name: "Tolk Come Tote", tagline: "Carry the message",               price: 1500, image: p6, category: "Accessories", stock: 20 },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);
