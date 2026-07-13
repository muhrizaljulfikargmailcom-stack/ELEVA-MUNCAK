import React, { useState } from "react";
import { 
  Layers, 
  RotateCcw, 
  Trash2, 
  ShieldCheck, 
  Info, 
  UserCheck, 
  Plus, 
  Minus, 
  ArrowRight, 
  TrendingUp, 
  DollarSign, 
  Package, 
  Users, 
  ShoppingBag, 
  History, 
  LogOut, 
  Check, 
  Search, 
  Filter, 
  Sparkles,
  School,
  CreditCard,
  CheckCircle,
  FileDown,
  Lock,
  PlusCircle,
  Edit2
} from "lucide-react";
import { GearInventoryItem } from "../App";

interface DashboardOwnerProps {
  gearInventory: GearInventoryItem[];
  setGearInventory: React.Dispatch<React.SetStateAction<GearInventoryItem[]>>;
  simulatedTransactions: any[];
  setSimulatedTransactions: React.Dispatch<React.SetStateAction<any[]>>;
  handleLogout: () => void;
  showAlert: (title: string, message: string) => void;
  showConfirm: (title: string, message: string, onConfirm: () => void) => void;
  INITIAL_GEAR_INVENTORY: GearInventoryItem[];
  qrisString: string;
  setQrisString: (val: string) => void;
  qrisImageUrl: string;
  setQrisImageUrl: (val: string) => void;
}

