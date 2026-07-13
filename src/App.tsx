import React, { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { 
  MessageSquare, 
  Layers, 
  Map, 
  UserCheck, 
  Send, 
  Mountain as MountainIcon, 
  Flame, 
  Backpack, 
  Footprints, 
  ShieldCheck, 
  AlertTriangle, 
  HelpCircle, 
  Info, 
  Check, 
  Plus, 
  Minus, 
  Calendar, 
  User, 
  ArrowRight,
  Sparkles,
  ShoppingBag,
  FileDown,
  LogOut,
  Lock,
  Globe,
  Chrome,
  Upload,
  Trash2,
  CheckCircle,
  AlertCircle,
  School,
  CreditCard,
  Receipt,
  Search,
  SlidersHorizontal,
  RotateCcw,
  History
} from "lucide-react";
import { MOUNTAINS, GEAR_ITEMS, PACKAGES } from "./data";
import { ChatMessage, UserProfile, GearItem, RentalPackage } from "./types";
import MountainCard from "./components/MountainCard";
import ProfileSection from "./components/ProfileSection";
import DashboardOwner from "./components/DashboardOwner";

export interface GearInventoryItem {
  id: string;
  kategori: string;
  nama: string;
  model: string;
  warna: string;
  merek: string;
  ukuran: string;
  total_stok: number;
  sedang_disewa: number;
  tersedia: number;
  harga: number;
  gambar_url: string;
  // Alternate user requested names for direct compatibility
  name?: string;
  price?: number;
  specs?: string;
  stok?: number;
  sewa?: number;
  ready?: number;
  image?: string;
}

const INITIAL_GEAR_INVENTORY: GearInventoryItem[] = [
  // KATEGORI: TENDA & FLYSHEET
  { 
    id: "tenda-2p", 
    kategori: "Tenda", 
    nama: "Tenda Dome Double Layer (2P)", 
    name: "Tenda Dome Double Layer (2P)",
    model: "Dome Double Layer", 
    specs: "Dome Double Layer",
    warna: "Hijau Army, Abu-abu, Orange, Biru, Kuning", 
    merek: "Consina, Eiger, Naturehike, Rei", 
    ukuran: "2P", 
    total_stok: 15, 
    stok: 15,
    sedang_disewa: 0, 
    sewa: 0,
    tersedia: 15, 
    ready: 15,
    harga: 30000, 
    price: 30000,
    gambar_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2ZxLlpxk2HCutP54vYYcLkMT1t4Etxsg98MlTC0Mt0Q&s=10"
  },
  { 
    id: "tenda-4p", 
    kategori: "Tenda", 
    nama: "Tenda Dome Double Layer (4P)", 
    name: "Tenda Dome Double Layer (4P)",
    model: "Dome Double Layer", 
    specs: "Dome Double Layer",
    warna: "Hijau Army, Orange, Biru, Merah, Abu-abu", 
    merek: "Consina, Eiger, Naturehike, Rei", 
    ukuran: "4P", 
    total_stok: 15, 
    stok: 15,
    sedang_disewa: 0, 
    sewa: 0,
    tersedia: 15, 
    ready: 15,
    harga: 40000, 
    price: 40000,
    gambar_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGMmKXwRCVJTiWDQA3RcCuu0EcUBZ0jHj5DM6uRuZp1Q&s=10"
  },
  { 
    id: "tenda-6p", 
    kategori: "Tenda", 
    nama: "Tenda Dome Double Layer (6P)", 
    name: "Tenda Dome Double Layer (6P)",
    model: "Dome Double Layer", 
    specs: "Dome Double Layer",
    warna: "Hijau Army, Kuning, Biru, Abu-abu, Merah", 
    merek: "Consina, Eiger, Naturehike, Rei", 
    ukuran: "6P", 
    total_stok: 15, 
    stok: 15,
    sedang_disewa: 0, 
    sewa: 0,
    tersedia: 15, 
    ready: 15,
    harga: 60000, 
    price: 60000,
    gambar_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0va2WEvVXCZKQxM8EJSsZwf8S2a9Tqql2mbRn23szmA&s=10"
  },
  { 
    id: "flysheet-3x4", 
    kategori: "Flysheet", 
    nama: "Flysheet Camping 3x4m", 
    name: "Flysheet Camping 3x4m",
    model: "Ripstop Waterproof", 
    specs: "Ripstop Waterproof",
    warna: "Hijau Army, Hitam, Biru Navy, Silver, Merah", 
    merek: "Standard", 
    ukuran: "3x4 m", 
    total_stok: 15, 
    stok: 15,
    sedang_disewa: 0, 
    sewa: 0,
    tersedia: 15, 
    ready: 15,
    harga: 15000, 
    price: 15000,
    gambar_url: "data:image/webp;base64,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"
  },

  // KATEGORI: TAS & TIDUR
  { 
    id: "carrier-60l", 
    kategori: "Carrier", 
    nama: "Tas Carrier 60L", 
    name: "Tas Carrier 60L",
    model: "Hiking Backpack 60L", 
    specs: "Hiking Backpack 60L",
    warna: "Hitam, Hijau, Biru Navy, Merah, Kuning, Orange", 
    merek: "Consina, Eiger, Avtech, Rei", 
    ukuran: "60L", 
    total_stok: 15, 
    stok: 15,
    sedang_disewa: 0, 
    sewa: 0,
    tersedia: 15, 
    ready: 15,
    harga: 25000, 
    price: 25000,
    gambar_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWCeVTUunq9piW-gZi8vjjoLbf-xY_E46A6yq8bGFjbA&s=10"
  },
  { 
    id: "carrier-80l", 
    kategori: "Carrier", 
    nama: "Tas Carrier 80L", 
    name: "Tas Carrier 80L",
    model: "Hiking Backpack 80L", 
    specs: "Hiking Backpack 80L",
    warna: "Hitam, Biru, Merah, Orange, Abu-abu", 
    merek: "Consina, Eiger, Avtech, Rei", 
    ukuran: "80L", 
    total_stok: 15, 
    stok: 15,
    sedang_disewa: 0, 
    sewa: 0,
    tersedia: 15, 
    ready: 15,
    harga: 35000, 
    price: 35000,
    gambar_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnY-PC3O_3JNif4XkTCNJzMhDbmPxlTijfoTpxkpp2Sg&s=10"
  },
  { 
    id: "sleeping-bag", 
    kategori: "Sleeping Bag", 
    nama: "Sleeping Bag Mummy", 
    name: "Sleeping Bag Mummy",
    model: "Mummy Thermal", 
    specs: "Mummy Thermal",
    warna: "Hitam, Biru Navy, Merah, Hijau Army, Orange", 
    merek: "Consina, Rei, Naturehike", 
    ukuran: "Dewasa, Anak-anak", 
    total_stok: 15, 
    stok: 15,
    sedang_disewa: 0, 
    sewa: 0,
    tersedia: 15, 
    ready: 15,
    harga: 10000, 
    price: 10000,
    gambar_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4CtaodjAc_oGh1A9T9mjvTAmp0EZq1XJKraYXu0r8GQ&s=10"
  },
  { 
    id: "matras-thermal", 
    kategori: "Matras", 
    nama: "Matras Angin Thermal", 
    name: "Matras Angin Thermal",
    model: "Inflatable Thermal", 
    specs: "Inflatable Thermal",
    warna: "Silver, Hitam, Biru, Merah, Hijau", 
    merek: "Standard", 
    ukuran: "180x50 cm", 
    total_stok: 15, 
    stok: 15,
    sedang_disewa: 0, 
    sewa: 0,
    tersedia: 15, 
    ready: 15,
    harga: 12000, 
    price: 12000,
    gambar_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQy0F-4HI7IhgXqEjVtgF04EGQFlkGRppBHNVavwMIqNQ&s=10"
  },

  // KATEGORI: MASAK & GAS
  { 
    id: "kompor", 
    kategori: "Kompor", 
    nama: "Kompor Camping Portable Butane", 
    name: "Kompor Camping Portable Butane",
    model: "Portable Gas Stove", 
    specs: "Portable Gas Stove",
    warna: "Hitam, Silver, Hijau Army, Orange, Kuning", 
    merek: "Fire Maple, Widesea, SPEEDS", 
    ukuran: "Standar", 
    total_stok: 15, 
    stok: 15,
    sedang_disewa: 0, 
    sewa: 0,
    tersedia: 15, 
    ready: 15,
    harga: 10000, 
    price: 10000,
    gambar_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsUIRzzV2sHbuTTHd33b4IblpLzoriNzPd7-l71U4XZA&s=10"
  },
  { 
    id: "nesting", 
    kategori: "Nesting", 
    nama: "Nesting / Cooking Set Outdoor", 
    name: "Nesting / Cooking Set Outdoor",
    model: "Aluminium Hard Anodized", 
    specs: "Aluminium Hard Anodized",
    warna: "Abu-abu, Hitam, Silver, Cokelat, Merah", 
    merek: "Standard", 
    ukuran: "2-3 orang, 4-5 orang", 
    total_stok: 15, 
    stok: 15,
    sedang_disewa: 0, 
    sewa: 0,
    tersedia: 15, 
    ready: 15,
    harga: 10000, 
    price: 10000,
    gambar_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTb-1cQ2YjnxelGi7gRW3DgLfxNDlBS2FBJB52P6KoyKA&s=10"
  },
  { 
    id: "gas-kaleng", 
    kategori: "Gas Kaleng", 
    nama: "Tabung Gas Portable (Isi Penuh)", 
    name: "Tabung Gas Portable (Isi Penuh)",
    model: "Butane 230g Full", 
    specs: "Butane 230g Full",
    warna: "Silver, Gold, Hitam, Merah, Biru", 
    merek: "Hi-Cook, Super Cook", 
    ukuran: "Standar", 
    total_stok: 15, 
    stok: 15,
    sedang_disewa: 0, 
    sewa: 0,
    tersedia: 15, 
    ready: 15,
    harga: 8000, 
    price: 8000,
    gambar_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4VVFGDKa0jqKaNTaFHBqmoNb3V1vtpho68OY77VwGog&s=10"
  },
  { 
    id: "alat-makan-set", 
    kategori: "Nesting", 
    nama: "Alat Makan Set Camping (Stainless)", 
    name: "Alat Makan Set Camping (Stainless)",
    model: "Stainless Steel Cutlery Set", 
    specs: "Stainless Steel Cutlery Set",
    warna: "Silver, Hitam, Rainbow", 
    merek: "Standard", 
    ukuran: "Set Lengkap", 
    total_stok: 15, 
    stok: 15,
    sedang_disewa: 0, 
    sewa: 0,
    tersedia: 15, 
    ready: 15,
    harga: 5000, 
    price: 5000,
    gambar_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReQlnyBJHr-WtMO-6a6h2OskAgHqFmYhVGIPjCdNiuJQ&s=10"
  },

  // KATEGORI: PAKAIAN & PROTEKSI
  { 
    id: "jaket-outdoor", 
    kategori: "Pakaian & Proteksi", 
    nama: "Jaket Outdoor Waterproof / Windproof", 
    name: "Jaket Outdoor Waterproof / Windproof",
    model: "Waterproof Windbreaker", 
    specs: "Waterproof Windbreaker",
    warna: "Hitam, Abu-abu, Hijau Army, Biru Navy, Merah, Orange", 
    merek: "Eiger, Consina", 
    ukuran: "S, M, L, XL, XXL", 
    total_stok: 15, 
    stok: 15,
    sedang_disewa: 0, 
    sewa: 0,
    tersedia: 15, 
    ready: 15,
    harga: 15000, 
    price: 15000,
    gambar_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTOFTPRDA2Z95KqkPmUZ_yDaj3GDH4URc_gC9u9uwmBw&s=10"
  },
  { 
    id: "celana-cargo", 
    kategori: "Pakaian & Proteksi", 
    nama: "Celana Cargo Quickdry Hiking", 
    name: "Celana Cargo Quickdry Hiking",
    model: "Quickdry Stretch Cargo", 
    specs: "Quickdry Stretch Cargo",
    warna: "Hitam, Abu-abu, Hijau Army, Khaki, Cokelat, Navy", 
    merek: "Arei, Eiger", 
    ukuran: "28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38", 
    total_stok: 15, 
    stok: 15,
    sedang_disewa: 0, 
    sewa: 0,
    tersedia: 15, 
    ready: 15,
    harga: 12000, 
    price: 12000,
    gambar_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtQd74Oh6ZirhhVmzdB5nt1t0uSDG6-0qGXsQpoF6XLQ&s"
  },
  { 
    id: "sepatu-gunung", 
    kategori: "Pakaian & Proteksi", 
    nama: "Sepatu Gunung Hiking Grip Sol", 
    name: "Sepatu Gunung Hiking Grip Sol",
    model: "High Grip Hiking Shoes", 
    specs: "High Grip Hiking Shoes",
    warna: "Hitam, Cokelat, Abu-abu, Tan, Biru, Hijau Army", 
    merek: "SNTA, Eiger", 
    ukuran: "38, 39, 40, 41, 42, 43, 44, 45", 
    total_stok: 15, 
    stok: 15,
    sedang_disewa: 0, 
    sewa: 0,
    tersedia: 15, 
    ready: 15,
    harga: 20000, 
    price: 20000,
    gambar_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtPyjHOY1k1iQ_1xxwZo8pu16t0cAG4yyXe0P2rv9Yjg&s"
  },
  { 
    id: "base-layer", 
    kategori: "Pakaian & Proteksi", 
    nama: "Base Layer Thermal Stretch", 
    name: "Base Layer Thermal Stretch",
    model: "Thermal Quickdry Stretch", 
    specs: "Thermal Quickdry Stretch",
    warna: "Hitam, Abu-abu, Biru Navy, Merah, Putih", 
    merek: "Core, Outdoor", 
    ukuran: "S, M, L, XL, XXL", 
    total_stok: 15, 
    stok: 15,
    sedang_disewa: 0, 
    sewa: 0,
    tersedia: 15, 
    ready: 15,
    harga: 8000, 
    price: 8000,
    gambar_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjQPlpN0BmoZBCjwB6LPCU7xrlJlZXN7ZZe-OMKXWsMw&s=10"
  },

  // KATEGORI: AKSESORIS & LAINNYA
  { 
    id: "headlamp", 
    kategori: "Headlamp", 
    nama: "Headlamp LED Rechargeable", 
    name: "Headlamp LED Rechargeable",
    model: "LED High Lumen Rechargeable", 
    specs: "LED High Lumen Rechargeable",
    warna: "Hitam, Orange, Biru, Merah, Hijau", 
    merek: "Naturehike, Nitecore, Eiger", 
    ukuran: "300 lumen, 500 lumen", 
    total_stok: 15, 
    stok: 15,
    sedang_disewa: 0, 
    sewa: 0,
    tersedia: 15, 
    ready: 15,
    harga: 7000, 
    price: 7000,
    gambar_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1eLGWXB78sR9bPv8IH31X10NhDU97wo45ARRwuHssfA&s"
  },
  { 
    id: "trekking-pole", 
    kategori: "Trekking Pole", 
    nama: "Trekking Pole Folding Hiking", 
    name: "Trekking Pole Folding Hiking",
    model: "Foldable Aluminium Pole", 
    specs: "Foldable Aluminium Pole",
    warna: "Hitam, Merah, Biru, Silver, Gold, Hijau", 
    merek: "Standard", 
    ukuran: "65-135 cm", 
    total_stok: 15, 
    stok: 15,
    sedang_disewa: 0, 
    sewa: 0,
    tersedia: 15, 
    ready: 15,
    harga: 8000, 
    price: 8000,
    gambar_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQx80jLhvqHCBBKKZqhjOvYgi6aeECqrb-oNBsbcStxg&s=10"
  },
  { 
    id: "kursi-lipat", 
    kategori: "Kursi Lipat", 
    nama: "Kursi Lipat Camping (Folding Chair)", 
    name: "Kursi Lipat Camping (Folding Chair)",
    model: "Folding Camp Chair", 
    specs: "Folding Camp Chair",
    warna: "Hitam, Hijau Army, Khaki, Cream, Abu-abu", 
    merek: "Standard", 
    ukuran: "Kecil, Sedang, Besar", 
    total_stok: 15, 
    stok: 15,
    sedang_disewa: 0, 
    sewa: 0,
    tersedia: 15, 
    ready: 15,
    harga: 10000, 
    price: 10000,
    gambar_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwNszAs-XMkn6qQBW9FPE_xO-_jfvjykocDQw-uTcWJQ&s=10"
  },
  { 
    id: "meja-lipat", 
    kategori: "Meja Lipat", 
    nama: "Meja Lipat Aluminium Outdoor", 
    name: "Meja Lipat Aluminium Outdoor",
    model: "Aluminium Foldable Table", 
    specs: "Aluminium Foldable Table",
    warna: "Silver, Hitam, Cokelat Kayu, Hijau Army, Khaki", 
    merek: "Standard", 
    ukuran: "60x40 cm, 90x60 cm", 
    total_stok: 15, 
    stok: 15,
    sedang_disewa: 0, 
    sewa: 0,
    tersedia: 15, 
    ready: 15,
    harga: 15000, 
    price: 15000,
    gambar_url: "https://images.unsplash.com/photo-1532413992378-f169ac26fff3?q=80&w=500&auto=format&fit=crop",
    image: "https://images.unsplash.com/photo-1532413992378-f169ac26fff3?q=80&w=500&auto=format&fit=crop"
  },
  { 
    id: "hammock", 
    kategori: "Hammock", 
    nama: "Hammock Single", 
    name: "Hammock Single",
    model: "Nylon Single Hammock", 
    specs: "Nylon Single Hammock",
    warna: "Hijau Army, Biru, Merah, Orange, Hitam, Kuning", 
    merek: "Standard", 
    ukuran: "Single, Double", 
    total_stok: 15, 
    stok: 15,
    sedang_disewa: 0, 
    sewa: 0,
    tersedia: 15, 
    ready: 15,
    harga: 7000, 
    price: 7000,
    gambar_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNXz75h3wiifKmTC4jobwWGVbF3QEW9iheIcWlH9cg-Q&s=10"
  }
];

export default function App() {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("eleva_logged_in") === "true";
  });

  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean>(() => {
    return localStorage.getItem("eleva_onboarding_completed") === "true";
  });

  const [userRole, setUserRole] = useState<"admin" | "user" | null>(() => {
    return (localStorage.getItem("eleva_user_role") as "admin" | "user" | null) || null;
  });

  // Login Form States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginMethod, setLoginMethod] = useState<"credentials" | "google">("credentials");

  // Onboarding Registration Form States
  const [onboardingName, setOnboardingName] = useState("");
  const [onboardingUniversity, setOnboardingUniversity] = useState("");
  const [onboardingStudentId, setOnboardingStudentId] = useState("");
  const [onboardingAddress, setOnboardingAddress] = useState("");
  const [onboardingIdentityType, setOnboardingIdentityType] = useState<"KTP" | "KTM" | "SIM">("KTM");
  const [onboardingFileUrl, setOnboardingFileUrl] = useState<string | null>(null);
  const [onboardingDragActive, setOnboardingDragActive] = useState(false);
  const [isOnboardingVerifying, setIsOnboardingVerifying] = useState(false);
  const onboardingFileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Custom Modal States (Iframe sandbox compatible)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {}
  });

  const [alertDialog, setAlertDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: "",
    message: ""
  });

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const showAlert = (title: string, message: string) => {
    setAlertDialog({
      isOpen: true,
      title,
      message
    });
  };

  // Navigation State
  const [activeTab, setActiveTab] = useState<"chat" | "mountains" | "packages" | "profile">("chat");

  // Booking Receipt States
  const [showReceipt, setShowReceipt] = useState<boolean>(false);
  const [receiptId, setReceiptId] = useState<string>("");
  const [bookingTimestamp, setBookingTimestamp] = useState<string>("");
  const [paymentModalOpen, setPaymentModalOpen] = useState<boolean>(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"COD" | "QRIS" | null>(null);
  const [receiptPaymentMethod, setReceiptPaymentMethod] = useState<"COD" | "QRIS" | null>(null);
  // Konfigurasi QRIS Eleva RentCamp (Dukungan penuh untuk file lokal 1000275887.jpg atau fallback dinamis)
  const [qrisString, setQrisString] = useState<string>(() => {
    const saved = localStorage.getItem("eleva_qris_string");
    const oldCorrupted1 = "00020101021226650016ID10265279665700103A015204531153033605802ID5915FEBBY'S, OTOMOTIF6005MALANG61056512662070703A016304A3A5";
    const oldCorrupted2 = "00020101021126260015ID10265279665700103A015204531153033605802ID5917FEBBY'S, OTOMOTIF6006MALANG61056512662070703A0163040EF1";
    const validQris = "00020101021126660014ID.CO.QRIS.WWW01189360091410265279660215ID10265279665700303UME5204531153033605802ID5917FEBBY'S, OTOMOTIF6006MALANG61056512662070703A016304B2AD";
    if (!saved || saved === oldCorrupted1 || saved === oldCorrupted2) {
      localStorage.setItem("eleva_qris_string", validQris);
      return validQris;
    }
    return saved;
  });
  const [qrisImageUrl, setQrisImageUrl] = useState<string>(() => {
    return localStorage.getItem("eleva_qris_image_url") || "/src/assets/1000275887.jpg";
  });
  const [qrisTab, setQrisTab] = useState<"auto" | "image">("auto");

  // User Profile State (persisted to localStorage)
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("eleva_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return {
      name: "",
      university: "",
      studentId: "",
      ktmUrl: null,
      ktpUrl: null,
      isVerified: false
    };
  });

  useEffect(() => {
    localStorage.setItem("eleva_profile", JSON.stringify(profile));
    
    if (profile.name) {
      const savedTenants = localStorage.getItem("eleva_registered_tenants");
      let tenantsList = [];
      if (savedTenants) {
        try {
          const parsed = JSON.parse(savedTenants);
          if (parsed && Array.isArray(parsed)) {
            tenantsList = parsed;
          }
        } catch (err) {}
      }
      
      const nameToMatch = profile.name;
      const existingIdx = tenantsList.findIndex((t: any) => t.name === nameToMatch || (profile.studentId && t.nim === profile.studentId));
      
      const newTenantObj = {
        id: existingIdx !== -1 ? tenantsList[existingIdx].id : "tenant_" + Date.now().toString(),
        name: profile.name,
        nim: profile.studentId || "-",
        univ: profile.university || "Umum / Non-Mahasiswa",
        phone: "081234567890",
        verified: profile.isVerified,
        joinedAt: existingIdx !== -1 ? (tenantsList[existingIdx].joinedAt || new Date().toLocaleDateString("id-ID")) : new Date().toLocaleDateString("id-ID"),
        address: profile.address || "Malang",
        identityType: profile.identityType || "KTM",
        identityFileUrl: profile.ktmUrl || "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80"
      };
      
      if (existingIdx !== -1) {
        tenantsList[existingIdx] = { ...tenantsList[existingIdx], ...newTenantObj };
      } else {
        tenantsList.unshift(newTenantObj);
      }
      localStorage.setItem("eleva_registered_tenants", JSON.stringify(tenantsList));
    }
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("eleva_logged_in", isLoggedIn ? "true" : "false");
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem("eleva_onboarding_completed", isOnboardingCompleted ? "true" : "false");
  }, [isOnboardingCompleted]);

  // QRIS Drawing Canvas Effect (Client-side, pure black/white, maximum scanner compatibility)
  useEffect(() => {
    if (selectedPaymentMethod === "QRIS" && qrisTab === "auto" && canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        qrisString,
        {
          width: 260,
          margin: 2,
          color: {
            dark: "#000000",  // Pure Black for crisp scanning
            light: "#FFFFFF" // Pure White background
          },
          errorCorrectionLevel: "H" // High robustness
        },
        (error) => {
          if (error) {
            console.error("Gagal menggambar QR Code ke canvas:", error);
          }
        }
      );
    }
  }, [selectedPaymentMethod, qrisString, qrisTab]);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem("eleva_chat_history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
      } catch (e) {}
    }
    return [
      {
        id: "welcome",
        role: "assistant",
        content: "Halo! Kenalin, aku **CampaBot**, asisten virtual pintar sekaligus teman pendakianmu dari **Eleva**.\n\nMau mendaki ke mana kita hari ini? Atau sedang mencari persewaan alat gunung **Eleva RentCamp**? Silakan tanya apa saja, aku siap bantu menyiapkan perlengkapan pendakianmu agar aman dan nyaman! Keselamatan adalah yang utama! 🔥🌲",
        timestamp: new Date()
      }
    ];
  });

  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Save Chat history
  useEffect(() => {
    localStorage.setItem("eleva_chat_history", JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Rental Simulator State
  const [selectedGear, setSelectedGear] = useState<{ [gearId: string]: number }>({});
  const [rentDuration, setRentDuration] = useState<number>(3); // default 3 days
  const [simulatedMountain, setSimulatedMountain] = useState<string>("panderman");
  const [checkoutSuccess, setCheckoutSuccess] = useState<boolean>(false);
  const [searchGear, setSearchGear] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  // Selected custom options per gear (size & color)
  const [selectedGearDetails, setSelectedGearDetails] = useState<{ [gearId: string]: { size: string; color: string } }>({});

  const parseOptions = (text: string) => {
    if (!text) return [];
    // Split by comma first, then slash, then ampersand
    const parts = text.split(/[,&]/).flatMap(p => p.split('/')).map(s => s.trim()).filter(Boolean);
    // De-duplicate
    return Array.from(new Set(parts));
  };

  const getGearSize = (itemId: string, itemUkuran: string) => {
    if (selectedGearDetails[itemId]?.size) {
      return selectedGearDetails[itemId].size;
    }
    const sizes = parseOptions(itemUkuran);
    return sizes[0] || itemUkuran;
  };

  const getGearColor = (itemId: string, itemWarna: string) => {
    if (selectedGearDetails[itemId]?.color) {
      return selectedGearDetails[itemId].color;
    }
    const colors = parseOptions(itemWarna);
    return colors[0] || itemWarna;
  };

  // Real-time Gear Inventory State (initially full stock, changes with transactions)
  const [gearInventory, setGearInventory] = useState<GearInventoryItem[]>(() => {
    const saved = localStorage.getItem("eleva_gear_inventory");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as GearInventoryItem[];
        // Merge so we get any new items/images/categories, while preserving rental status of existing ones
        return INITIAL_GEAR_INVENTORY.map(initItem => {
          const matched = parsed.find(p => p.id === initItem.id);
          if (matched) {
            return {
              ...initItem,
              sedang_disewa: matched.sedang_disewa,
              tersedia: matched.tersedia
            };
          }
          return initItem;
        });
      } catch (e) {
        // Fallback
      }
    }
    return INITIAL_GEAR_INVENTORY;
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("eleva_gear_inventory", JSON.stringify(gearInventory));
  }, [gearInventory]);

  // Simulated Transactions History State
  const [simulatedTransactions, setSimulatedTransactions] = useState<any[]>(() => {
    const saved = localStorage.getItem("eleva_simulated_transactions");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("eleva_simulated_transactions", JSON.stringify(simulatedTransactions));
  }, [simulatedTransactions]);

  // Quick chips for interactive questions (updated with CampaBot prompt contexts)
  const SUGGESTIONS = [
    { label: "Saya mau ke Panderman, butuh alat apa?", text: "Saya mau naik ke Panderman, butuh alat apa aja Sam?" },
    { label: "Jaminannya apa Sam?", text: "Mbak, kalau mau sewa alat di Eleva itu jaminannya harus ninggalin KTP asli ya?" },
    { label: "Butuh alat apa untuk ke Semeru?", text: "Sam, aku maba UB mau naik ke Semeru tapi gapunya alat sama sekali. Butuh apa aja?" },
    { label: "Bagaimana cara pinjam kompor?", text: "Bagaimana cara menambah barang eceran ke keranjang sewa?" },
    { label: "Tolong carikan resep bakso Malang", text: "Tolong carikan resep bakso Malang asli yang paling enak dong!" } // anti-hallucination test
  ];

  // Send message to Backend
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const chatHistoryForAPI = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages: chatHistoryForAPI })
      });

      if (!response.ok) {
        throw new Error("Gagal terhubung dengan server CampaBot.");
      }

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply,
        timestamp: new Date()
      }]);
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Waduh Sam, sepurane banget (maaf). Koneksiku lagi terganggu kayak lagi badai di puncak Welirang. Pastikan API Key mu sudah diisi di menu Secrets ya Ker, atau coba kirim pesan lagi!",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    showConfirm("Hapus Riwayat Chat", "Apakah Anda yakin ingin menghapus semua riwayat obrolan dengan CampaBot?", () => {
      const initial = [
        {
          id: "welcome",
          role: "assistant",
          content: "Halo! Kenalin, aku **CampaBot**, asisten virtual pintar sekaligus teman pendakianmu dari **Eleva**.\n\nMau mendaki ke mana kita hari ini? Atau sedang mencari persewaan alat gunung **Eleva RentCamp**? Silakan tanya apa saja, aku siap bantu menyiapkan perlengkapan pendakianmu agar aman dan nyaman! Keselamatan adalah yang utama! 🔥🌲",
          timestamp: new Date()
        }
      ];
      setMessages(initial);
      localStorage.setItem("eleva_chat_history", JSON.stringify(initial));
    });
  };

  // Quick Action: Consult a mountain
  const handleConsultMountain = (mountainName: string) => {
    setActiveTab("chat");
    handleSendMessage(`Saya mau naik ke ${mountainName}, butuh rekomendasi alat apa aja Ker?`);
  };

  // Quick Action: Rent for specific mountain (fully recommended gear)
  const handleRentForMountain = (mountainId: string) => {
    const m = MOUNTAINS.find(mountain => mountain.id === mountainId);
    if (!m) return;
    setActiveTab("packages");
    setSimulatedMountain(mountainId);

    // Map old recommended gear IDs to new gear IDs
    const idMap: { [key: string]: string } = {
      tenda_dome: "tenda-2p",
      sb_biasa: "sleeping-bag",
      matras_spons: "matras",
      kompor_mini: "kompor",
      tenda_double: "tenda-4p",
      nesting_set: "nesting",
      headlamp: "headlamp",
      tenda_storm: "tenda-6p",
      sb_tebal: "sleeping-bag",
      jaket_thermal: "sarung-tangan",
      sepatu_kuat: "trekking-pole",
      carrier_60l: "carrier-60l"
    };

    const defaultGear: { [id: string]: number } = {};
    m.recommendedGearIds.forEach(gid => {
      const mappedId = idMap[gid] || gid;
      defaultGear[mappedId] = 1;
    });
    setSelectedGear(defaultGear);
  };

  // Apply a preset package to the simulator (kept for fallback compatibility, mapped to new gear)
  const applyPackageToSimulator = (pkg: RentalPackage) => {
    // Map old IDs
    const idMap: { [key: string]: string } = {
      tenda_dome: "tenda-2p",
      sb_biasa: "sleeping-bag",
      matras_spons: "matras",
      kompor_mini: "kompor",
      tenda_double: "tenda-4p",
      nesting_set: "nesting",
      headlamp: "headlamp",
      tenda_storm: "tenda-6p",
      sb_tebal: "sleeping-bag",
      jaket_thermal: "sarung-tangan",
      sepatu_kuat: "trekking-pole",
      carrier_60l: "carrier-60l"
    };

    const nextGear: { [id: string]: number } = {};
    pkg.gearIds.forEach(id => {
      const mappedId = idMap[id] || id;
      nextGear[mappedId] = 1;
    });
    setSelectedGear(nextGear);
    if (pkg.type === "ringan") {
      setSimulatedMountain("panderman");
    } else if (pkg.type === "sedang") {
      setSimulatedMountain("butak");
    } else {
      setSimulatedMountain("semeru");
    }
    showAlert("Paket Diterapkan", `Paket "${pkg.name}" berhasil diterapkan ke Simulator Sewa!`);
  };

  // Calculations for Simulator
  const calculateTotalBasePrice = () => {
    let total = 0;
    Object.entries(selectedGear).forEach(([id, qty]) => {
      const item = INITIAL_GEAR_INVENTORY.find(g => g.id === id);
      if (item) {
        total += item.harga * (qty as number);
      }
    });
    return total;
  };

  const getActiveDiscounts = () => {
    const isCombo = Object.keys(selectedGear).length >= 4;
    return {
      campusDiscount: profile.isVerified ? 0.10 : 0, // 10% for verified active student
      comboDiscount: isCombo ? 0.05 : 0, // 5% for renting 4+ items
    };
  };

  const basePricePerDay = calculateTotalBasePrice();
  const discounts = getActiveDiscounts();
  const discountMultiplier = 1 - (discounts.campusDiscount + discounts.comboDiscount);
  const finalPricePerDay = Math.round(basePricePerDay * discountMultiplier);
  const totalCost = finalPricePerDay * rentDuration;

  // Safety checklist validation based on selected mountain
  const getSafetyReport = () => {
    const selectedMountainObj = MOUNTAINS.find(m => m.id === simulatedMountain);
    if (!selectedMountainObj) return { status: "unknown", missingGear: [] };

    const difficulty = selectedMountainObj.difficulty;
    
    if (difficulty === "Trek Dingin/Tinggi") {
      // High/extreme treks require carrier, sb_tebal, jaket_thermal, sepatu_kuat, tenda_storm
      const criticalItems = [
        { id: "sb_tebal", name: "Sleeping Bag Polar Tebal" },
        { id: "jaket_thermal", name: "Jaket Thermal / Windproof" },
        { id: "sepatu_kuat", name: "Sepatu Tracking Kokoh" },
        { id: "carrier_60l", name: "Tas Carrier 60L+" },
        { id: "tenda_storm", name: "Tenda Kualitas Badai (Stormproof)" }
      ];
      const missing = criticalItems.filter(item => !selectedGear[item.id] || selectedGear[item.id] < 1);
      return {
        status: missing.length === 0 ? "safe" : "warning",
        missingGear: missing,
        message: "Peringatan keselamatan: Gunung berhawa ekstrem! Harap lengkapi gear pelindung thermal dan badai."
      };
    } else if (difficulty === "Trek Sedang") {
      // Trek sedang requires double-layer tent, senter kepala, nesting, matras
      const criticalItems = [
        { id: "tenda_double", name: "Tenda Double Layer" },
        { id: "nesting_set", name: "Nesting (Panci Camping)" },
        { id: "headlamp", name: "Senter Kepala (Headlamp)" }
      ];
      const missing = criticalItems.filter(item => !selectedGear[item.id] || selectedGear[item.id] < 1);
      return {
        status: missing.length === 0 ? "safe" : "warning",
        missingGear: missing,
        message: "Rekomendasi kenyamanan: Jalur tanah berakar & berangin dingin di malam hari. Tenda double layer & headlamp sangat disarankan."
      };
    }

    return { status: "safe", missingGear: [] };
  };

  const safetyReport = getSafetyReport();

  const handleCheckoutSim = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    const formattedDate = now.toLocaleDateString("id-ID", options);
    
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const trxId = `ELV-${year}${month}${day}-${randomNum}`;

    setReceiptId(trxId);
    setBookingTimestamp(`${formattedDate} WIB`);
    setCheckoutSuccess(true);
    setShowReceipt(true);
  };

  const handleCopyReceiptText = () => {
    const selectedMountainObj = MOUNTAINS.find(m => m.id === simulatedMountain);
    const itemsText = Object.entries(selectedGear)
      .map(([id, qty]) => {
        const item = INITIAL_GEAR_INVENTORY.find(g => g.id === id);
        if (item) {
          const chosenSize = getGearSize(item.id, item.ukuran);
          const chosenColor = getGearColor(item.id, item.warna);
          return `- ${item.nama} [Ukuran: ${chosenSize}, Warna: ${chosenColor}] (x${qty}) @ Rp ${item.harga.toLocaleString("id-ID")}/hari = Rp ${(item.harga * (qty as number)).toLocaleString("id-ID")}`;
        }
        return "";
      })
      .filter(Boolean)
      .join("\n");

    const activeDiscounts = getActiveDiscounts();
    const campusDiscountAmt = activeDiscounts.campusDiscount > 0 ? (basePricePerDay * 0.10) : 0;
    const comboDiscountAmt = activeDiscounts.comboDiscount > 0 ? (basePricePerDay * 0.05) : 0;

    const plainText = `
========================================
       ELEVA OUTDOOR RENTAL MALANG
       Basecamp Lowokwaru, Malang
========================================
STRUK BOOKING RESERVASI ALAT GUNUNG
----------------------------------------
No. Struk : ${receiptId}
Tanggal   : ${bookingTimestamp}
Kasir     : CampaBot AI
========================================
DATA DIRI PELANGGAN:
Nama      : ${profile.name}
Kampus    : ${profile.university || "-"}
Identitas : ${profile.identityType || "KTM"} (${profile.studentId || "-"})
Alamat    : ${profile.address || "-"}
Status    : ${profile.isVerified ? "✓ VERIFIED (Bebas Deposit Tunai)" : "⚠️ UNVERIFIED (Wajib Jaminan Fisik)"}
========================================
GUNUNG TUJUAN: ${selectedMountainObj?.name || "-"}
DURASI SEWA  : ${rentDuration} Hari
----------------------------------------
DAFTAR PERLENGKAPAN YANG DISEWA:
${itemsText}
========================================
RINCIAN BIAYA:
Tarif Eceran : Rp ${basePricePerDay.toLocaleString("id-ID")}/hari
${comboDiscountAmt > 0 ? `Diskon Combo : -Rp ${comboDiscountAmt.toLocaleString("id-ID")}/hari` : ""}
${campusDiscountAmt > 0 ? `Diskon KTM   : -Rp ${campusDiscountAmt.toLocaleString("id-ID")}/hari` : ""}
Tarif Akhir  : Rp ${finalPricePerDay.toLocaleString("id-ID")}/hari
----------------------------------------
GRAND TOTAL  : Rp ${totalCost.toLocaleString("id-ID")}
========================================
Matur Nuwun, Sam/Mbak!
Jaga keselamatan, utamakan keselamatan diri,
dan bawa pulang kembali sampahmu ke kota.
========================================
`.trim();

    navigator.clipboard.writeText(plainText);
    showAlert("Struk Disalin", "Teks struk booking berhasil disalin! Silakan kirimkan ke WhatsApp admin Eleva.");
  };

  const handleProcessBooking = (paymentMethod: "COD" | "QRIS") => {
    if (Object.keys(selectedGear).length === 0) {
      showAlert("Gagal Memproses", "Pilihlah minimal 1 item untuk diproses.");
      return;
    }

    // Full checkout simulation: update stocks & add transaction record
    let success = true;
    const updatedInventory = gearInventory.map(item => {
      const requestedQty = selectedGear[item.id] || 0;
      if (requestedQty > 0) {
        if (item.tersedia < requestedQty) {
          success = false;
        }
        return {
          ...item,
          sedang_disewa: item.sedang_disewa + requestedQty,
          tersedia: item.tersedia - requestedQty
        };
      }
      return item;
    });

    if (!success) {
      showAlert("Gagal Memproses", "Waduh Sam! Beberapa item yang ingin disewa melebihi kapasitas stok ready kami saat ini. Silakan atur ulang kuantitas atau sewa produk sejenis.");
      return;
    }

    // Write Transaction Log
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    };
    const formattedDate = now.toLocaleDateString("id-ID", options);

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const trxId = `ELV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${randomNum}`;

    const txItems = Object.entries(selectedGear).map(([id, qty]) => {
      const item = gearInventory.find(g => g.id === id);
      return {
        id,
        nama: item?.nama || id,
        qty,
        ukuran: item ? getGearSize(item.id, item.ukuran) : "-",
        warna: item ? getGearColor(item.id, item.warna) : "-",
        subtotal: Number(item?.harga || 0) * Number(qty) * Number(rentDuration)
      };
    });

    const newTx = {
      receiptId: trxId,
      timestamp: `${formattedDate} WIB`,
      tenantName: profile.name || "Penyewa Mandiri",
      studentId: profile.studentId || "-",
      university: profile.university || "Umum / Non-Mahasiswa",
      statusVerified: profile.isVerified,
      mountainName: simulatedMountain,
      duration: rentDuration,
      items: txItems,
      totalCost,
      status: "Sukses",
      paymentMethod: paymentMethod
    };

    setGearInventory(updatedInventory);
    setSimulatedTransactions(prev => [newTx, ...prev]);
    
    setReceiptId(trxId);
    setBookingTimestamp(`${formattedDate} WIB`);
    setCheckoutSuccess(true);
    setShowReceipt(true);
    setReceiptPaymentMethod(paymentMethod);

    // Save to local storage for registered tenants as well, to keep dashboard in sync
    const savedTenants = localStorage.getItem("eleva_registered_tenants");
    let tenantsList = [];
    if (savedTenants) {
      try {
        tenantsList = JSON.parse(savedTenants);
      } catch (err) {}
    }
    const nameToMatch = profile.name || "Penyewa Mandiri";
    const existingIdx = tenantsList.findIndex((t: any) => t.name === nameToMatch || (profile.studentId && t.nim === profile.studentId));
    if (existingIdx === -1) {
      const newTenantObj = {
        id: "tenant_" + Date.now().toString(),
        name: nameToMatch,
        nim: profile.studentId || "-",
        univ: profile.university || "Umum / Non-Mahasiswa",
        phone: "081234567890",
        verified: profile.isVerified,
        joinedAt: new Date().toLocaleDateString("id-ID"),
        address: profile.address || "Jl. Bendungan Sigura-gura No. 12, Lowokwaru, Malang",
        identityType: profile.isVerified ? "KTM" : "KTP",
        identityFileUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80"
      };
      tenantsList.unshift(newTenantObj);
      localStorage.setItem("eleva_registered_tenants", JSON.stringify(tenantsList));
    }

    setPaymentModalOpen(false);
    showAlert("Pemesanan Berhasil", paymentMethod === "QRIS" 
      ? `Pembayaran QRIS sebesar Rp ${totalCost.toLocaleString("id-ID")} berhasil diverifikasi! Transaksi telah diset menjadi "Sukses" secara real-time.`
      : `Booking COD sebesar Rp ${totalCost.toLocaleString("id-ID")} berhasil dikonfirmasi! Transaksi telah diset menjadi "Sukses" secara real-time.`
    );
  };

  // Google Campus Login Simulation
  const handleGoogleLogin = () => {
    setIsTyping(true);
    // Simulate a pop-up delay
    setTimeout(() => {
      setProfile({
        name: "",
        university: "",
        studentId: "",
        ktmUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80",
        ktpUrl: null,
        isVerified: false // Verified once registration form is submitted
      });
      setOnboardingName("");
      setOnboardingUniversity("");
      setOnboardingStudentId("");
      setOnboardingAddress("");
      setOnboardingFileUrl(null);
      
      setUserRole("user");
      localStorage.setItem("eleva_user_role", "user");
      setIsLoggedIn(true);
      setIsOnboardingCompleted(false);
      setIsTyping(false);
    }, 1500);
  };

  const handleCredentialLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      showAlert("Input Kosong", "Silakan masukkan email dan password Anda.");
      return;
    }

    if (loginEmail === "admin@rental.com" && loginPassword === "admin123") {
      setUserRole("admin");
      setIsLoggedIn(true);
      setIsOnboardingCompleted(true);
      localStorage.setItem("eleva_user_role", "admin");
      localStorage.setItem("eleva_logged_in", "true");
      showAlert("Login Pemilik Sukses", "Selamat datang kembali, Admin Eleva Muncak! Mengalihkan ke Owner Dashboard...");
    } else {
      setUserRole("user");
      setIsLoggedIn(true);
      
      const savedOnboarding = localStorage.getItem("eleva_onboarding_completed") === "true";
      setIsOnboardingCompleted(savedOnboarding);
      localStorage.setItem("eleva_user_role", "user");
      localStorage.setItem("eleva_logged_in", "true");
      
      const savedProfile = localStorage.getItem("eleva_profile");
      if (!savedProfile) {
        setProfile({
          name: "",
          university: "",
          studentId: "",
          ktmUrl: null,
          ktpUrl: null,
          isVerified: false
        });
        setOnboardingName("");
        setOnboardingUniversity("");
        setOnboardingStudentId("");
        setOnboardingAddress("");
      }
      
      showAlert("Login Berhasil", "Selamat datang kembali di Eleva Muncak! Silakan nikmati Katalog Persewaan Alat Gunung.");
    }
    setLoginEmail("");
    setLoginPassword("");
  };

  const handleLogout = () => {
    showConfirm("Keluar Aplikasi", "Apakah Sam/Mbak yakin ingin keluar dari aplikasi Eleva?", () => {
      setIsLoggedIn(false);
      setIsOnboardingCompleted(false);
      setUserRole(null);
      localStorage.removeItem("eleva_user_role");
      localStorage.setItem("eleva_logged_in", "false");
    });
  };

  const openInNewTab = () => {
    window.open(window.location.href, "_blank");
  };

  // Styles block for marquee animation
  const marqueeStyle = `
    @keyframes marquee {
      0% { transform: translateX(0%); }
      100% { transform: translateX(-50%); }
    }
    .animate-marquee-custom {
      display: flex;
      width: max-content;
      animation: marquee 35s linear infinite;
    }
  `;

  // Render Login / Landing Page if not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0b0f19] via-[#0f2a1d] to-[#041a10] text-slate-100 flex flex-col font-sans relative overflow-hidden select-none items-center justify-center p-4">
        <style>{marqueeStyle}</style>
        {/* Decorative Blur Backdrops */}
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>
        <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>

        {/* Brand identity */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/20 ring-4 ring-emerald-400/20 mx-auto mb-3 animate-bounce">
            <span className="text-4xl">🏔️</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white font-display">
            ELEVA <span className="text-emerald-400">MUNCAK</span>
          </h1>
          <p className="text-xs text-emerald-300 font-mono tracking-widest mt-1">SEWA ALAT GUNUNG MAHASISWA MALANG</p>
        </div>

        {/* Login Container Card */}
        <div className="w-full max-w-md bg-stone-900/85 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-2xl text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
              <Lock className="w-5 h-5 text-emerald-400" />
              Portal Masuk Eleva
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Platform persewaan alat mendaki gunung Jatim terpercaya, khusus mahasiswa Malang. Jaminan KTM aktif tanpa deposit tunai!
            </p>
          </div>

          {/* Login Method Selector */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-stone-950/60 rounded-xl border border-white/5">
            <button
              onClick={() => setLoginMethod("credentials")}
              className={`py-2 px-3 text-xs font-bold rounded-lg transition-all ${
                loginMethod === "credentials"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Email &amp; Sandi
            </button>
            <button
              onClick={() => setLoginMethod("google")}
              className={`py-2 px-3 text-xs font-bold rounded-lg transition-all ${
                loginMethod === "google"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Google SSO
            </button>
          </div>

          {loginMethod === "credentials" ? (
            <form onSubmit={handleCredentialLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider font-mono">Alamat Email</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="nama@kampus.com atau admin@rental.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-950/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-emerald-500 transition-all text-slate-100 placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider font-mono">Kata Sandi</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Sandi akun sewa atau admin123"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-950/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-emerald-500 transition-all text-slate-100 placeholder:text-slate-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl transition-all shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
              >
                <span>Masuk Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="space-y-3 pt-2">
              {/* Primary Google Login Button */}
              <button
                onClick={handleGoogleLogin}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-3 active:scale-[0.98] cursor-pointer"
              >
                <Chrome className="w-5 h-5 shrink-0" />
                Masuk dengan Akun Google Kampus
              </button>

              {/* Quick Helper for Google popup blocked */}
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 text-left text-xs text-slate-300 leading-relaxed space-y-2">
                <p className="font-bold text-amber-300 flex items-center gap-1.5 font-mono text-[10px]">
                  ⚠️ PEMBERITAHUAN PENTING:
                </p>
                <p>
                  Untuk alasan keamanan data & verifikasi jaminan KTM, <strong>wajib menggunakan Akun Google Kampus aktif</strong> untuk mengakses layanan persewaan Eleva.
                </p>
                <p className="text-[11px] text-slate-400">
                  Jika proses login Google tidak muncul akibat batasan sandbox browser/iframe, silakan klik tombol <strong>BUKA DI TAB BARU</strong> di bawah ini untuk kelancaran pendaftaran.
                </p>
              </div>

              {/* Open in new tab button */}
              <button
                onClick={openInNewTab}
                className="w-full py-3 px-4 bg-sky-950/25 hover:bg-sky-950/45 text-sky-300 border border-sky-500/20 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
              >
                <Globe className="w-4 h-4" />
                BUKA DI TAB BARU
              </button>
            </div>
          )}

          <div className="border-t border-white/10 pt-4 flex justify-between text-[10px] text-slate-500 font-mono tracking-wide">
            <span>UMM • UB • UM • POLINEMA</span>
            <span>SAFETY FIRST ⛺️</span>
          </div>
        </div>

        <p className="text-[10px] text-slate-600 font-mono mt-8">
          Eleva RentCamp Ngalam © 2026. All rights reserved.
        </p>
      </div>
    );
  }

  // Render Onboarding / Registration Form if Google login succeeded but onboarding not completed
  if (isLoggedIn && !isOnboardingCompleted && userRole !== "admin") {
    const handleOnboardingFile = async (file: File) => {
      setIsOnboardingVerifying(true);
      try {
        const convertToBase64 = (f: File): Promise<{ base64: string, mimeType: string }> => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(f);
            reader.onload = () => {
              const result = reader.result as string;
              const commaIndex = result.indexOf(",");
              const base64 = result.substring(commaIndex + 1);
              const mimeType = f.type || "image/jpeg";
              resolve({ base64, mimeType });
            };
            reader.onerror = (error) => reject(error);
          });
        };

        const { base64, mimeType } = await convertToBase64(file);

        const res = await fetch("/api/verify-document", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: base64, mimeType }),
        });

        if (!res.ok) {
          throw new Error("Gagal melakukan verifikasi ke server.");
        }

        const data = await res.json();
        
        if (data.valid) {
          if (data.name) setOnboardingName(data.name);
          if (data.idNumber) setOnboardingStudentId(data.idNumber);
          if (data.type) {
            setOnboardingIdentityType(data.type as "KTP" | "KTM" | "SIM");
          }
          const dataUrl = `data:${mimeType};base64,${base64}`;
          setOnboardingFileUrl(dataUrl);
          showAlert("VALIDASI BERHASIL", data.message);
        } else {
          setOnboardingFileUrl(null);
          showAlert("VALIDASI GAGAL", data.message);
        }
      } catch (err: any) {
        console.error("Verification error:", err);
        setOnboardingFileUrl(null);
        showAlert(
          "Validasi Gagal",
          "Waduh Sam/Mbak, terjadi kesalahan koneksi saat memproses dokumen dengan AI. Silakan coba unggah ulang foto dokumen Anda yang jelas!"
        );
      } finally {
        setIsOnboardingVerifying(false);
      }
    };

    const handleOnboardingDrag = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setOnboardingDragActive(true);
      } else if (e.type === "dragleave") {
        setOnboardingDragActive(false);
      }
    };

    const handleOnboardingDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setOnboardingDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleOnboardingFile(e.dataTransfer.files[0]);
      }
    };

    const handleOnboardingFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        handleOnboardingFile(e.target.files[0]);
      }
    };

    const handleOnboardingSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!onboardingAddress.trim()) {
        showAlert("Alamat Kos Wajib Diisi", "Harap isi alamat tinggal/kos Anda di Malang sebagai bagian dari data jaminan sewa.");
        return;
      }
      if (!onboardingFileUrl) {
        showAlert("Foto Identitas Belum Diunggah", "Harap unggah foto KTM, KTP, atau SIM Anda terlebih dahulu.");
        return;
      }

      setProfile({
        name: onboardingName,
        university: onboardingUniversity,
        studentId: onboardingStudentId,
        address: onboardingAddress,
        identityType: onboardingIdentityType,
        ktmUrl: onboardingFileUrl,
        ktpUrl: onboardingIdentityType === "KTP" ? onboardingFileUrl : null,
        isVerified: true
      });

      // Synchronize to eleva_registered_tenants so admin can view this tenant's document
      const savedTenants = localStorage.getItem("eleva_registered_tenants");
      let tenantsList = [];
      if (savedTenants) {
        try {
          tenantsList = JSON.parse(savedTenants);
        } catch (err) {}
      }

      const existingIdx = tenantsList.findIndex((t: any) => t.name === onboardingName || (onboardingStudentId && t.nim === onboardingStudentId));
      const newTenantObj = {
        id: existingIdx !== -1 ? tenantsList[existingIdx].id : "tenant_" + Date.now().toString(),
        name: onboardingName,
        nim: onboardingStudentId || "-",
        univ: onboardingUniversity || "Umum / Non-Mahasiswa",
        phone: "081234567890",
        verified: true,
        joinedAt: new Date().toLocaleDateString("id-ID"),
        address: onboardingAddress,
        identityType: onboardingIdentityType,
        identityFileUrl: onboardingFileUrl
      };

      if (existingIdx !== -1) {
        tenantsList[existingIdx] = { ...tenantsList[existingIdx], ...newTenantObj };
      } else {
        tenantsList.unshift(newTenantObj);
      }
      localStorage.setItem("eleva_registered_tenants", JSON.stringify(tenantsList));

      setIsOnboardingCompleted(true);
      showAlert("Pendaftaran Berhasil", "Akun Eleva Anda berhasil didaftarkan dan diaktifkan dengan jaminan KTM/KTP/SIM digital! Selamat berselancar, Sam/Mbak!");
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0b0f19] via-[#0f2a1d] to-[#041a10] text-slate-100 flex flex-col font-sans relative overflow-hidden select-none items-center justify-center p-4">
        {/* Decorative Blur Backdrops */}
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>
        <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>

        {/* Brand identity */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/20 ring-4 ring-emerald-400/20 mx-auto mb-3">
            <span className="text-3xl">🏔️</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white font-display">
            ELEVA <span className="text-emerald-400">MUNCAK</span>
          </h1>
          <p className="text-[10px] text-emerald-300 font-mono tracking-wider">PORTAL REGISTRASI PENYEWA</p>
        </div>

        {/* Onboarding Form Card */}
        <div className="w-full max-w-xl bg-stone-900/85 backdrop-blur-2xl border border-white/10 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto custom-scroll">
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-white flex items-center justify-center sm:justify-start gap-2">
              <UserCheck className="w-5 h-5 text-emerald-400" />
              Form Pendaftaran Penyewa
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Lengkapi identitas Anda sebagai jaminan sewa bebas biaya deposit tunai.
            </p>
          </div>

          <form onSubmit={handleOnboardingSubmit} className="space-y-4 text-left">
            {/* Input Nama */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider font-mono">Nama Lengkap</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  value={onboardingName}
                  onChange={(e) => setOnboardingName(e.target.value)}
                  placeholder="Contoh: Sam Bento Wijaya"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-950/40 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all text-slate-100 placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Input Alamat Kos */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider font-mono">Alamat Kos / Rumah di Malang</label>
              <textarea
                required
                rows={2}
                value={onboardingAddress}
                onChange={(e) => setOnboardingAddress(e.target.value)}
                placeholder="Contoh: Jl. Sigura-Gura No. 4, Lowokwaru, Malang"
                className="w-full px-4 py-2.5 bg-stone-950/40 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all text-slate-100 placeholder:text-slate-600 resize-none font-sans"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Asal Kampus */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
                  Asal Kampus Malang <span className="text-[10px] text-slate-500 font-normal normal-case">(Tulis "Umum" / Kosongkan jika non-mahasiswa)</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <School className="w-4 h-4" />
                  </span>
                  <select
                    value={onboardingUniversity}
                    onChange={(e) => setOnboardingUniversity(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-950/80 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all text-slate-100 appearance-none font-sans"
                  >
                    <option value="" className="bg-stone-950 text-white">Pilih Kampus / Umum / Non-Mahasiswa</option>
                    <option value="Universitas Muhammadiyah Malang (UMM)" className="bg-stone-950 text-white">UMM (Muhammadiyah)</option>
                    <option value="Universitas Brawijaya (UB)" className="bg-stone-950 text-white">UB (Brawijaya)</option>
                    <option value="Universitas Negeri Malang (UM)" className="bg-stone-950 text-white">UM (Negeri Malang)</option>
                    <option value="Politeknik Negeri Malang (Polinema)" className="bg-stone-950 text-white">Polinema</option>
                    <option value="Universitas Islam Malang (Unisma)" className="bg-stone-950 text-white">Unisma</option>
                    <option value="Umum / Non-Mahasiswa" className="bg-stone-950 text-white">Umum / Non-Mahasiswa (Bukan Mahasiswa)</option>
                  </select>
                </div>
              </div>

              {/* NIM */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider font-mono">NIM / NO. KTP / NO. SIM</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <CreditCard className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={onboardingStudentId}
                    onChange={(e) => setOnboardingStudentId(e.target.value)}
                    placeholder="Masukkan Nomor KTM / KTP / SIM Anda"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-950/40 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all text-slate-100 placeholder:text-slate-600 font-sans"
                  />
                </div>
              </div>
            </div>

            {/* Pilihan Kartu Identitas */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider font-mono">Pilih Salah Satu Kartu Identitas</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { type: "KTP", label: "KTP", icon: "💳" },
                  { type: "KTM", label: "KTM", icon: "🎓" },
                  { type: "SIM", label: "SIM", icon: "🪪" }
                ].map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setOnboardingIdentityType(item.type as any)}
                    className={`border-2 rounded-2xl p-3 flex flex-col items-center justify-center cursor-pointer transition-all ${
                      onboardingIdentityType === item.type
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                        : "border-white/10 bg-stone-950/20 hover:border-white/20 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <span className="text-xl mb-1">{item.icon}</span>
                    <span className="text-xs font-bold font-sans">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Area */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
                Unggah Foto Kartu {onboardingIdentityType}
              </label>
              
              {isOnboardingVerifying ? (
                <div className="border-2 border-emerald-500/50 bg-emerald-500/10 rounded-2xl p-6 text-center flex flex-col items-center justify-center space-y-3 relative overflow-hidden h-[135px]">
                  {/* Laser Scanning Bar */}
                  <div className="absolute left-0 right-0 h-0.5 bg-emerald-400 opacity-80 animate-bounce top-0"></div>
                  <div className="w-8 h-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
                  <div>
                    <p className="text-xs font-bold text-emerald-400 animate-pulse font-mono">MEMPROSES ANALISIS AI...</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Memvalidasi dokumen identitas KTP/KTM/SIM...</p>
                  </div>
                </div>
              ) : !onboardingFileUrl ? (
                <div
                  onDragEnter={handleOnboardingDrag}
                  onDragOver={handleOnboardingDrag}
                  onDragLeave={handleOnboardingDrag}
                  onDrop={handleOnboardingDrop}
                  onClick={() => onboardingFileRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                    onboardingDragActive
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-white/10 bg-stone-950/20 hover:bg-stone-950/40 hover:border-white/20"
                  }`}
                >
                  <input
                    ref={onboardingFileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleOnboardingFileInput}
                    className="hidden"
                  />
                  <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-200">Pilih berkas foto atau seret ke sini</p>
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">Format JPG, PNG (Maks. 2MB)</p>
                </div>
              ) : (
                <div className="relative bg-stone-950/40 rounded-2xl border border-white/10 p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-11 rounded-lg overflow-hidden bg-stone-900 border border-white/10">
                      <img src={onboardingFileUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-200">Foto_Identitas_Eleva.jpg</p>
                      <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium mt-0.5 font-sans">
                        <CheckCircle className="w-3.5 h-3.5" /> Berhasil Diunggah
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOnboardingFileUrl(null)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-4 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-2xl transition-all shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <span>Konfirmasi & Masuk Aplikasi</span>
              <ArrowRight className="w-4 h-4 font-black" />
            </button>
          </form>

          {/* Quick logout option if they want to cancel onboarding */}
          <div className="pt-2 border-t border-white/5 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLoggedIn(false);
                setIsOnboardingCompleted(false);
              }}
              className="text-[11px] font-mono text-slate-500 hover:text-rose-400 transition-colors"
            >
              ← Kembali / Keluar dari Akun Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to Admin/Owner Dashboard if logged-in role is admin
  if (isLoggedIn && userRole === "admin") {
    return (
      <>
        <DashboardOwner
          gearInventory={gearInventory}
          setGearInventory={setGearInventory}
          simulatedTransactions={simulatedTransactions}
          setSimulatedTransactions={setSimulatedTransactions}
          handleLogout={handleLogout}
          showAlert={showAlert}
          showConfirm={showConfirm}
          INITIAL_GEAR_INVENTORY={INITIAL_GEAR_INVENTORY}
          qrisString={qrisString}
          setQrisString={setQrisString}
          qrisImageUrl={qrisImageUrl}
          setQrisImageUrl={setQrisImageUrl}
        />
        {/* Custom Confirm Dialog Modal */}
        {confirmDialog.isOpen && (
          <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-stone-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4 animate-in fade-in zoom-in duration-200">
              <div className="w-12 h-12 bg-emerald-500/15 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                <span className="text-xl">🏔️</span>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-white">{confirmDialog.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{confirmDialog.message}</p>
              </div>
              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                  className="flex-1 py-2 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-slate-300 transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDialog.onConfirm}
                  className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold text-white transition-all shadow-md shadow-emerald-950/30"
                >
                  Ya, Lanjutkan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Custom Alert Dialog Modal */}
        {alertDialog.isOpen && (
          <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-stone-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4 animate-in fade-in zoom-in duration-200">
              <div className="w-12 h-12 bg-emerald-500/15 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                <span className="text-xl">✓</span>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-white">{alertDialog.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{alertDialog.message}</p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setAlertDialog(prev => ({ ...prev, isOpen: false }))}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold text-white transition-all shadow-md shadow-emerald-950/30"
                >
                  Selesai
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#090f19] via-[#0d211a] to-[#041a10] text-slate-100 flex flex-col font-sans select-none overflow-x-hidden relative">
      <style>{marqueeStyle}</style>

      {/* 1. TICKER BAR - Live status of East Java mountain routes */}
      <div className="w-full bg-emerald-950/80 border-b border-emerald-500/20 px-4 py-2 text-xs flex items-center gap-3 overflow-hidden font-mono z-50">
        <span className="bg-emerald-500 text-stone-950 font-black px-2 py-0.5 rounded text-[9px] uppercase tracking-widest shrink-0 animate-pulse">
          LIVE STATUS JATIM
        </span>
        <div className="flex-1 overflow-hidden relative h-5">
          <div className="animate-marquee-custom flex gap-12 text-emerald-300">
            <span>🌋 Semeru: Waspada Level III (Siaga) - Gunakan peralatan ekstra hangat & Paket Semeru Pro!</span>
            <span>🟢 Panderman: Buka - Jalur aman, cocok untuk pemula & Paket Panderman Rp 25.000/hari!</span>
            <span>🟢 Budug Asu: Buka - Camp ceria asik!</span>
            <span>🟢 Gunung Butak: Buka - Sabana indah edelweis, angin malam hari kencang & dingin!</span>
            <span>🟢 Penanggungan: Buka - Jalur Tamiajeng kondusif!</span>
            <span>🌋 Semeru: Waspada Level III (Siaga) - Gunakan peralatan ekstra hangat & Paket Semeru Pro!</span>
            <span>🟢 Panderman: Buka - Jalur aman, cocok untuk pemula & Paket Panderman Rp 25.000/hari!</span>
            <span>🟢 Budug Asu: Buka - Camp ceria asik!</span>
            <span>🟢 Gunung Butak: Buka - Sabana indah edelweis, angin malam hari kencang & dingin!</span>
            <span>🟢 Penanggungan: Buka - Jalur Tamiajeng kondusif!</span>
          </div>
        </div>
      </div>

      {/* Decorative Blur Backdrops */}
      <div className="absolute top-12 right-0 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>

      {/* Outer Main Layout Shell */}
      <div className="w-full max-w-7xl mx-auto p-3 sm:p-6 lg:p-8 flex-1 flex flex-col md:h-[calc(100vh-40px)] md:overflow-hidden">
        {/* Main Content Card with Frosted Glass Backdrop */}
        <div className="flex-1 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
          
          {/* Sidebar / Left Column Navigation */}
          <aside className="w-full md:w-80 bg-white/[0.02] border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between shrink-0">
            <div className="p-6">
              {/* App Identity */}
              <div className="flex items-center gap-3.5 mb-8">
                <div className="w-11 h-11 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400/30">
                  <span className="text-xl">🏔️</span>
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-white font-display flex items-center gap-1.5">
                    Eleva
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono font-medium px-2 py-0.5 rounded-md border border-emerald-500/30">
                      Ngalam
                    </span>
                  </h1>
                  <p className="text-[10px] text-emerald-300 font-mono tracking-wider">CAMPABOT ASSISTED</p>
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-2">
                <button
                  id="tab-chat"
                  onClick={() => { setActiveTab("chat"); }}
                  className={`w-full flex items-center gap-3.5 p-3.5 rounded-xl text-left text-sm font-medium transition-all duration-200 ${
                    activeTab === "chat"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-inner"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-100 border border-transparent"
                  }`}
                >
                  <MessageSquare className="w-5 h-5" />
                  <div className="flex-1">
                    <p className="font-semibold text-xs uppercase tracking-wider font-mono">CampaBot Chat</p>
                    <p className="text-[10px] opacity-75 truncate">Panduan &amp; Sapaan Arema</p>
                  </div>
                </button>

                <button
                  id="tab-mountains"
                  onClick={() => { setActiveTab("mountains"); }}
                  className={`w-full flex items-center gap-3.5 p-3.5 rounded-xl text-left text-sm font-medium transition-all duration-200 ${
                    activeTab === "mountains"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-inner"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-100 border border-transparent"
                  }`}
                >
                  <Map className="w-5 h-5" />
                  <div className="flex-1">
                    <p className="font-semibold text-xs uppercase tracking-wider font-mono">Katalog Gunung</p>
                    <p className="text-[10px] opacity-75 truncate">Eksplor Jalur Jatim</p>
                  </div>
                </button>

                <button
                  id="tab-packages"
                  onClick={() => { setActiveTab("packages"); }}
                  className={`w-full flex items-center gap-3.5 p-3.5 rounded-xl text-left text-sm font-medium transition-all duration-200 ${
                    activeTab === "packages"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-inner"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-100 border border-transparent"
                  }`}
                >
                  <Layers className="w-5 h-5" />
                  <div className="flex-1">
                    <p className="font-semibold text-xs uppercase tracking-wider font-mono">Alat Pendakian</p>
                    <p className="text-[10px] opacity-75 truncate">Stok Real-time &amp; Variasi Resmi</p>
                  </div>
                </button>

                <button
                  id="tab-profile"
                  onClick={() => { setActiveTab("profile"); }}
                  className={`w-full flex items-center gap-3.5 p-3.5 rounded-xl text-left text-sm font-medium transition-all duration-200 ${
                    activeTab === "profile"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-inner"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-100 border border-transparent"
                  }`}
                >
                  <UserCheck className="w-5 h-5" />
                  <div className="flex-1">
                    <p className="font-semibold text-xs uppercase tracking-wider font-mono">Verifikasi KTM</p>
                    <p className="text-[10px] opacity-75 truncate">
                      {profile.isVerified ? "✓ Jaminan KTM Aktif" : "Belum Verifikasi KTM"}
                    </p>
                  </div>
                </button>
              </nav>
            </div>

            {/* Sidebar Footer / Guaranteed Rent Badge */}
            <div className="p-6 mt-auto space-y-3">
              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-center">
                <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-widest font-semibold block mb-1">
                  JAMINAN RENTCAMP
                </span>
                <p className="text-xs text-slate-300 leading-normal mb-3">
                  Cukup kumpulkan <strong>KTM Malang</strong> aktif di aplikasi. Tanpa uang deposit tunai!
                </p>
                <div className="flex justify-center items-center gap-1.5 py-1.5 px-3 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-xl text-[10px] font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  TANPA CASH DEPOSIT
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 rounded-xl text-xs font-semibold transition-all"
              >
                <LogOut className="w-4 h-4" />
                Keluar Aplikasi
              </button>
            </div>
          </aside>

          {/* Main Display / Right Column */}
          <main className="flex-1 flex flex-col md:overflow-hidden relative bg-stone-900/40">
            
            {/* Header Area */}
            <header className="h-20 border-b border-white/10 flex items-center justify-between px-6 sm:px-8 bg-white/5 backdrop-blur-md">
              <div>
                {activeTab === "chat" && (
                  <>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      Mengobrol dengan CampaBot 
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                    </h2>
                    <p className="text-[11px] text-slate-400">Asisten Virtual Eleva khas Malang Raya. Ramah, Kasual, &amp; Safety First!</p>
                  </>
                )}
                {activeTab === "mountains" && (
                  <>
                    <h2 className="text-base font-bold text-white">Eksplorasi Jalur Gunung Jawa Timur</h2>
                    <p className="text-[11px] text-slate-400">Pilih gunung idamanmu, klik "Sewa Alat" untuk otomatis menyiapkan perlengkapan.</p>
                  </>
                )}
                {activeTab === "packages" && (
                  <>
                    <h2 className="text-base font-bold text-white">Stok &amp; Daftar Alat Pendakian Resmi</h2>
                    <p className="text-[11px] text-slate-400">Daftar lengkap 22 perlengkapan pendakian profesional dengan status stok real-time.</p>
                  </>
                )}
                {activeTab === "profile" && (
                  <>
                    <h2 className="text-base font-bold text-white">Profil &amp; Verifikasi KTM Malang</h2>
                    <p className="text-[11px] text-slate-400">Unggah foto Kartu Tanda Mahasiswa aktif sebagai jaminan sewa gratis tanpa deposit tunai.</p>
                  </>
                )}
              </div>

              {/* Quick Actions in Header */}
              <div className="flex items-center gap-3">
                {activeTab === "chat" && (
                  <button
                    onClick={() => {
                      showConfirm("Hapus Riwayat Chat", "Apakah Anda yakin ingin menghapus seluruh riwayat percakapan dengan CampaBot?", () => {
                        setMessages([
                          {
                            id: "welcome",
                            role: "assistant",
                            content: "Halo! Kenalin, aku **CampaBot**, asisten virtual pintar sekaligus teman pendakianmu dari **Eleva**.\n\nMau mendaki ke mana kita hari ini? Atau sedang mencari persewaan alat gunung **Eleva RentCamp**? Silakan tanya apa saja, aku siap bantu menyiapkan perlengkapan pendakianmu agar aman dan nyaman! Keselamatan adalah yang utama! 🔥🌲",
                            timestamp: new Date()
                          }
                        ]);
                        showAlert("Chat Dihapus", "Riwayat percakapan dengan CampaBot telah diatur ulang.");
                      });
                    }}
                    className="flex items-center gap-1.5 py-1.5 px-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 rounded-xl text-xs font-semibold transition-all cursor-pointer active:scale-95"
                  >
                    <Trash2 className="w-4 h-4" />
                    Reset Chat
                  </button>
                )}
                {profile.isVerified ? (
                  <div className="hidden sm:flex items-center gap-2 py-1.5 px-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 rounded-full text-xs font-semibold">
                    <ShieldCheck className="w-4 h-4" />
                    KTM Terverifikasi
                  </div>
                ) : (
                  <button 
                    onClick={() => setActiveTab("profile")}
                    className="hidden sm:flex items-center gap-1.5 py-1.5 px-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-full text-xs font-semibold transition-all"
                  >
                    <Info className="w-4 h-4" />
                    Verifikasi KTM
                  </button>
                )}
                <button 
                  onClick={() => setActiveTab("packages")}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-lg shadow-emerald-950/40 transition-all flex items-center gap-1.5"
                >
                  <Layers className="w-4 h-4" />
                  Stok Alat
                </button>
              </div>
            </header>

            {/* Workspace Content Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              
              {/* TAB 1: CAMPABOT CHAT AREA */}
              {activeTab === "chat" && (
                <div className="flex flex-col h-[520px] md:h-full justify-between">
                  
                  {/* Messages container */}
                  <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {messages.map((m) => (
                      <div
                        key={m.id}
                        className={`flex gap-3 items-start ${m.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {m.role !== "user" && (
                          <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center font-black text-white text-xs shadow-md shrink-0">
                            CB
                          </div>
                        )}
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-lg border text-sm leading-relaxed ${
                            m.role === "user"
                              ? "bg-emerald-600/30 border-emerald-500/40 text-slate-100 rounded-tr-none"
                              : "bg-white/10 border-white/10 text-slate-200 rounded-tl-none"
                          }`}
                        >
                          {/* Parse bold format beautifully */}
                          <div className="whitespace-pre-line text-xs sm:text-sm text-slate-200">
                            {m.content.split("**").map((text, idx) => 
                              idx % 2 === 1 ? <strong key={idx} className="text-emerald-300 font-bold">{text}</strong> : text
                            )}
                          </div>
                          
                          {/* Render dynamic links inside message if relevant keywords are matched */}
                          {m.role === "assistant" && (m.content.toLowerCase().includes("katalog paket") || m.content.toLowerCase().includes("paket panderman") || m.content.toLowerCase().includes("paket semeru pro")) && (
                            <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap gap-2">
                              <button
                                onClick={() => setActiveTab("packages")}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 py-1.5 px-3 rounded-lg hover:bg-emerald-500/30 transition-all"
                              >
                                Buka Katalog Paket &amp; Kalkulator
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          )}

                          {m.role === "assistant" && (m.content.toLowerCase().includes("ktm") || m.content.toLowerCase().includes("verifikasi ktm")) && !profile.isVerified && (
                            <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap gap-2">
                              <button
                                onClick={() => setActiveTab("profile")}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-500/20 border border-amber-500/30 py-1.5 px-3 rounded-lg hover:bg-amber-500/30 transition-all"
                              >
                                Verifikasi KTM Sekarang
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          )}

                          <p className="text-[9px] text-slate-500 mt-2 text-right">
                            {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        {m.role === "user" && (
                          <div className="w-9 h-9 rounded-full bg-slate-700 border border-white/10 flex items-center justify-center font-bold text-slate-300 text-xs shrink-0">
                            {profile.name ? profile.name.substring(0, 2).toUpperCase() : "ME"}
                          </div>
                        )}
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex gap-3 items-start">
                        <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center font-black text-white text-xs shadow-md">
                          CB
                        </div>
                        <div className="bg-white/10 border border-white/10 rounded-2xl rounded-tl-none px-4 py-3 shadow-lg">
                          <div className="flex gap-1.5 items-center py-1">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Suggestion Chips */}
                  <div className="border-t border-white/10 pt-3">
                    <div className="flex gap-1.5 items-center mb-2.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Tanya CampaBot (Klik untuk kirim):</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4 max-h-24 overflow-y-auto pr-1">
                      {SUGGESTIONS.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(s.text)}
                          className="text-[11px] font-medium text-slate-300 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 hover:bg-emerald-500/10 hover:text-emerald-300 hover:border-emerald-500/20 transition-all text-left truncate max-w-xs"
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>

                    {/* Chat Input Bar */}
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={clearChat}
                        className="px-3 py-2.5 bg-white/5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-white/10 rounded-xl text-xs font-mono transition-all"
                        title="Hapus Obrolan"
                      >
                        Reset Chat
                      </button>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSendMessage(inputMessage);
                        }}
                        className="flex-1 relative bg-white/5 border border-white/10 backdrop-blur-xl rounded-xl p-1.5 flex items-center gap-1.5"
                      >
                        <input
                          type="text"
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          placeholder="Tanya CampaBot (e.g. jaminan, Paket Panderman, dll)..."
                          className="bg-transparent border-none text-slate-100 flex-1 px-3.5 py-1.5 text-sm focus:outline-none focus:ring-0"
                        />
                        <button
                          type="submit"
                          disabled={!inputMessage.trim()}
                          className="w-9 h-9 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:hover:bg-emerald-500 rounded-lg flex items-center justify-center transition-all shadow-md shadow-emerald-950/40 shrink-0"
                        >
                          <Send className="w-4 h-4 text-white" />
                        </button>
                      </form>
                    </div>
                    <p className="text-center text-[9px] text-slate-500 mt-3 tracking-widest uppercase font-mono">
                      CampaBot • Khusus Area Malang &amp; Jawa Timur • Safety First
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: MOUNTAIN CATALOG */}
              {activeTab === "mountains" && (
                <div>
                  <div className="bg-emerald-950/25 border border-emerald-500/20 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="max-w-2xl">
                      <h3 className="font-display text-base font-bold text-emerald-300 flex items-center gap-2">
                        <Info className="w-4 h-4 shrink-0" />
                        Pengetahuan Dasar Trekking Malang &amp; Jawa Timur
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed mt-1">
                        Jawa Timur kaya akan gunung yang megah. 
                        <strong> Trek Ringan (Panderman, Budug Asu)</strong> hanya butuh alat standar.
                        <strong> Trek Sedang (Butak, Penanggungan)</strong> butuh perlindungan angin seperti tenda double layer.
                        Sedangkan <strong> Trek Tinggi / Ekstrem (Semeru, Arjuno, Welirang)</strong> menuntut keselamatan maksimal: wajib menggunakan pakaian thermal/windproof lengkap, tenda stormproof, dan sepatu bersol kuat untuk menghindari kecelakaan fatal.
                      </p>
                    </div>
                    <button 
                      onClick={() => handleRentForMountain("semeru")}
                      className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold py-2.5 px-4 rounded-xl shrink-0 transition-all font-mono"
                    >
                      SIAPKAN ALAT SEMERU
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {MOUNTAINS.map((mountain) => (
                      <MountainCard
                        key={mountain.id}
                        mountain={mountain}
                        onConsult={handleConsultMountain}
                        onRent={handleRentForMountain}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: PACKAGE CATALOG & SIMULATOR */}
              {activeTab === "packages" && (
                <div className="space-y-8">
                  {/* Inventory Summary Dashboard & Admin controls */}
                  <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-1">
                      <span className="text-[10px] text-emerald-400 font-mono font-bold tracking-widest block uppercase">BASECAMP ELEVA MALANG</span>
                      <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
                        <Layers className="w-5 h-5 text-emerald-400" />
                        Manajemen Alat &amp; Stok Real-time
                      </h3>
                      <p className="text-xs text-slate-400">
                        Total {gearInventory.length} perlengkapan pendakian resmi. Stok bergerak secara dinamis sesuai transaksi reservasi.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => {
                          showConfirm("Atur Ulang Stok", "Apakah Sam/Mbak yakin ingin mengatur ulang seluruh kondisi stok ke kondisi awal (Stok Penuh, Sedang Disewa = 0)?", () => {
                            setGearInventory(INITIAL_GEAR_INVENTORY);
                            setSelectedGear({});
                            setCheckoutSuccess(false);
                            showAlert("Stok Diatur Ulang", "Seluruh inventaris alat pendakian telah dikembalikan ke kondisi awal.");
                          });
                        }}
                        className="flex items-center gap-1.5 py-2 px-4 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-300 rounded-xl text-xs font-semibold font-mono transition-all"
                      >
                        <RotateCcw className="w-4 h-4" />
                        RESET SEMUA STOK (FULL)
                      </button>
                    </div>
                  </div>

                  {/* Quick Preset Packages */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Paket Rekomendasi Cepat (Quick Load)</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {PACKAGES.map((pkg) => (
                        <button
                          key={pkg.id}
                          onClick={() => applyPackageToSimulator(pkg)}
                          className="bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/[0.02] rounded-xl p-4 text-left transition-all duration-200 group relative"
                        >
                          <span className="absolute top-3 right-3 text-[9px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                            {pkg.badge}
                          </span>
                          <h5 className="font-bold text-xs text-white group-hover:text-emerald-300 transition-colors">{pkg.name}</h5>
                          <p className="text-[10px] text-slate-400 mt-1 leading-normal truncate max-w-[80%]">{pkg.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* LEFT COLUMN: 22-ITEM CATALOG (7 cols) */}
                    <div className="lg:col-span-7 space-y-6">
                      
                      {/* Search & Filters */}
                      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Cari alat pendakian berdasarkan nama, merek, atau model..."
                            value={searchGear}
                            onChange={(e) => setSearchGear(e.target.value)}
                            className="w-full bg-stone-950/60 text-slate-100 placeholder-slate-500 pl-10 pr-4 py-2 rounded-xl text-xs border border-white/10 focus:border-emerald-500/50 focus:outline-none transition-all font-mono"
                          />
                        </div>

                        {/* Category Filter Pills */}
                        <div className="flex flex-wrap gap-1.5">
                          {["Semua", "Tenda & Flysheet", "Tas & Tidur", "Masak & Gas", "Pakaian & Proteksi", "Aksesoris & Lainnya"].map((cat) => (
                            <button
                              key={cat}
                              onClick={() => setSelectedCategory(cat)}
                              className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all font-mono ${
                                selectedCategory === cat
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                  : "bg-white/5 text-slate-400 border border-transparent hover:bg-white/10 hover:text-slate-200"
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Gear Cards Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        {gearInventory.filter(item => {
                          const matchesSearch = item.nama.toLowerCase().includes(searchGear.toLowerCase()) || 
                                                item.merek.toLowerCase().includes(searchGear.toLowerCase()) ||
                                                item.model.toLowerCase().includes(searchGear.toLowerCase());
                          if (!matchesSearch) return false;
                          
                          if (selectedCategory === "Semua") return true;
                          if (selectedCategory === "Tenda & Flysheet") {
                            return ["Tenda", "Flysheet", "Pasak Cadangan"].includes(item.kategori);
                          }
                          if (selectedCategory === "Tas & Tidur") {
                            return ["Carrier", "Daypack", "Sleeping Bag", "Matras", "Dry Bag"].includes(item.kategori);
                          }
                          if (selectedCategory === "Masak & Gas") {
                            return ["Kompor", "Nesting", "Gas Kaleng"].includes(item.kategori);
                          }
                          if (selectedCategory === "Pakaian & Proteksi") {
                            return ["Pakaian & Proteksi", "Pakaian", "Sepatu"].includes(item.kategori);
                          }
                          if (selectedCategory === "Aksesoris & Lainnya") {
                            return ["Headlamp", "Senter", "Trekking Pole", "Kursi Lipat", "Meja Lipat", "Jas Hujan", "Gaiter", "Sarung Tangan", "Tali Paracord", "P3K", "Hammock"].includes(item.kategori);
                          }
                          return true;
                        }).map((item) => {
                          const isSelected = (selectedGear[item.id] || 0) > 0;
                          return (
                            <div
                              key={item.id}
                              className={`bg-white/[0.03] border rounded-2xl p-4 flex flex-col justify-between transition-all ${
                                isSelected 
                                  ? "border-emerald-500/30 bg-emerald-500/[0.01]" 
                                  : "border-white/10 hover:border-white/20"
                              }`}
                            >
                              <div>
                                {item.gambar_url && (
                                  <div className="w-full h-32 rounded-xl overflow-hidden mb-3 bg-stone-900 border border-white/5 relative">
                                    <img 
                                      src={item.gambar_url} 
                                      alt={item.nama}
                                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                      referrerPolicy="no-referrer"
                                      onError={(e) => {
                                        // Fallback icon placeholder if URL is not directly loadable
                                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=400&q=80";
                                      }}
                                    />
                                  </div>
                                )}
                                <div className="flex justify-between items-start gap-2">
                                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-slate-400">
                                    {item.kategori}
                                  </span>
                                  <p className="text-xs font-mono font-bold text-emerald-400">
                                    Rp {item.harga.toLocaleString("id-ID")}<span className="text-[10px] text-slate-500 font-normal">/hr</span>
                                  </p>
                                </div>

                                <h4 className="font-bold text-xs text-white mt-2 leading-tight">{item.nama}</h4>
                                
                                <div className="mt-2 space-y-1 text-[10px] text-slate-400 font-mono leading-relaxed">
                                  <p><span className="text-slate-500">Merek:</span> {item.merek}</p>
                                  <p><span className="text-slate-500">Model:</span> {item.model}</p>
                                </div>

                                {/* Customization Options (Ukuran & Warna) */}
                                <div className="mt-2.5 space-y-2 bg-stone-900/50 p-2.5 rounded-xl border border-white/5">
                                  {/* Size Selector */}
                                  <div>
                                    <div className="flex justify-between items-center mb-1 text-[9px] uppercase font-bold tracking-wider font-mono">
                                      <span className="text-slate-500">Pilih Ukuran:</span>
                                      <span className="text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded border border-emerald-500/10">
                                        {getGearSize(item.id, item.ukuran)}
                                      </span>
                                    </div>
                                    <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto pr-0.5">
                                      {parseOptions(item.ukuran).map((opt) => {
                                        const isSel = getGearSize(item.id, item.ukuran) === opt;
                                        return (
                                          <button
                                            key={opt}
                                            id={`size-btn-${item.id}-${opt}`}
                                            onClick={() => {
                                              setSelectedGearDetails(prev => ({
                                                ...prev,
                                                [item.id]: {
                                                  ...prev[item.id],
                                                  size: opt,
                                                  color: prev[item.id]?.color || parseOptions(item.warna)[0] || item.warna
                                                }
                                              }));
                                            }}
                                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold font-mono border transition-all cursor-pointer ${
                                              isSel 
                                                ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-sm shadow-emerald-500/10 font-black" 
                                                : "bg-stone-950/40 border-white/5 text-slate-500 hover:text-slate-300 hover:border-white/20"
                                            }`}
                                          >
                                            {opt}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  {/* Color Selector */}
                                  <div>
                                    <div className="flex justify-between items-center mb-1 text-[9px] uppercase font-bold tracking-wider font-mono">
                                      <span className="text-slate-500">Pilih Warna:</span>
                                      <span className="text-sky-400 bg-sky-500/10 px-1 py-0.5 rounded border border-sky-500/10">
                                        {getGearColor(item.id, item.warna)}
                                      </span>
                                    </div>
                                    <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto pr-0.5">
                                      {parseOptions(item.warna).map((opt) => {
                                        const isSel = getGearColor(item.id, item.warna) === opt;
                                        return (
                                          <button
                                            key={opt}
                                            id={`color-btn-${item.id}-${opt}`}
                                            onClick={() => {
                                              setSelectedGearDetails(prev => ({
                                                ...prev,
                                                [item.id]: {
                                                  ...prev[item.id],
                                                  size: prev[item.id]?.size || parseOptions(item.ukuran)[0] || item.ukuran,
                                                  color: opt
                                                }
                                              }));
                                            }}
                                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold font-mono border transition-all cursor-pointer ${
                                              isSel 
                                                ? "bg-sky-500/20 border-sky-400 text-sky-300 shadow-sm shadow-sky-500/10 font-black" 
                                                : "bg-stone-950/40 border-white/5 text-slate-500 hover:text-slate-300 hover:border-white/20"
                                            }`}
                                          >
                                            {opt}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-4 pt-3 border-t border-white/5 space-y-3">
                                {/* Stocks badges */}
                                <div className="grid grid-cols-3 gap-1 text-[9px] font-mono text-center">
                                  <div className="bg-stone-900/60 p-1 rounded border border-white/5">
                                    <span className="text-slate-500 block text-[8px] uppercase">Stok</span>
                                    <span className="text-slate-300 font-bold">{item.total_stok}</span>
                                  </div>
                                  <div className="bg-stone-900/60 p-1 rounded border border-white/5">
                                    <span className="text-slate-500 block text-[8px] uppercase">Sewa</span>
                                    <span className={`font-bold ${item.sedang_disewa > 0 ? "text-amber-400" : "text-slate-400"}`}>
                                      {item.sedang_disewa}
                                    </span>
                                  </div>
                                  <div className={`p-1 rounded border ${
                                    item.tersedia === 0 
                                      ? "bg-rose-500/10 border-rose-500/20 text-rose-400" 
                                      : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                  }`}>
                                    <span className="opacity-70 block text-[8px] uppercase">Ready</span>
                                    <span className="font-bold">{item.tersedia === 0 ? "HABIS" : item.tersedia}</span>
                                  </div>
                                </div>

                                {/* Simulator Quick Controls */}
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      // Add to Simulator
                                      setSelectedGear(prev => {
                                        const current = prev[item.id] || 0;
                                        if (current >= item.tersedia) {
                                          showAlert("Stok Terbatas", `Sam/Mbak tidak bisa memilih lebih dari stok yang tersedia (${item.tersedia} unit ready).`);
                                          return prev;
                                        }
                                        return { ...prev, [item.id]: current + 1 };
                                      });
                                    }}
                                    disabled={item.tersedia === 0}
                                    className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 bg-emerald-500/10 hover:bg-emerald-500/20 disabled:bg-stone-900/40 disabled:text-slate-600 disabled:border-transparent text-emerald-300 border border-emerald-500/20 rounded-xl text-[10px] font-mono font-bold transition-all cursor-pointer"
                                  >
                                    <Plus className="w-3 h-3" />
                                    PILIH
                                  </button>

                                  {isSelected && (
                                    <button
                                      onClick={() => {
                                        setSelectedGear(prev => {
                                          const next = { ...prev };
                                          if (next[item.id] <= 1) {
                                            delete next[item.id];
                                          } else {
                                            next[item.id] -= 1;
                                          }
                                          return next;
                                        });
                                      }}
                                      className="py-1.5 px-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 rounded-xl text-[10px] transition-all cursor-pointer"
                                    >
                                      <Minus className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                      {/* Right: Simulation Invoice Summary */}
                      <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-4">
                        <div className="bg-gradient-to-br from-emerald-950/30 to-stone-950/80 border border-emerald-500/20 rounded-2xl p-6 shadow-xl space-y-6">
                          <div className="border-b border-white/10 pb-4">
                            <span className="text-[10px] text-emerald-400 font-mono font-bold tracking-widest block uppercase">SIMULASI TRANSAKSI SEWA MASAL</span>
                            <h4 className="font-display text-lg font-bold text-white mt-1">Kalkulator Reservasi</h4>
                          </div>

                          {/* Customer Form Profiles */}
                          <div className="space-y-3">
                            <div>
                              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Nama Penyewa</label>
                              <input
                                type="text"
                                value={profile.name || "Penyewa Mandiri"}
                                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Masukkan nama lengkap..."
                                className="w-full bg-stone-950 text-xs text-slate-200 border border-white/10 rounded-xl px-3 py-2 focus:border-emerald-500/50 focus:outline-none font-mono"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Durasi Sewa (Hari)</label>
                                <input
                                  type="number"
                                  min={1}
                                  max={30}
                                  value={rentDuration}
                                  onChange={(e) => setRentDuration(Math.max(1, parseInt(e.target.value) || 1))}
                                  className="w-full bg-stone-950 text-xs text-slate-200 border border-white/10 rounded-xl px-3 py-2 focus:border-emerald-500/50 focus:outline-none font-mono"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Tujuan Gunung</label>
                                <select
                                  value={simulatedMountain}
                                  onChange={(e) => setSimulatedMountain(e.target.value)}
                                  className="w-full bg-stone-950 text-xs text-slate-200 border border-white/10 rounded-xl px-3 py-2.5 focus:border-emerald-500/50 focus:outline-none font-mono cursor-pointer"
                                >
                                  {MOUNTAINS.map((m) => (
                                    <option key={m.id} value={m.id}>
                                      {m.name} ({m.difficulty})
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Selected Items Cart Panel */}
                          <div className="space-y-3">
                            <p className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Item dalam Keranjang Simulator ({Object.keys(selectedGear).length})</p>
                            
                            {Object.keys(selectedGear).length === 0 ? (
                              <div className="bg-stone-950/50 border border-dashed border-white/10 rounded-xl p-6 text-center">
                                <ShoppingBag className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                                <p className="text-xs text-slate-400 font-mono">Belum ada alat yang dipilih.</p>
                                <p className="text-[10px] text-slate-500 mt-1">Klik tombol "+ PILIH" pada daftar alat resmi di sebelah kiri.</p>
                              </div>
                            ) : (
                              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                {Object.entries(selectedGear).map(([id, qty]) => {
                                  const item = gearInventory.find(g => g.id === id);
                                  if (!item) return null;
                                  return (
                                    <div key={id} className="bg-stone-950/80 border border-white/5 rounded-xl p-3 flex items-center justify-between text-xs font-mono">
                                      <div className="flex-1 min-w-0 pr-2">
                                        <p className="text-slate-200 font-bold truncate leading-tight">{item.nama}</p>
                                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                                          <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/10 px-1 py-0.5 rounded">
                                            Ukuran: {getGearSize(item.id, item.ukuran)}
                                          </span>
                                          <span className="text-[9px] font-bold text-sky-400 bg-sky-500/10 border border-sky-500/10 px-1 py-0.5 rounded">
                                            Warna: {getGearColor(item.id, item.warna)}
                                          </span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 mt-1.5">Rp {item.harga.toLocaleString("id-ID")}/hr</p>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() => {
                                            setSelectedGear(prev => {
                                              const next = { ...prev };
                                              if (next[id] <= 1) {
                                                delete next[id];
                                              } else {
                                                next[id] -= 1;
                                              }
                                              return next;
                                            });
                                          }}
                                          className="w-5 h-5 flex items-center justify-center bg-white/5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded transition-all cursor-pointer"
                                        >
                                          <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="text-white font-bold px-1.5">{qty}</span>
                                        <button
                                          onClick={() => {
                                            setSelectedGear(prev => {
                                              const current = prev[id] || 0;
                                              if (current >= item.tersedia) {
                                                showAlert("Stok Terbatas", `Stok ready hanya sisa ${item.tersedia} unit.`);
                                                return prev;
                                              }
                                              return { ...prev, [id]: current + 1 };
                                            });
                                          }}
                                          className="w-5 h-5 flex items-center justify-center bg-white/5 hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-400 rounded transition-all cursor-pointer"
                                        >
                                          <Plus className="w-3 h-3" />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          {/* Safety Advisor Checklist */}
                          {Object.keys(selectedGear).length > 0 && (
                            <div className={`border rounded-xl p-4 text-[11px] font-mono space-y-2 ${
                              safetyReport.status === "warning"
                                ? "bg-amber-500/5 border-amber-500/20 text-amber-300"
                                : "bg-emerald-500/5 border-emerald-500/20 text-emerald-300"
                            }`}>
                              <div className="flex gap-2 items-start">
                                {safetyReport.status === "warning" ? (
                                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                                ) : (
                                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                                )}
                                <div className="space-y-1">
                                  <p className="font-bold uppercase tracking-wider text-[10px]">
                                    {safetyReport.status === "warning" ? "Peringatan Safety-Check" : "Peralatan Sesuai Standar Safety"}
                                  </p>
                                  <p className="leading-relaxed opacity-90">{safetyReport.message}</p>
                                </div>
                              </div>

                              {safetyReport.status === "warning" && safetyReport.missingGear.length > 0 && (
                                <div className="mt-2 pt-2 border-t border-white/5">
                                  <span className="text-slate-400 block mb-1 uppercase tracking-wider text-[9px]">Rekomendasi Alat Tambahan (Kurang):</span>
                                  <div className="flex flex-wrap gap-1">
                                    {safetyReport.missingGear.map((m: any) => (
                                      <span key={m.id} className="bg-amber-500/10 border border-amber-500/20 py-0.5 px-1.5 rounded text-[9px] font-bold">
                                        ⛺ {m.name}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Price Details Breakdown */}
                          {Object.keys(selectedGear).length > 0 && (
                            <div className="bg-stone-950/80 border border-white/10 rounded-xl p-4 space-y-2.5 text-[11px] font-mono">
                              <div className="flex justify-between">
                                <span className="text-slate-500">Harga Base per Hari:</span>
                                <span className="text-slate-300">Rp {basePricePerDay.toLocaleString("id-ID")}</span>
                              </div>

                              {discounts.campusDiscount > 0 && (
                                <div className="flex justify-between text-emerald-400">
                                  <span>Diskon KTM Malang (10%):</span>
                                  <span>- Rp {(basePricePerDay * 0.10).toLocaleString("id-ID")}</span>
                                </div>
                              )}

                              {discounts.comboDiscount > 0 && (
                                <div className="flex justify-between text-emerald-400">
                                  <span>Diskon Combo 4+ Item (5%):</span>
                                  <span>- Rp {(basePricePerDay * 0.05).toLocaleString("id-ID")}</span>
                                </div>
                              )}

                              <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-white text-xs">
                                <span>Biaya Bersih per Hari:</span>
                                <span className="text-emerald-400">Rp {finalPricePerDay.toLocaleString("id-ID")}</span>
                              </div>

                              <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-white text-sm">
                                <span>Grand Total ({rentDuration} hari):</span>
                                <span className="text-emerald-300">Rp {totalCost.toLocaleString("id-ID")}</span>
                              </div>
                            </div>
                          )}

                          {/* Transaction Buttons */}
                          <div className="space-y-3">
                            <button
                              onClick={() => {
                                if (Object.keys(selectedGear).length === 0) {
                                  showAlert("Gagal Memproses", "Pilihlah minimal 1 item untuk diproses.");
                                  return;
                                }
                                setPaymentModalOpen(true);
                                setSelectedPaymentMethod(null);
                              }}
                              disabled={Object.keys(selectedGear).length === 0}
                              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-lg transition-all active:scale-[0.98] cursor-pointer"
                            >
                              PROSES RESERVASI SEWA (REAL-TIME UPDATE)
                            </button>

                            {Object.keys(selectedGear).length > 0 && (
                              <button
                                onClick={() => {
                                  setSelectedGear({});
                                  setCheckoutSuccess(false);
                                }}
                                className="w-full py-2 px-4 bg-white/5 hover:bg-white/10 text-slate-300 font-mono text-[10px] uppercase font-bold rounded-xl transition-all cursor-pointer"
                              >
                                KOSONGKAN KERANJANG
                              </button>
                            )}
                          </div>
                        </div>

                          {showReceipt && (
                            <div className="border border-white/10 rounded-2xl p-4 bg-stone-900/40 space-y-4 mt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold font-mono text-emerald-400 flex items-center gap-1.5 uppercase tracking-widest">
                                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                                  STRUK BOOKING AKTIF
                                </span>
                                <div className="flex gap-1.5">
                                  <button
                                    onClick={handleCopyReceiptText}
                                    className="text-[9px] font-mono font-bold bg-white/5 hover:bg-white/10 text-slate-300 px-2.5 py-1 rounded-lg border border-white/10 transition-all flex items-center gap-1 cursor-pointer"
                                  >
                                    <FileDown className="w-3 h-3" />
                                    Salin Teks
                                  </button>
                                  <button
                                    onClick={() => {
                                      setShowReceipt(false);
                                      setCheckoutSuccess(false);
                                    }}
                                    className="text-[9px] font-mono font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 px-2.5 py-1 rounded-lg border border-rose-500/20 transition-all cursor-pointer"
                                  >
                                    Tutup Struk
                                  </button>
                                </div>
                              </div>

                              {/* Physical receipt paper mockup */}
                              <div className="bg-stone-50 text-stone-900 rounded-xl p-5 shadow-2xl relative overflow-hidden font-mono text-xs select-text border-b-8 border-dashed border-stone-400">
                                {/* Decorative punch holes at top/bottom for paper-like look */}
                                <div className="absolute top-0 left-0 right-0 flex justify-between px-4">
                                  {Array.from({ length: 12 }).map((_, i) => (
                                    <div key={i} className="w-2.5 h-2.5 bg-stone-900/10 rounded-full -translate-y-1.5"></div>
                                  ))}
                                </div>

                                {/* Receipt Header */}
                                <div className="text-center pt-3 pb-2">
                                  <h3 className="font-bold text-sm tracking-tight text-stone-900 uppercase">=== ELEVA OUTDOOR ===</h3>
                                  <p className="text-[10px] text-stone-500 leading-normal mt-0.5">
                                    Basecamp Lowokwaru, Malang, Jatim<br />
                                    Telp: 0812-3456-7890 | Instagram: @eleva.rentcamp
                                  </p>
                                </div>

                                <div className="border-t border-dashed border-stone-400 my-2.5"></div>

                                {/* Transaction Metadata */}
                                <div className="space-y-0.5 text-[11px] leading-relaxed">
                                  <div className="flex justify-between">
                                    <span>NO STRUK:</span>
                                    <span className="font-bold">{receiptId}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>TANGGAL :</span>
                                    <span>{bookingTimestamp}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>STATUS  :</span>
                                    <span className="font-bold text-emerald-700">SUKSES (OK)</span>
                                  </div>
                                  {receiptPaymentMethod && (
                                    <div className="flex justify-between">
                                      <span>PEMBAYARAN:</span>
                                      <span className="font-bold text-sky-700 uppercase">
                                        {receiptPaymentMethod === "QRIS" ? "QRIS REAL (LUNAS)" : "COD (BAYAR DI TEMPAT)"}
                                      </span>
                                    </div>
                                  )}
                                  <div className="flex justify-between">
                                    <span>KASIR   :</span>
                                    <span>CampaBot AI</span>
                                  </div>
                                </div>

                                <div className="border-t border-dashed border-stone-400 my-2.5"></div>

                                {/* Customer Identity */}
                                <div className="space-y-1 text-[11px]">
                                  <p className="font-bold uppercase text-[10px] text-stone-500 mb-1">=== DATA DIRI PELANGGAN ===</p>
                                  <div className="flex justify-between">
                                    <span className="shrink-0 w-24">NAMA:</span>
                                    <span className="font-bold text-right truncate max-w-[160px]">{profile.name}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="shrink-0 w-24">IDENTITAS:</span>
                                    <span className="text-right">{profile.identityType} ({profile.studentId})</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="shrink-0 w-24">KAMPUS:</span>
                                    <span className="text-right truncate max-w-[160px]">{profile.university || "-"}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="shrink-0 w-24">ALAMAT:</span>
                                    <span className="text-right truncate max-w-[160px]" title={profile.address}>{profile.address || "-"}</span>
                                  </div>
                                </div>

                                <div className="border-t border-dashed border-stone-400 my-2.5"></div>

                                {/* Booking target and duration */}
                                <div className="space-y-1 text-[11px] leading-normal">
                                  <p className="font-bold uppercase text-[10px] text-stone-500 mb-1">=== DATA PENDAKIAN ===</p>
                                  <div className="flex justify-between">
                                    <span>GUNUNG TUJUAN:</span>
                                    <span className="font-bold text-right">
                                      {MOUNTAINS.find(m => m.id === simulatedMountain)?.name || "-"}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>DURASI SEWA  :</span>
                                    <span className="font-bold">{rentDuration} Hari</span>
                                  </div>
                                </div>

                                <div className="border-t border-dashed border-stone-400 my-2.5"></div>

                                {/* Rented items details */}
                                <div className="space-y-2">
                                  <p className="font-bold uppercase text-[10px] text-stone-500">=== RINCIAN ALAT SEWA ===</p>
                                  {Object.entries(selectedGear).map(([id, qty]) => {
                                    const item = GEAR_ITEMS.find(g => g.id === id);
                                    if (!item) return null;
                                    const totalItemPrice = item.pricePerDay * (qty as number);
                                    const gearInvItem = gearInventory.find(g => g.id === id);
                                    return (
                                      <div key={id} className="text-[11px] leading-tight space-y-0.5 border-b border-stone-200 pb-1.5 last:border-0 last:pb-0">
                                        <div className="flex justify-between">
                                          <span className="font-bold">{item.name}</span>
                                          <span>Rp {totalItemPrice.toLocaleString("id-ID")}</span>
                                        </div>
                                        {gearInvItem && (
                                          <div className="text-stone-600 text-[10px] italic">
                                            Ukuran: {getGearSize(id, gearInvItem.ukuran)} | Warna: {getGearColor(id, gearInvItem.warna)}
                                          </div>
                                        )}
                                        <div className="text-stone-500 text-[10px]">
                                          {qty} unit x Rp {item.pricePerDay.toLocaleString("id-ID")} / hari
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>

                                <div className="border-t border-dashed border-stone-400 my-2.5"></div>

                                {/* Price breakdown */}
                                <div className="space-y-1 text-[11px]">
                                  <div className="flex justify-between">
                                    <span>SUBTOTAL TARIF ECERAN:</span>
                                    <span>Rp {basePricePerDay.toLocaleString("id-ID")}</span>
                                  </div>

                                  {discounts.comboDiscount > 0 && (
                                    <div className="flex justify-between text-emerald-800 font-medium">
                                      <span>DISKON COMBO 4+ GEAR (5%):</span>
                                      <span>-Rp {(basePricePerDay * 0.05).toLocaleString("id-ID")}</span>
                                    </div>
                                  )}

                                  {profile.isVerified && (
                                    <div className="flex justify-between text-emerald-800 font-medium">
                                      <span>DISKON JAMINAN KTM (10%):</span>
                                      <span>-Rp {(basePricePerDay * 0.10).toLocaleString("id-ID")}</span>
                                    </div>
                                  )}

                                  <div className="border-t border-stone-300 pt-1 flex justify-between font-bold">
                                    <span>TARIF PER HARI:</span>
                                    <span>Rp {finalPricePerDay.toLocaleString("id-ID")}</span>
                                  </div>

                                  <div className="flex justify-between font-bold text-xs pt-1.5 border-t border-double border-stone-400">
                                    <span>GRAND TOTAL ({rentDuration} HARI):</span>
                                    <span className="text-emerald-800 font-black text-sm">Rp {totalCost.toLocaleString("id-ID")}</span>
                                  </div>
                                </div>

                                <div className="border-t border-dashed border-stone-400 my-3"></div>

                                {/* Guarantee and rules summary */}
                                <div className="text-[10px] text-stone-700 bg-stone-200/50 p-2.5 rounded border border-stone-300/40 leading-relaxed text-center">
                                  {profile.isVerified ? (
                                    <p className="font-bold text-emerald-800">
                                      ✓ JAMINAN KTM TERVERIFIKASI<br />
                                      Bebas Deposit Tunai untuk mahasiswa Malang!
                                    </p>
                                  ) : (
                                    <p className="font-bold text-amber-800">
                                      ⚠️ JAMINAN BELUM TERVERIFIKASI<br />
                                      Harap siapkan KTP asli &amp; jaminan tunai di basecamp.
                                    </p>
                                  )}
                                  <p className="mt-1">Tunjukkan struk digital/screenshot ini saat pengambilan alat sewa di Malang.</p>
                                </div>

                                {/* QR Code Simulation */}
                                <div className="mt-4 flex flex-col items-center justify-center space-y-1 text-center">
                                  <div className="border border-stone-400 p-1 bg-white rounded">
                                    {/* Mock 2D Grid QR */}
                                    <div className="grid grid-cols-5 gap-0.5 w-10 h-10">
                                      {Array.from({ length: 25 }).map((_, idx) => {
                                        const isBlack = (idx * 7 + 3) % 5 === 0 || (idx % 4 === 0) || (idx < 6) || (idx > 18) || (idx === 12);
                                        return (
                                          <div key={idx} className={`w-1.5 h-1.5 ${isBlack ? "bg-stone-900" : "bg-transparent"}`}></div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                  <span className="text-[8px] text-stone-400 font-mono tracking-widest uppercase">E-STRUK VERIFIED</span>
                                </div>

                                {/* Footer message */}
                                <div className="text-center text-[9px] text-stone-500 mt-4 leading-normal">
                                  Matur nuwun, Sam/Mbak!<br />
                                  Selamat berpetualang &amp; bawa kembali sampahmu.<br />
                                  🌿 Leave No Trace, Safety First! 🏔️
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

              {/* TAB 4: PROFILE & KTM VERIFICATION */}
              {activeTab === "profile" && (
                <ProfileSection 
                  profile={profile} 
                  onChangeProfile={(newProfile) => setProfile(newProfile)} 
                />
              )}

            </div>
          </main>

        </div>
      </div>

      {/* Payment Selection & QRIS Modal */}
      {paymentModalOpen && (
        <div className="fixed inset-0 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-stone-900 border border-white/10 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 font-mono text-slate-100">
            {/* Header */}
            <div className="bg-stone-950 px-6 py-4 border-b border-white/10 flex justify-between items-center font-mono">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  💳 METODE PEMBAYARAN
                </h3>
                <p className="text-[10px] text-slate-500">Pilih metode pembayaran untuk reservasi sewa</p>
              </div>
              <button
                onClick={() => {
                  setPaymentModalOpen(false);
                  setSelectedPaymentMethod(null);
                }}
                className="text-slate-400 hover:text-white font-black text-sm p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Payment Option Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedPaymentMethod("COD")}
                  className={`py-4 px-3 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                    selectedPaymentMethod === "COD"
                      ? "bg-emerald-500/10 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-950/50"
                      : "bg-stone-950/50 border-white/5 text-slate-400 hover:bg-stone-950 hover:text-slate-200"
                  }`}
                >
                  <span className="text-2xl">💵</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-center">Bayar di Tempat (COD)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPaymentMethod("QRIS")}
                  className={`py-4 px-3 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                    selectedPaymentMethod === "QRIS"
                      ? "bg-emerald-500/10 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-950/50"
                      : "bg-stone-950/50 border-white/5 text-slate-400 hover:bg-stone-950 hover:text-slate-200"
                  }`}
                >
                  <span className="text-2xl">📱</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-center">Bayar Sekarang (QRIS Real)</span>
                </button>
              </div>

              {/* Dynamic Content based on Selection */}
              {selectedPaymentMethod === "COD" && (
                <div className="bg-stone-950/60 border border-white/5 rounded-2xl p-4 text-center space-y-3 animate-in fade-in duration-200">
                  <div className="w-10 h-10 bg-emerald-500/15 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                    <span>💵</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white uppercase tracking-wider">INFORMASI COD</p>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      Pembayaran dapat dilakukan langsung secara tunai/cash atau gesek kartu debit saat Sam/Mbak mengambil peralatan gunung di Basecamp Eleva.
                    </p>
                  </div>
                  <div className="bg-stone-900 border border-white/5 rounded-xl p-2.5 text-xs">
                    <p className="text-[10px] text-slate-500">TOTAL YANG DI-BOOKING:</p>
                    <p className="text-emerald-400 font-bold text-sm">Rp {totalCost.toLocaleString("id-ID")}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleProcessBooking("COD")}
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all active:scale-[0.98] cursor-pointer font-mono uppercase tracking-wider"
                  >
                    Konfirmasi Booking COD
                  </button>
                </div>
              )}

              {selectedPaymentMethod === "QRIS" && (
                <div className="bg-stone-950/60 border border-white/5 rounded-2xl p-4 text-center space-y-4 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">Metode Pembayaran QRIS Real</p>
                    <p className="text-white font-bold text-sm">
                      Total Pembayaran: <span className="text-emerald-400 font-mono">Rp {totalCost.toLocaleString("id-ID")}</span>
                    </p>
                  </div>

                  {/* QRIS Tab Selectors */}
                  <div className="flex bg-stone-900 p-1 rounded-xl border border-white/5 max-w-[260px] mx-auto gap-1">
                    <button
                      type="button"
                      onClick={() => setQrisTab("auto")}
                      className={`flex-1 py-1.5 text-[9px] font-bold uppercase rounded-lg tracking-wider transition-all cursor-pointer ${
                        qrisTab === "auto"
                          ? "bg-emerald-600 text-white font-black"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      Otomatis
                    </button>
                    <button
                      type="button"
                      onClick={() => setQrisTab("image")}
                      className={`flex-1 py-1.5 text-[9px] font-bold uppercase rounded-lg tracking-wider transition-all cursor-pointer ${
                        qrisTab === "image"
                          ? "bg-emerald-600 text-white font-black"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      Gambar Unggahan
                    </button>
                  </div>

                  {/* QRIS Render Box */}
                  <div className="bg-white p-3 rounded-2xl border border-stone-800 max-w-[240px] mx-auto shadow-xl relative flex flex-col items-center justify-center min-h-[220px]">
                    {qrisTab === "auto" ? (
                      <div className="flex flex-col items-center justify-center">
                        <canvas
                          ref={canvasRef}
                          className="w-full aspect-square max-w-[180px] object-contain"
                        />
                        <span className="text-[8px] text-stone-500 font-bold mt-1 uppercase tracking-widest font-mono">
                          DINAMIS • HIGH Robustness
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <img
                          src={qrisImageUrl}
                          alt="QRIS Merchant"
                          className="w-full aspect-square max-w-[180px] object-contain rounded"
                          onError={(e) => {
                            // Fallback otomatis menggunakan qrserver dengan encoding string data yang valid jika aset lokal 404
                            const target = e.target as HTMLImageElement;
                            const fallbackUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&color=000000&data=${encodeURIComponent(qrisString)}`;
                            if (target.src !== fallbackUrl) {
                              target.src = fallbackUrl;
                            }
                          }}
                        />
                        <span className="text-[8px] text-stone-500 font-bold mt-1 uppercase tracking-widest font-mono">
                          STATIS • fallback active
                        </span>
                      </div>
                    )}
                    
                    {/* Badge */}
                    <div className="absolute inset-x-0 -bottom-2.5 mx-auto w-24 bg-rose-600 text-white text-[8px] font-bold py-0.5 rounded-full border border-white/20 uppercase tracking-widest text-center shadow">
                      QRIS ELEVA
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 leading-normal max-w-xs mx-auto font-sans">
                    Pindai kode QR di atas dengan aplikasi e-wallet (GoPay, ShopeePay, Dana, OVO, LinkAja) atau Mobile Banking (BCA, Mandiri, BRI, BNI) Anda.
                  </p>

                  <button
                    type="button"
                    onClick={() => handleProcessBooking("QRIS")}
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all active:scale-[0.98] cursor-pointer font-mono uppercase tracking-wider"
                  >
                    Saya Sudah Bayar (Kirim Bukti)
                  </button>
                </div>
              )}

              {selectedPaymentMethod === null && (
                <div className="text-center p-6 border border-dashed border-white/5 bg-stone-950/20 rounded-2xl">
                  <span className="text-3xl block mb-2 opacity-50">🧭</span>
                  <p className="text-xs text-slate-500">Silakan pilih salah satu metode pembayaran di atas untuk memproses transaksi sewa Anda.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-stone-950/80 px-6 py-3.5 border-t border-white/10 flex justify-between items-center text-[10px] text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Secure checkout
              </span>
              <span>Eleva RentCamp Ngalam</span>
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirm Dialog Modal */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-stone-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 bg-emerald-500/15 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
              <span className="text-xl">🏔️</span>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-white">{confirmDialog.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{confirmDialog.message}</p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                className="flex-1 py-2 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-slate-300 transition-all"
              >
                Batal
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold text-white transition-all shadow-md shadow-emerald-950/30"
              >
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Alert Dialog Modal */}
      {alertDialog.isOpen && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-stone-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 bg-emerald-500/15 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
              <span className="text-xl">✓</span>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-white">{alertDialog.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{alertDialog.message}</p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => setAlertDialog(prev => ({ ...prev, isOpen: false }))}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold text-white transition-all shadow-md shadow-emerald-950/30"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
