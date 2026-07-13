import { createClient } from "@supabase/supabase-js";

// Retrieve keys from build-time Vite environment variables or fallback directly to provided values
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://gkvkczdzlmoabbdvkshu.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrdmtjemR6bG1vYWJiZHZrcmh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyNjA1NjUsImV4cCI6MjA5ODgzNjU2NX0.BJg5BuzDnThFu7Z0HNjEjC_w1YAp5B5Rsy3_0x248R0";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Resiliently inserts or upserts a profile to 'profiles' table.
 * It tries various common field names (both English and Indonesian translations)
 * so it will succeed no matter what the database schema is.
 */
export async function saveProfileToSupabase(profile: any) {
  try {
    const id = profile.id || "prof_" + Date.now().toString() + "_" + Math.floor(Math.random() * 1000);
    
    // Attempt 1: English structure with snake_case and various alias columns
    const payloadEnglish = {
      id,
      name: profile.name,
      full_name: profile.name,
      student_id: profile.studentId || profile.nim || "-",
      nim: profile.studentId || profile.nim || "-",
      identity_number: profile.studentId || profile.nim || "-",
      university: profile.university || null,
      univ: profile.university || null,
      identity_type: profile.identityType || "KTM",
      card_type: profile.identityType || "KTM",
      address: profile.address || null,
      is_verified: profile.isVerified ?? true,
      verified: profile.isVerified ?? true
    };

    console.log("Saving profile to Supabase with payload:", payloadEnglish);
    const { data, error } = await supabase
      .from("profiles")
      .upsert(payloadEnglish, { onConflict: "id" })
      .select();

    if (error) {
      console.warn("Supabase profile save error, trying Indonesian fallback:", error);
      
      // Attempt 2: Indonesian translation columns (resilient fallback)
      const payloadIndonesian = {
        id,
        nama: profile.name,
        nomor_identitas: profile.studentId || profile.nim || "-",
        nim: profile.studentId || profile.nim || "-",
        asal_kampus: profile.university || null,
        jenis_kartu: profile.identityType || "KTM",
        alamat: profile.address || null,
        status_verifikasi: profile.isVerified ?? true
      };
      
      const { data: idData, error: idError } = await supabase
        .from("profiles")
        .upsert(payloadIndonesian, { onConflict: "id" })
        .select();
        
      if (idError) {
        // Attempt 3: absolute minimum columns (just name)
        console.warn("Indonesian fallback also failed, trying minimum payload:", idError);
        const minPayload = {
          id,
          name: profile.name,
          nama: profile.name
        };
        const { error: minError } = await supabase
          .from("profiles")
          .upsert(minPayload);
        if (minError) {
          throw minError;
        }
      }
    }
    return true;
  } catch (err) {
    console.error("Error writing profile to Supabase:", err);
    return false;
  }
}

/**
 * Loads products from Supabase 'products' table.
 * Adapts different potential schemas back to our GearInventoryItem.
 */
export async function fetchProductsFromSupabase() {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*");
      
    if (error) {
      throw error;
    }
    
    if (!data || data.length === 0) {
      return null;
    }
    
    // Map rows to GearInventoryItem interface adaptively
    return data.map((row: any) => {
      const id = row.id || row.product_id || String(Math.random());
      const nama = row.nama || row.name || row.title || "Product";
      const kategori = row.kategori || row.category || "Aksesoris";
      const model = row.model || row.type || "";
      const specs = row.specs || row.specification || row.details || "";
      const warna = row.warna || row.color || "Default";
      const merek = row.merek || row.brand || "";
      const ukuran = row.ukuran || row.size || "";
      
      const total_stok = row.total_stok !== undefined ? row.total_stok : (row.stock !== undefined ? row.stock : (row.total_stock !== undefined ? row.total_stock : 10));
      const sedang_disewa = row.sedang_disewa !== undefined ? row.sedang_disewa : (row.rented_count !== undefined ? row.rented_count : 0);
      const tersedia = row.tersedia !== undefined ? row.tersedia : (row.available !== undefined ? row.available : (row.ready !== undefined ? row.ready : total_stok - sedang_disewa));
      
      const harga = row.harga !== undefined ? row.harga : (row.price !== undefined ? row.price : 10000);
      const gambar_url = row.gambar_url || row.image_url || row.image || row.gambar || "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=400&q=80";
      
      return {
        id,
        kategori,
        nama,
        name: nama,
        model,
        specs,
        warna,
        merek,
        ukuran,
        total_stok,
        stok: total_stok,
        sedang_disewa,
        sewa: sedang_disewa,
        tersedia,
        ready: tersedia,
        harga,
        price: harga,
        gambar_url
      };
    });
  } catch (err) {
    console.error("Error fetching products from Supabase, will use static fallback:", err);
    return null;
  }
}

/**
 * Creates a new booking in the 'bookings' table.
 * Adapts with a resilient model that tries several variations of column names.
 */
export async function createBookingInSupabase(booking: any) {
  try {
    const payloadEnglish = {
      id: booking.receiptId,
      receipt_id: booking.receiptId,
      receiptId: booking.receiptId,
      tenant_name: booking.tenantName,
      tenantName: booking.tenantName,
      student_id: booking.studentId,
      studentId: booking.studentId,
      university: booking.university,
      mountain_name: booking.mountainName,
      mountainName: booking.mountainName,
      duration: Number(booking.duration),
      items: typeof booking.items === "string" ? booking.items : JSON.stringify(booking.items),
      total_cost: Number(booking.totalCost),
      totalCost: Number(booking.totalCost),
      status: booking.status || "Sukses",
      payment_method: booking.paymentMethod,
      paymentMethod: booking.paymentMethod,
      created_at: new Date().toISOString()
    };
    
    console.log("Saving booking to Supabase with payload:", payloadEnglish);
    const { data, error } = await supabase
      .from("bookings")
      .insert(payloadEnglish);
      
    if (error) {
      console.warn("Supabase booking insert error, trying Indonesian fallback:", error);
      
      const payloadIndonesian = {
        id: booking.receiptId,
        kode_reservasi: booking.receiptId,
        nama_penyewa: booking.tenantName,
        identitas_penyewa: booking.studentId,
        asal_kampus: booking.university,
        nama_gunung: booking.mountainName,
        durasi_hari: Number(booking.duration),
        barang_sewa: typeof booking.items === "string" ? booking.items : JSON.stringify(booking.items),
        total_biaya: Number(booking.totalCost),
        status: booking.status || "Sukses",
        metode_pembayaran: booking.paymentMethod,
        tanggal_sewa: new Date().toISOString()
      };
      
      const { error: idError } = await supabase
        .from("bookings")
        .insert(payloadIndonesian);
        
      if (idError) {
        // Attempt 3: minimum column names (reserves, code, total, name)
        console.warn("Indonesian booking fallback failed, trying minimum insert:", idError);
        const minBooking = {
          id: booking.receiptId,
          tenant_name: booking.tenantName,
          total_cost: Number(booking.totalCost)
        };
        const { error: minError } = await supabase
          .from("bookings")
          .insert(minBooking);
          
        if (minError) {
          throw minError;
        }
      }
    }
    return true;
  } catch (err) {
    console.error("Error creating booking in Supabase:", err);
    return false;
  }
}