export default function DashboardOwner({
  gearInventory,
  setGearInventory,
  simulatedTransactions,
  setSimulatedTransactions,
  handleLogout,
  showAlert,
  showConfirm,
  INITIAL_GEAR_INVENTORY,
  qrisString,
  setQrisString,
  qrisImageUrl,
  setQrisImageUrl
}: DashboardOwnerProps) {
  // Tabs for subviews in owner dashboard
  const [activeTab, setActiveTab] = useState<"summary" | "inventory" | "transactions" | "tenants" | "settings">("summary");

  // Filter and search state for inventory
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  // New Equipment state
  const [newGear, setNewGear] = useState({
    nama: "",
    model: "",
    kategori: "Tenda",
    merek: "Eiger",
    warna: "Hijau Army, Orange",
    ukuran: "4 Orang",
    total_stok: 15,
    harga: 35000,
    gambar_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2ZxLlpxk2HCutP54vYYcLkMT1t4Etxsg98MlTC0Mt0Q&s=10"
  });

  // Editing price state
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);

  // State for viewing tenant identity document modal
  const [viewingIdentityTenant, setViewingIdentityTenant] = useState<any | null>(null);

  // Load real registered tenants or empty array (no mock/fake tenants shown by default)
  const [registeredTenants, setRegisteredTenants] = useState<any[]>(() => {
    const saved = localStorage.getItem("eleva_registered_tenants");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {}
    }
    
    // Automatically try to extract current logged-in user profile if registered
    const savedProfileStr = localStorage.getItem("eleva_profile");
    if (savedProfileStr) {
      try {
        const prof = JSON.parse(savedProfileStr);
        if (prof && prof.name) {
          const realTenant = {
            id: "tenant_user",
            name: prof.name,
            nim: prof.studentId || "-",
            univ: prof.university || "Umum / Non-Mahasiswa",
            phone: "081234567890",
            verified: prof.isVerified || false,
            joinedAt: new Date().toLocaleDateString("id-ID"),
            identityType: prof.identityType || "KTM",
            identityFileUrl: prof.ktmUrl || "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80",
            address: prof.address || "Malang"
          };
          localStorage.setItem("eleva_registered_tenants", JSON.stringify([realTenant]));
          return [realTenant];
        }
      } catch (e) {}
    }
    return [];
  });

  const saveTenants = (newTenants: any[]) => {
    setRegisteredTenants(newTenants);
    localStorage.setItem("eleva_registered_tenants", JSON.stringify(newTenants));
  };

  // Helper calculation values
  const totalItemsCount = gearInventory.reduce((acc, item) => acc + item.total_stok, 0);
  const totalRentedCount = gearInventory.reduce((acc, item) => acc + item.sedang_disewa, 0);
  const totalAvailableCount = gearInventory.reduce((acc, item) => acc + item.tersedia, 0);
  
  const estimatedRevenue = simulatedTransactions.reduce((acc, tx) => acc + (tx.totalCost || 0), 0);
  const totalTxCount = simulatedTransactions.length;

  const categories = ["Semua", "Tenda", "Tas & Tidur", "Masak & Gas", "Pakaian & Proteksi", "Aksesoris & Lainnya"];

  const handleAddNewGear = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGear.nama || !newGear.model || !newGear.harga) {
      showAlert("Data Tidak Lengkap", "Harap lengkapi Nama, Model/Specs, dan Harga sewa harian.");
      return;
    }

    const generatedId = newGear.nama.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now().toString().slice(-4);
    const itemToAdd: GearInventoryItem = {
      id: generatedId,
      kategori: newGear.kategori,
      nama: newGear.nama,
      name: newGear.nama,
      model: newGear.model,
      specs: newGear.model,
      warna: newGear.warna,
      merek: newGear.merek,
      ukuran: newGear.ukuran,
      total_stok: Number(newGear.total_stok),
      stok: Number(newGear.total_stok),
      sedang_disewa: 0,
      sewa: 0,
      tersedia: Number(newGear.total_stok),
      ready: Number(newGear.total_stok),
      harga: Number(newGear.harga),
      price: Number(newGear.harga),
      gambar_url: newGear.gambar_url,
      image: newGear.gambar_url
    };

    setGearInventory(prev => [itemToAdd, ...prev]);
    showAlert("Alat Baru Ditambahkan", `Berhasil menambahkan "${newGear.nama}" ke dalam inventaris Eleva Muncak.`);
    
    // Reset form
    setNewGear({
      nama: "",
      model: "",
      kategori: "Tenda",
      merek: "Eiger",
      warna: "Hijau Army, Orange",
      ukuran: "4 Orang",
      total_stok: 15,
      harga: 35000,
      gambar_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2ZxLlpxk2HCutP54vYYcLkMT1t4Etxsg98MlTC0Mt0Q&s=10"
    });
  };

  const updateItemStock = (itemId: string, increment: number) => {
    setGearInventory(prev => prev.map(item => {
      if (item.id === itemId) {
        const newTotal = Math.max(0, item.total_stok + increment);
        const newRented = Math.min(newTotal, item.sedang_disewa);
        const newAvailable = newTotal - newRented;
        return {
          ...item,
          total_stok: newTotal,
          stok: newTotal,
          sedang_disewa: newRented,
          sewa: newRented,
          tersedia: newAvailable,
          ready: newAvailable
        };
      }
      return item;
    }));
  };

  const handleUpdatePriceSubmit = (itemId: string) => {
    if (tempPrice <= 0) {
      showAlert("Harga Tidak Valid", "Silakan masukkan nilai harga harian di atas Rp 0.");
      return;
    }
    setGearInventory(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          harga: tempPrice,
          price: tempPrice
        };
      }
      return item;
    }));
    setEditingPriceId(null);
    showAlert("Harga Ter-update", "Harga sewa harian alat pendakian resmi berhasil diperbarui.");
  };

  const deleteInventoryItem = (itemId: string, name: string) => {
    showConfirm("Hapus Alat", `Apakah Sam yakin ingin menghapus "${name}" dari sistem inventaris sewa?`, () => {
      setGearInventory(prev => prev.filter(item => item.id !== itemId));
      showAlert("Alat Dihapus", `"${name}" berhasil dikeluarkan dari inventaris.`);
    });
  };

  const handleUpdateTxStatus = (txId: string, currentStatus: string) => {
    let nextStatus = "Sedang Disewa";
    if (currentStatus === "Sedang Disewa") {
      nextStatus = "Selesai & Kembali";
    } else if (currentStatus === "Selesai & Kembali") {
      nextStatus = "Menunggu Pengambilan";
    }

    setSimulatedTransactions(prev => prev.map(tx => {
      if (tx.receiptId === txId) {
        return { ...tx, status: nextStatus };
      }
      return tx;
    }));
    showAlert("Status Diperbarui", `Status reservasi ${txId} berhasil diubah menjadi: ${nextStatus}`);
  };

  const handleToggleTenantVerify = (tenantId: string) => {
    const updated = registeredTenants.map(t => {
      if (t.id === tenantId) {
        const nextState = !t.verified;
        showAlert("Status KTM Berubah", `${t.name} sekarang berstatus ${nextState ? "KTM TERVERIFIKASI" : "KTM BELUM VERIFIKASI"}`);
        
        // Sync back to current user's profile if it matches this tenant
        const activeProfileStr = localStorage.getItem("eleva_profile");
        if (activeProfileStr) {
          try {
            const activeProfile = JSON.parse(activeProfileStr);
            if (activeProfile && (activeProfile.name === t.name || activeProfile.studentId === t.nim)) {
              activeProfile.isVerified = nextState;
              localStorage.setItem("eleva_profile", JSON.stringify(activeProfile));
            }
          } catch (e) {}
        }
        
        return { ...t, verified: nextState };
      }
      return t;
    });
    saveTenants(updated);
  };

  const handleCreateMockTenant = () => {
    const names = ["Sultan Bayu", "Nabila Putri", "Daffa Arkan", "Fatimah Azzahra"];
    const univs = ["Universitas Muhammadiyah Malang (UMM)", "Universitas Brawijaya (UB)", "Universitas Negeri Malang (UM)", "Politeknik Negeri Malang (Polinema)", "Umum / Non-Mahasiswa"];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomUniv = univs[Math.floor(Math.random() * univs.length)];
    const randomNim = "202" + Math.floor(10 + Math.random() * 4).toString() + "103" + Math.floor(1000000 + Math.random() * 9000000).toString();
    const phone = "08" + Math.floor(100000000 + Math.random() * 900000000).toString();
    
    const types: ("KTP" | "KTM" | "SIM")[] = ["KTP", "KTM", "SIM"];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const urls = {
      KTM: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80",
      KTP: "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&w=400&q=80",
      SIM: "https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?auto=format&fit=crop&w=400&q=80"
    };
    
    const newT = {
      id: Date.now().toString(),
      name: randomName,
      nim: randomNim,
      univ: randomUniv,
      phone: phone,
      verified: Math.random() > 0.3,
      joinedAt: "05-07-2026",
      identityType: randomType,
      identityFileUrl: urls[randomType],
      address: "Jl. Raya Tlogomas No. " + Math.floor(1 + Math.random() * 200) + ", Lowokwaru, Malang"
    };

    saveTenants([newT, ...registeredTenants]);
    showAlert("Penyewa Ditambahkan", `Simulasi pendaftaran penyewa baru berhasil untuk: ${randomName}`);
  };

  // Filtered inventory logic
  const filteredGear = gearInventory.filter(item => {
    const matchesSearch = item.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.merek.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.model.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === "Semua") {
      return matchesSearch;
    }
    
    if (selectedCategory === "Tenda") {
      return ["Tenda", "Flysheet", "Pasak Cadangan"].includes(item.kategori) && matchesSearch;
    }
    if (selectedCategory === "Tas & Tidur") {
      return ["Carrier", "Daypack", "Sleeping Bag", "Matras", "Dry Bag"].includes(item.kategori) && matchesSearch;
    }
    if (selectedCategory === "Masak & Gas") {
      return ["Kompor", "Nesting", "Gas Kaleng"].includes(item.kategori) && matchesSearch;
    }
    if (selectedCategory === "Pakaian & Proteksi") {
      return ["Pakaian & Proteksi", "Pakaian", "Sepatu", "Gaiter", "Sarung Tangan", "Jas Hujan"].includes(item.kategori) && matchesSearch;
    }
    if (selectedCategory === "Aksesoris & Lainnya") {
      return ["Headlamp", "Senter", "Trekking Pole", "Kursi Lipat", "Meja Lipat", "Tali Paracord", "P3K", "Hammock"].includes(item.kategori) && matchesSearch;
    }
    return item.kategori === selectedCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0f19] via-[#091b12] to-[#04110a] text-slate-100 flex flex-col font-sans relative">
      
      {/* HEADER SECTION */}
      <header className="bg-stone-900/80 backdrop-blur-md border-b border-white/10 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          
          {/* Title and Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400/20">
              <Lock className="w-5 h-5 text-stone-950 font-bold" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white font-display flex items-center gap-2">
                ELEVA OWNER <span className="text-emerald-400">DASHBOARD</span>
              </h1>
              <p className="text-[10px] text-emerald-300 font-mono tracking-widest uppercase">Basecamp RentCamp Ngalam • Control Panel</p>
            </div>
          </div>

          {/* Quick Actions / Logout */}
          <div className="flex items-center gap-3">
            <div className="py-1 px-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[10px] font-mono text-emerald-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
              SISTEM OWNER LIVE
            </div>
            <button
              onClick={handleLogout}
              className="py-2 px-3.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              LOGOUT ADMIN
            </button>
          </div>

        </div>
      </header>

      {/* INNER CONTENT AREA */}
      <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex-1 flex flex-col gap-6">
        
        {/* TOP STATUS STATISTICS BENTO GRID */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
          
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider font-mono">Total Alat</span>
              <Package className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-black text-white font-mono">{gearInventory.length}</p>
              <p className="text-[10px] text-slate-500 mt-1">Variasi perlengkapan</p>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider font-mono">Stok Tersedia</span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-black text-emerald-400 font-mono">{totalAvailableCount}</p>
              <p className="text-[10px] text-slate-500 mt-1">Siap untuk disewa</p>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider font-mono">Sedang Disewa</span>
              <ShoppingBag className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-black text-amber-300 font-mono">{totalRentedCount}</p>
              <p className="text-[10px] text-slate-500 mt-1">Unit di luar basecamp</p>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider font-mono">Estimasi Omset</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-xl font-black text-emerald-300 font-mono">Rp {estimatedRevenue.toLocaleString("id-ID")}</p>
              <p className="text-[10px] text-slate-500 mt-1">Dari {totalTxCount} reservasi</p>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 flex flex-col justify-between col-span-2 md:col-span-1">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider font-mono">Penyewa Aktif</span>
              <Users className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <p className="text-2xl font-black text-sky-400 font-mono">{registeredTenants.length}</p>
              <p className="text-[10px] text-slate-500 mt-1">Mahasiswa terdaftar</p>
            </div>
          </div>

        </section>

        {/* ADMIN VIEW TABS NAVIGATION */}
        <section className="flex flex-wrap items-center justify-between border-b border-white/10 pb-4 gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab("summary")}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold font-mono transition-all ${
                activeTab === "summary"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Ringkasan &amp; Panel Kontrol
            </button>
            <button
              onClick={() => setActiveTab("inventory")}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold font-mono transition-all ${
                activeTab === "inventory"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Kelola Stok &amp; Alat ({gearInventory.length})
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold font-mono transition-all ${
                activeTab === "transactions"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Log Transaksi Reservasi ({simulatedTransactions.length})
            </button>
            <button
              onClick={() => setActiveTab("tenants")}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold font-mono transition-all ${
                activeTab === "tenants"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Daftar Penyewa Mahasiswa ({registeredTenants.length})
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold font-mono transition-all ${
                activeTab === "settings"
                  ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              ⚙️ Pengaturan QRIS
            </button>
          </div>

          {/* Quick Config Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                showConfirm("Reset Semua Stok", "Kembalikan kondisi stok seluruh barang ke awal?", () => {
                  setGearInventory(INITIAL_GEAR_INVENTORY);
                  showAlert("Stok Diatur Ulang", "Seluruh stok inventaris dikembalikan ke kondisi awal (penuh).");
                });
              }}
              className="p-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 rounded-xl text-[10px] font-bold font-mono tracking-wider transition-all"
              title="Reset Semua Stok"
            >
              RESET STOK
            </button>
            <button
              onClick={() => {
                showConfirm("Kosongkan Riwayat", "Ingin menghapus seluruh riwayat transaksi simulasi?", () => {
                  setSimulatedTransactions([]);
                  showAlert("Riwayat Dihapus", "Log transaksi simulasi telah dikosongkan.");
                });
              }}
              className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 rounded-xl text-[10px] font-bold font-mono tracking-wider transition-all"
              title="Hapus Riwayat Transaksi"
            >
              KOSONGKAN TRANSAKSI
            </button>
          </div>
        </section>

        {/* TAB PANEL CONTENT */}
        
        {/* TAB 1: SUMMARY PANELS */}
        {activeTab === "summary" && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Quick overview widget */}
            <div className="lg:col-span-2 bg-stone-900/80 border border-white/10 rounded-3xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2 font-display">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    Ikhtisar Operasional Basecamp
                  </h3>
                  <p className="text-xs text-slate-400">Statistik real-time pergerakan sewa &amp; stok aktif mahasiswa Malang Raya.</p>
                </div>
              </div>

              {/* Status messages or alerts */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-2xl">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider font-mono">Keamanan Stok</span>
                  <p className="text-xs text-slate-200 mt-1 leading-normal">Kondisi persediaan aman. {totalAvailableCount} item siap dibawa mendaki gunung Jatim.</p>
                </div>
                <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-2xl">
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider font-mono">Reservasi Aktif</span>
                  <p className="text-xs text-slate-200 mt-1 leading-normal">{totalRentedCount} item sedang berpetualang bersama para pendaki mahasiswa.</p>
                </div>
                <div className="bg-sky-500/5 border border-sky-500/20 p-4 rounded-2xl">
                  <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider font-mono">KTM Terverifikasi</span>
                  <p className="text-xs text-slate-200 mt-1 leading-normal">
                    {registeredTenants.filter(t => t.verified).length} dari {registeredTenants.length} mahasiswa berstatus KTM aktif (Bebas Deposit).
                  </p>
                </div>
              </div>

              {/* Quick helper guide for owner */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-2 text-xs">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <Info className="w-4 h-4 text-emerald-400" />
                  Alur Manajemen Multi-Role Eleva:
                </h4>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                  <li><strong>Kontrol Stok Dinamis:</strong> Setiap kali penyewa/user melakukan simulasi checkout sewa alat, stok akan terpotong secara real-time di database.</li>
                  <li><strong>Update Status Log:</strong> Masuk ke tab <em>Log Transaksi</em> untuk melacak status pengambilan barang mahasiswa (Menunggu Pengambilan → Sedang Disewa → Kembali).</li>
                  <li><strong>Verifikasi Manual KTM:</strong> Mahasiswa dapat mengunggah KTM di profil mereka, dan Admin dapat menyetujui/memverifikasi jaminan KTM di tab <em>Daftar Penyewa</em>.</li>
                </ul>
              </div>
            </div>

            {/* Quick Add New Equipment Form in sidebar */}
            <div className="bg-stone-900/80 border border-white/10 rounded-3xl p-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1 font-display">
                <PlusCircle className="w-5 h-5 text-emerald-400" />
                Tambah Alat Baru
              </h3>
              <p className="text-xs text-slate-400 mb-4">Tambahkan item perlengkapan pendakian baru ke basecamp resmi Eleva.</p>

              <form onSubmit={handleAddNewGear} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider font-mono">Nama Alat</label>
                  <input
                    type="text"
                    required
                    value={newGear.nama}
                    onChange={(e) => setNewGear({ ...newGear, nama: e.target.value })}
                    placeholder="Contoh: Tenda Storm Dome 2P"
                    className="w-full px-3 py-2 bg-stone-950/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-emerald-500 transition-all text-slate-100 placeholder:text-slate-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider font-mono">Kategori</label>
                    <select
                      value={newGear.kategori}
                      onChange={(e) => setNewGear({ ...newGear, kategori: e.target.value })}
                      className="w-full px-2 py-2 bg-stone-950 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-slate-100"
                    >
                      <option value="Tenda">Tenda</option>
                      <option value="Tas & Tidur">Tas &amp; Tidur</option>
                      <option value="Masak & Gas">Masak &amp; Gas</option>
                      <option value="Pakaian & Proteksi">Pakaian</option>
                      <option value="Aksesoris & Lainnya">Aksesoris</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider font-mono">Merek</label>
                    <input
                      type="text"
                      required
                      value={newGear.merek}
                      onChange={(e) => setNewGear({ ...newGear, merek: e.target.value })}
                      placeholder="Eiger, Consina"
                      className="w-full px-3 py-2 bg-stone-950/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-emerald-500 transition-all text-slate-100 placeholder:text-slate-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider font-mono">Model / Spesifikasi</label>
                    <input
                      type="text"
                      required
                      value={newGear.model}
                      onChange={(e) => setNewGear({ ...newGear, model: e.target.value })}
                      placeholder="Double Layer, Alloy Pole"
                      className="w-full px-3 py-2 bg-stone-950/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-emerald-500 transition-all text-slate-100 placeholder:text-slate-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider font-mono">Ukuran / Kapasitas</label>
                    <input
                      type="text"
                      required
                      value={newGear.ukuran}
                      onChange={(e) => setNewGear({ ...newGear, ukuran: e.target.value })}
                      placeholder="2-3 Orang, 60L"
                      className="w-full px-3 py-2 bg-stone-950/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-emerald-500 transition-all text-slate-100 placeholder:text-slate-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider font-mono">Stok Awal</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={newGear.total_stok}
                      onChange={(e) => setNewGear({ ...newGear, total_stok: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-stone-950/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-emerald-500 transition-all text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider font-mono">Harga Harian (Rp)</label>
                    <input
                      type="number"
                      required
                      min={1000}
                      step={500}
                      value={newGear.harga}
                      onChange={(e) => setNewGear({ ...newGear, harga: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-stone-950/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-emerald-500 transition-all text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider font-mono">Link Gambar URL</label>
                  <input
                    type="text"
                    value={newGear.gambar_url}
                    onChange={(e) => setNewGear({ ...newGear, gambar_url: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-950/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-emerald-500 transition-all text-slate-100"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl transition-all shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 active:scale-[0.98] mt-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  SIMPAN KE INVENTARIS
                </button>
              </form>
            </div>

          </section>
        )}

        {/* TAB 2: INVENTORY MANAGEMENT */}
        {activeTab === "inventory" && (
          <section className="bg-stone-900/80 border border-white/10 rounded-3xl p-6 space-y-6">
            
            {/* Filter and Search controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
              
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Cari nama, merek, atau model..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-stone-950/40 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-emerald-500 transition-all text-slate-100 placeholder:text-slate-600"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`py-1.5 px-3 rounded-lg text-[10px] font-bold font-mono transition-all whitespace-nowrap ${
                      selectedCategory === cat
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-white/[0.02] text-slate-400 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

            </div>

            {/* Inventory Table Grid */}
            <div className="overflow-x-auto border border-white/10 rounded-2xl bg-stone-950/40">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/10 text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">
                    <th className="p-4">Alat</th>
                    <th className="p-4">Kategori</th>
                    <th className="p-4">Spesifikasi</th>
                    <th className="p-4 text-center">Stok Total</th>
                    <th className="p-4 text-center">Tersedia</th>
                    <th className="p-4 text-center">Disewa</th>
                    <th className="p-4">Harga / Hari</th>
                    <th className="p-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs">
                  {filteredGear.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-500 font-mono">
                        Tidak ada alat pendakian yang cocok dengan pencarian Anda.
                      </td>
                    </tr>
                  ) : (
                    filteredGear.map((item) => (
                      <tr key={item.id} className="hover:bg-white/[0.01] transition-all">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.gambar_url}
                              alt={item.nama}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 object-cover rounded-lg border border-white/10 bg-stone-900 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-white">{item.nama}</p>
                              <p className="text-[9px] text-slate-500 font-mono uppercase">{item.merek}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-[9px] font-bold font-mono bg-stone-900 border border-white/5 px-2 py-0.5 rounded text-emerald-300">
                            {item.kategori}
                          </span>
                        </td>
                        <td className="p-4 text-slate-400 font-sans">
                          <p className="font-medium text-[11px]">{item.model}</p>
                          <p className="text-[9px] text-slate-500">Ukuran: {item.ukuran || "-"}</p>
                        </td>
                        <td className="p-4 text-center font-bold font-mono text-white">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => updateItemStock(item.id, -1)}
                              className="w-5 h-5 bg-stone-900 hover:bg-stone-850 rounded border border-white/5 flex items-center justify-center text-rose-400 font-black cursor-pointer"
                            >
                              -
                            </button>
                            <span className="min-w-6">{item.total_stok}</span>
                            <button
                              onClick={() => updateItemStock(item.id, 1)}
                              className="w-5 h-5 bg-stone-900 hover:bg-stone-850 rounded border border-white/5 flex items-center justify-center text-emerald-400 font-black cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="p-4 text-center font-bold font-mono text-emerald-400">{item.tersedia}</td>
                        <td className="p-4 text-center font-bold font-mono text-amber-400">{item.sedang_disewa}</td>
                        <td className="p-4 font-bold font-mono">
                          {editingPriceId === item.id ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                step={500}
                                min={500}
                                value={tempPrice}
                                onChange={(e) => setTempPrice(Number(e.target.value))}
                                className="w-20 px-1.5 py-1 bg-stone-900 border border-emerald-500/30 rounded text-center text-xs text-white"
                              />
                              <button
                                onClick={() => handleUpdatePriceSubmit(item.id)}
                                className="p-1 bg-emerald-500 text-stone-950 rounded cursor-pointer"
                                title="Simpan Harga"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <span>Rp {item.harga.toLocaleString("id-ID")}</span>
                              <button
                                onClick={() => {
                                  setEditingPriceId(item.id);
                                  setTempPrice(item.harga);
                                }}
                                className="text-slate-500 hover:text-emerald-400 transition-colors"
                                title="Edit Harga"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => deleteInventoryItem(item.id, item.nama)}
                            className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 rounded-lg transition-all cursor-pointer"
                            title="Hapus Dari Sistem"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </section>
        )}

        {/* TAB 3: RESERVATIONS LOG */}
        {activeTab === "transactions" && (
          <section className="bg-stone-900/80 border border-white/10 rounded-3xl p-6 space-y-4">
            
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2 font-display">
                  <History className="w-5 h-5 text-emerald-400" />
                  Log Transaksi Reservasi Mahasiswa
                </h3>
                <p className="text-xs text-slate-400">Daftar lengkap simulasi pemesanan/reservasi alat real-time dari aplikasi sewa.</p>
              </div>
            </div>

            {simulatedTransactions.length === 0 ? (
              <div className="bg-stone-950/40 border border-dashed border-white/10 rounded-2xl p-12 text-center">
                <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-400 font-mono">Belum ada transaksi sewa yang tersimulasi.</p>
                <p className="text-xs text-slate-500 mt-1">Silakan gunakan akun Penyewa/User untuk menyewa perlengkapan terlebih dahulu!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {simulatedTransactions.map((tx, idx) => (
                  <div key={tx.receiptId || idx} className="bg-stone-950/60 border border-white/10 rounded-2xl p-5 font-mono text-xs space-y-3">
                    
                    {/* Log Card Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-3 gap-2">
                      <div>
                        <span className="font-bold text-emerald-400 text-sm">{tx.receiptId}</span>
                        <span className="text-slate-500 ml-2">({tx.timestamp})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">Status:</span>
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase ${
                          tx.status === "Selesai & Kembali"
                            ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20"
                            : tx.status === "Sedang Disewa"
                            ? "bg-amber-500/15 text-amber-300 border border-amber-500/20"
                            : "bg-sky-500/15 text-sky-300 border border-sky-500/20"
                        }`}>
                          {tx.status || "Menunggu Pengambilan"}
                        </span>
                        
                        {/* Change status button */}
                        <button
                          onClick={() => handleUpdateTxStatus(tx.receiptId, tx.status)}
                          className="py-1 px-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded text-[9px] font-bold uppercase cursor-pointer"
                        >
                          UBAH STATUS
                        </button>
                      </div>
                    </div>

                    {/* Content details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-slate-400 uppercase tracking-wider text-[10px] mb-1 font-bold">Informasi Penyewa:</p>
                        <ul className="space-y-1 text-slate-300">
                          <li>Nama: <strong className="text-white">{tx.tenantName}</strong></li>
                          <li>NIM / ID: {tx.studentId || "-"}</li>
                          <li>Kampus: {tx.university || "-"}</li>
                          <li>Jaminan: {tx.statusVerified ? <span className="text-emerald-400 font-bold">KTM Terverifikasi (Bebas Deposit)</span> : <span className="text-amber-400 font-bold">Butuh Jaminan KTP / SIM</span>}</li>
                          {tx.paymentMethod && (
                            <li>Metode Bayar: <span className="text-sky-400 font-bold uppercase">{tx.paymentMethod === "QRIS" ? "📱 QRIS Real" : "💵 COD"}</span></li>
                          )}
                        </ul>
                        <button
                          type="button"
                          onClick={() => {
                            const matchedTenant = registeredTenants.find(t => t.name === tx.tenantName || t.nim === tx.studentId);
                            if (matchedTenant) {
                              setViewingIdentityTenant(matchedTenant);
                            } else {
                              setViewingIdentityTenant({
                                name: tx.tenantName,
                                nim: tx.studentId || "-",
                                univ: tx.university || "Umum",
                                identityType: tx.statusVerified ? "KTM" : "KTP",
                                identityFileUrl: tx.statusVerified 
                                  ? "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80"
                                  : "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&w=400&q=80",
                                address: "Data alamat tersemat di profile jaminan."
                              });
                            }
                          }}
                          className="mt-2 py-1 px-2.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/20 rounded text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1"
                        >
                          <span>🔎</span> Lihat Berkas Jaminan
                        </button>
                      </div>
                      <div>
                        <p className="text-slate-400 uppercase tracking-wider text-[10px] mb-1 font-bold">Rencana Trekking:</p>
                        <p className="text-slate-300">Tujuan: Gunung <strong className="text-emerald-300 uppercase">{tx.mountainName || tx.mountain_id}</strong></p>
                        <p className="text-slate-300 mt-1">Durasi Sewa: <strong>{tx.duration} Hari</strong></p>
                      </div>
                    </div>

                    {/* Ordered Gear Items */}
                    <div className="bg-white/[0.01] p-3.5 rounded-xl border border-white/5">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Item Reservasi:</p>
                      <div className="divide-y divide-white/5">
                        {tx.items.map((it: any, i: number) => (
                          <div key={i} className="flex justify-between items-center py-2 text-[11px]">
                            <span className="text-slate-300 font-medium">
                              {it.nama || it.name} <strong className="text-emerald-400">x{it.qty}</strong>
                            </span>
                            <span className="text-slate-400">
                              Rp {(it.subtotal || (it.harga * it.qty)).toLocaleString("id-ID")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total cost footer */}
                    <div className="flex justify-between items-center font-bold text-white pt-2 border-t border-white/5">
                      <span className="text-slate-400 text-xs">Total Biaya Sewa ({tx.duration} hari):</span>
                      <span className="text-base text-emerald-400">Rp {tx.totalCost.toLocaleString("id-ID")}</span>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </section>
        )}

        {/* TAB 4: REGISTERED TENANTS LIST */}
        {activeTab === "tenants" && (
          <section className="bg-stone-900/80 border border-white/10 rounded-3xl p-6 space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2 font-display">
                  <Users className="w-5 h-5 text-emerald-400" />
                  Daftar Penyewa Mahasiswa Malang
                </h3>
                <p className="text-xs text-slate-400">Kelola dan verifikasi jaminan KTM aktif agar mahasiswa sewa tanpa uang jaminan deposit.</p>
              </div>
              <button
                onClick={handleCreateMockTenant}
                className="py-2.5 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 rounded-xl text-xs font-bold font-mono tracking-wide transition-all flex items-center gap-1.5 active:scale-[0.98] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                SIMULASIKAN PENYEWA BARU
              </button>
            </div>

            {/* Tenant Cards Grid */}
            {registeredTenants.length === 0 ? (
              <div className="bg-stone-950/40 border border-white/5 rounded-2xl p-8 text-center text-slate-400 text-sm space-y-2">
                <Users className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="font-semibold text-white">Belum Ada Penyewa Terdaftar</p>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Daftar penyewa hanya berisi data mahasiswa Malang yang riil melakukan registrasi dokumen jaminan atau simulasi transaksi sewa dari aplikasi ini.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {registeredTenants.map((t) => (
                  <div key={t.id} className="bg-stone-950/40 border border-white/10 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-sm text-white">{t.name}</h4>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">NIM / ID: {t.nim}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono ${
                          t.verified 
                            ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20" 
                            : "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                        }`}>
                          {t.verified ? "JAMINAN TERVERIFIKASI ✓" : "BELUM VERIFIKASI"}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-400 pt-1 font-sans">
                        <p className="flex items-center gap-1.5">
                          <School className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          {t.univ}
                        </p>
                        <p className="flex items-center gap-1.5 font-mono text-[11px]">
                          <span className="text-emerald-400">📞</span>
                          {t.phone}
                        </p>
                        {t.identityType && (
                          <p className="flex items-center gap-1.5 font-mono text-[11px] text-slate-300">
                            <span className="text-amber-400">🪪</span>
                            Tipe Berkas: <strong className="text-white uppercase">{t.identityType}</strong>
                          </p>
                        )}
                        {t.address && (
                          <p className="flex items-start gap-1.5 text-[11px] text-slate-400 leading-normal">
                            <span className="text-emerald-400 shrink-0">📍</span>
                            <span className="line-clamp-2">Alamat: {t.address}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-3 mt-2 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 text-[11px]">
                      <span className="text-slate-500 font-mono">Daftar: {t.joinedAt || "05-07-2026"}</span>
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setViewingIdentityTenant(t)}
                          className="py-1.5 px-2.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/20 rounded-lg font-bold font-mono transition-all text-[10px] cursor-pointer flex items-center gap-1"
                        >
                          🔎 LIHAT BERKAS
                        </button>
                        <button
                          onClick={() => handleToggleTenantVerify(t.id)}
                          className={`py-1.5 px-3 rounded-lg font-bold font-mono transition-all text-[10px] cursor-pointer ${
                            t.verified 
                              ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20" 
                              : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20"
                          }`}
                        >
                          {t.verified ? "BATALKAN VERIFIKASI" : "SETUJUI"}
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </section>
        )}

        {activeTab === "settings" && (
          <section className="bg-stone-900/80 border border-white/10 rounded-3xl p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2 font-display">
                <span className="text-emerald-400 text-xl">⚙️</span>
                Pengaturan Metode Pembayaran &amp; QRIS Real
              </h3>
              <p className="text-xs text-slate-400">
                Atur data string QRIS dan tautan berkas gambar QRIS basecamp Eleva RentCamp agar sinkron dengan sistem e-wallet &amp; perbankan secara real.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form Input */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-stone-950/40 border border-white/5 rounded-2xl p-5 space-y-4">
                  <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-emerald-400">
                    Konfigurasi QRIS Basecamp
                  </h4>

                  {/* QRIS String Field */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                      Data Kode Teks QRIS (EMVCo String)
                    </label>
                    <textarea
                      rows={4}
                      value={qrisString}
                      onChange={(e) => {
                        const val = e.target.value;
                        setQrisString(val);
                        localStorage.setItem("eleva_qris_string", val);
                      }}
                      className="w-full bg-stone-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white font-mono focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 leading-relaxed"
                      placeholder="Masukkan kode teks QRIS resmi Anda..."
                    />
                    <p className="text-[10px] text-slate-500 leading-normal font-sans">
                      ⚠️ <strong>Penting:</strong> Teks ini harus persis sesuai hasil ekstensi QRIS merchant Anda (biasanya diawali <code>000201010212...</code>). Satu huruf atau digit yang salah akan merusak checksum <strong>CRC16</strong> sehingga tidak terdaftar di banking scanner.
                    </p>
                  </div>

                  {/* QRIS Image URL Field */}
                  <div className="space-y-1.5 pt-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                      Tautan Gambar / Path Gambar Lokal (Fallback)
                    </label>
                    <input
                      type="text"
                      value={qrisImageUrl}
                      onChange={(e) => {
                        const val = e.target.value;
                        setQrisImageUrl(val);
                        localStorage.setItem("eleva_qris_image_url", val);
                      }}
                      className="w-full bg-stone-900 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white font-mono focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
                      placeholder="/src/assets/1000275887.jpg"
                    />
                    <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1 text-[10px] text-slate-400 leading-normal font-sans">
                      <p><strong>Panduan Gambar Lokal:</strong></p>
                      <ul className="list-disc pl-4 space-y-0.5">
                        <li>Jika Anda mengunggah berkas QRIS bernama <code className="text-white">1000275887.jpg</code> ke folder <code className="text-white">/src/assets/</code> di editor, gunakan nilai default: <code className="text-emerald-300">/src/assets/1000275887.jpg</code></li>
                        <li>Anda juga bisa menggunakan link gambar publik dari Imgur, Postimages, dll.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const defaultQris = "00020101021126660014ID.CO.QRIS.WWW01189360091410265279660215ID10265279665700303UME5204531153033605802ID5917FEBBY'S, OTOMOTIF6006MALANG61056512662070703A016304B2AD";
                        showConfirm("Reset QRIS Default", "Kembalikan data QRIS ke default bawaan sistem?", () => {
                          setQrisString(defaultQris);
                          setQrisImageUrl("/src/assets/1000275887.jpg");
                          localStorage.setItem("eleva_qris_string", defaultQris);
                          localStorage.setItem("eleva_qris_image_url", "/src/assets/1000275887.jpg");
                          showAlert("QRIS Direset", "Data QRIS telah dikembalikan ke string bawaan.");
                        });
                      }}
                      className="py-2 px-3 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Reset Default
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        showAlert("Pengaturan Disimpan", "Konfigurasi QRIS berhasil disimpan dan langsung disinkronkan ke halaman pembayaran pelanggan.");
                      }}
                      className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>✓</span> Simpan &amp; Terapkan
                    </button>
                  </div>

                </div>
              </div>

              {/* Preview Live */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-stone-950/60 border border-white/10 rounded-2xl p-5 space-y-4 flex flex-col items-center text-center">
                  <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400 self-start">
                    Pratinjau Live Pembayaran
                  </h4>

                  <div className="bg-white p-3 rounded-2xl border border-stone-800 max-w-[200px] w-full shadow-xl relative mt-2 flex flex-col items-center justify-center min-h-[176px]">
                    <div className="text-[10px] text-stone-900 font-bold mb-1">Eleva QRIS Real-time</div>
                    
                    <div className="w-full aspect-square bg-stone-100 flex items-center justify-center rounded border border-stone-200 text-stone-900 text-xs p-2">
                      <span className="font-mono text-[9px] break-all leading-normal text-stone-700 font-bold">{qrisString}</span>
                    </div>

                    <div className="mt-2 text-[9px] text-stone-500 font-mono tracking-tighter truncate max-w-[170px]">
                      {qrisString.slice(0, 20)}...{qrisString.slice(-15)}
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 leading-normal max-w-sm pt-2">
                    <p><strong>Catatan Integrasi:</strong></p>
                    <p className="text-[11px] mt-1 text-slate-500">
                      Sistem pembayaran secara dinamis memuat gambar lokal atau merender kode QRIS dengan standar binarisasi hitam-putih murni agar mudah terbaca oleh kamera e-wallet/m-banking.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

      </main>

      {/* Modal Viewer */}
      {viewingIdentityTenant && (
        <div className="fixed inset-0 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-stone-900 border border-white/10 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="bg-stone-950 px-6 py-4 border-b border-white/10 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  DOKUMEN JAMINAN • {viewingIdentityTenant.identityType || "KTM / KTP / SIM"}
                </h3>
                <p className="text-[10px] text-slate-500">Penyewa: {viewingIdentityTenant.name}</p>
              </div>
              <button
                onClick={() => setViewingIdentityTenant(null)}
                className="text-slate-400 hover:text-white font-black text-sm p-1"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {/* Image Preview Container */}
              <div className="aspect-video w-full bg-stone-950 border border-white/5 rounded-xl overflow-hidden relative flex items-center justify-center">
                {viewingIdentityTenant.identityFileUrl ? (
                  <img
                    src={viewingIdentityTenant.identityFileUrl}
                    alt={`Dokumen ${viewingIdentityTenant.identityType || 'Identitas'}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center p-4">
                    <span className="text-3xl block mb-2">📁</span>
                    <p className="text-xs text-slate-500 font-mono">Gambar tidak tersedia atau menggunakan default</p>
                  </div>
                )}
              </div>

              {/* Tenant Details */}
              <div className="bg-stone-950/40 border border-white/5 rounded-xl p-4 text-xs space-y-2 font-mono">
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500">NAMA LENGKAP:</span>
                  <span className="col-span-2 text-white font-bold">{viewingIdentityTenant.name}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500">KAMPUS / UMUM:</span>
                  <span className="col-span-2 text-slate-300">{viewingIdentityTenant.univ || "Umum (Non-Mahasiswa)"}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500 font-mono">ID / NIM:</span>
                  <span className="col-span-2 text-emerald-400 font-bold">{viewingIdentityTenant.nim}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500">ALAMAT TINGGAL:</span>
                  <span className="col-span-2 text-slate-300 leading-normal">{viewingIdentityTenant.address || "Belum melengkapi alamat"}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500">TIPE JAMINAN:</span>
                  <span className="col-span-2 text-amber-300 font-bold uppercase tracking-wider">{viewingIdentityTenant.identityType || "KTM / KTP / SIM"}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-stone-950/80 px-6 py-3 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setViewingIdentityTenant(null)}
                className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold text-white transition-all shadow-md cursor-pointer"
              >
                Tutup Dokumen
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-white/10 py-4 text-center text-[10px] text-slate-600 font-mono">
        Eleva RentCamp Ngalam Dashboard © 2026. Admin Secure Environment.
      </footer>

    </div>
  );
}
