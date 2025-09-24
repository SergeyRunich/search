import type { NextApiRequest, NextApiResponse } from "next";

type Item = { id: number; title: string; description: string };

const SAMPLE_DATA: Item[] = [
  { id: 1, title: "Apple MacBook Pro", description: 'Laptop 14" M1/M2' },
  { id: 2, title: "Asus ZenBook", description: "Lightweight laptop" },
  { id: 3, title: "Apple iPhone 14", description: "Phone with great camera" },
  { id: 4, title: "Samsung Galaxy S21", description: "Android flagship" },
  {
    id: 5,
    title: "Sony WH-1000XM4",
    description: "Noise-cancelling headphones",
  },
  { id: 6, title: "Dell XPS 13", description: "Compact developer laptop" },
  { id: 7, title: "Nintendo Switch", description: "Portable gaming console" },
  { id: 8, title: "GoPro Hero", description: "Action camera" },
  { id: 9, title: "Canon EOS R6", description: "Mirrorless camera" },
  { id: 10, title: "Bose QC35", description: "Comfortable headphones" },
  { id: 11, title: 'LG OLED TV 55"', description: "4K Smart TV" },
  { id: 12, title: 'Samsung QLED 65"', description: "Smart TV with HDR" },
  { id: 13, title: "Dyson V11 Vacuum", description: "Cordless vacuum cleaner" },
  { id: 14, title: "iRobot Roomba 960", description: "Robot vacuum" },
  { id: 15, title: "Instant Pot Duo", description: "Electric pressure cooker" },
  { id: 16, title: "Philips Airfryer XXL", description: "Oil-less fryer" },
  { id: 17, title: "Nespresso Vertuo", description: "Coffee machine" },
  {
    id: 18,
    title: "Breville Barista Express",
    description: "Espresso machine",
  },
  { id: 19, title: 'Sony Bravia 43"', description: "Full HD TV" },
  {
    id: 20,
    title: "Panasonic Lumix G85",
    description: "Mirrorless camera kit",
  },
  { id: 21, title: "Samsung Galaxy Tab S7", description: "Android tablet" },
  { id: 22, title: "Apple iPad Air", description: "Tablet with M1 chip" },
  { id: 23, title: "Fitbit Charge 5", description: "Fitness tracker" },
  { id: 24, title: "Garmin Forerunner 245", description: "Running watch" },
  {
    id: 25,
    title: "Anker Soundcore 2",
    description: "Portable Bluetooth speaker",
  },
  { id: 26, title: "JBL Flip 6", description: "Waterproof Bluetooth speaker" },
  {
    id: 27,
    title: "Microsoft Surface Laptop 5",
    description: "Windows ultrabook",
  },
  { id: 28, title: "HP Spectre x360", description: "Convertible laptop" },
  {
    id: 29,
    title: "KitchenAid Stand Mixer",
    description: "Mixer with attachments",
  },
  {
    id: 30,
    title: "Cuisinart Food Processor",
    description: "Multifunctional kitchen device",
  },
  { id: 31, title: "Samsung Galaxy Buds2", description: "Wireless earbuds" },
  {
    id: 32,
    title: "Apple AirPods Pro",
    description: "Noise-cancelling earbuds",
  },
  {
    id: 33,
    title: "Sony PlayStation 5",
    description: "Next-gen gaming console",
  },
  { id: 34, title: "Xbox Series X", description: "Powerful gaming console" },
  {
    id: 35,
    title: "LG Refrigerator 300L",
    description: "Energy-efficient fridge",
  },
  {
    id: 36,
    title: "Bosch Washing Machine 8kg",
    description: "Front load washing machine",
  },
  { id: 37, title: "Dyson Supersonic", description: "Hair dryer" },
  { id: 38, title: "Canon PIXMA TS8320", description: "All-in-one printer" },
  { id: 39, title: "Ecovacs Deebot T10", description: "Robot vacuum cleaner" },
  {
    id: 40,
    title: "Samsung Galaxy Watch 6",
    description: "Smartwatch with GPS",
  },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const q = (req.query.q as string | undefined) ?? "";
  // simulate variable network delay
  const randomDelay = Math.floor(200 + Math.random() * 900); // 200 - 1100 ms

  await new Promise((r) => setTimeout(r, randomDelay));

  // simple case-insensitive match in title or description
  const normalized = q.trim().toLowerCase();
  const results =
    normalized.length === 0
      ? []
      : SAMPLE_DATA.filter(
          (it) =>
            it.title.toLowerCase().includes(normalized) ||
            it.description.toLowerCase().includes(normalized)
        );

  res.status(200).json({ q, results, delay: randomDelay });
}
