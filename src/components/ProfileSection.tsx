import React, { useState, useRef } from "react";
import { UserProfile } from "../types";
import { User, School, CreditCard, Upload, CheckCircle, AlertCircle, Trash2, ShieldCheck } from "lucide-react";

interface ProfileSectionProps {
  profile: UserProfile;
  onChangeProfile: (profile: UserProfile) => void;
}

export default function ProfileSection({ profile, onChangeProfile }: ProfileSectionProps) {
  const [dragActive, setDragActive] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationFeedback, setVerificationFeedback] = useState<{
    status: "success" | "error" | null;
    message: string | null;
  }>({ status: null, message: null });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChangeProfile({
      ...profile,
      [name]: value,
      isVerified: !!(value && profile.name && (profile.ktmUrl || profile.ktpUrl || profile.studentId))
    });
  };

  const handleFile = async (file: File) => {
    setIsVerifying(true);
    setVerificationFeedback({ status: null, message: null });

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
        const dataUrl = `data:${mimeType};base64,${base64}`;
        const updatedProfile = {
          ...profile,
          name: data.name || profile.name,
          studentId: data.idNumber || profile.studentId,
          identityType: (data.type as "KTP" | "KTM" | "SIM") || profile.identityType,
          ktmUrl: dataUrl,
          ktpUrl: data.type === "KTP" ? dataUrl : null,
          isVerified: true
        };
        onChangeProfile(updatedProfile);
        setVerificationFeedback({
          status: "success",
          message: data.message
        });
      } else {
        onChangeProfile({
          ...profile,
          ktmUrl: null,
          isVerified: false
        });
        setVerificationFeedback({
          status: "error",
          message: data.message
        });
      }
    } catch (err: any) {
      console.error("Verification error:", err);
      onChangeProfile({
        ...profile,
        ktmUrl: null,
        isVerified: false
      });
      setVerificationFeedback({
        status: "error",
        message: "Waduh Sam/Mbak, terjadi kesalahan koneksi saat memproses dokumen dengan AI. Silakan coba unggah ulang foto dokumen Anda yang jelas!"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    onChangeProfile({
      ...profile,
      ktmUrl: null,
      isVerified: false
    });
    setVerificationFeedback({ status: null, message: null });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Input Form Column */}
      <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-emerald-500/20 text-emerald-300 rounded-lg border border-emerald-500/30">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-black text-white">Form Verifikasi Mahasiswa</h2>
              <p className="text-xs text-slate-400">Isi data diri untuk jaminan sewa menggunakan KTM aktif</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider font-mono">Nama Lengkap (Sesuai KTM/KTP)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleTextChange}
                  placeholder="Contoh: Muhammad Nurul Iman"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-950/40 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all text-slate-100 placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider font-mono">Asal Kampus Malang</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <School className="w-4 h-4" />
                  </span>
                  <select
                    name="university"
                    value={profile.university}
                    onChange={handleTextChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-950/80 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all text-slate-100 appearance-none"
                  >
                    <option value="" className="bg-stone-950 text-white">Pilih Kampus</option>
                    <option value="Universitas Muhammadiyah Malang (UMM)" className="bg-stone-950 text-white">UMM (Muhammadiyah)</option>
                    <option value="Universitas Brawijaya (UB)" className="bg-stone-950 text-white">UB (Brawijaya)</option>
                    <option value="Universitas Negeri Malang (UM)" className="bg-stone-950 text-white">UM (Negeri Malang)</option>
                    <option value="Politeknik Negeri Malang (Polinema)" className="bg-stone-950 text-white">Polinema</option>
                    <option value="Universitas Islam Malang (Unisma)" className="bg-stone-950 text-white">Unisma</option>
                    <option value="Lainnya (Kampus Malang)" className="bg-stone-950 text-white">Lainnya (Malang)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider font-mono">NIM / Nomor Identitas</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <CreditCard className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    name="studentId"
                    value={profile.studentId}
                    onChange={handleTextChange}
                    placeholder="Contoh: 202110370311001"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-950/40 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all text-slate-100 placeholder:text-slate-600"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider font-mono">Alamat Kos / Rumah di Malang</label>
              <textarea
                name="address"
                value={profile.address || ""}
                onChange={(e) => {
                  onChangeProfile({
                    ...profile,
                    address: e.target.value,
                    isVerified: !!(e.target.value && profile.name && (profile.ktmUrl || profile.studentId))
                  });
                }}
                placeholder="Contoh: Jl. Sigura-Gura No. 4, Lowokwaru, Malang"
                className="w-full px-4 py-2.5 bg-stone-950/40 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-all text-slate-100 placeholder:text-slate-600 resize-none font-sans"
                rows={2}
              />
            </div>
          </div>

          {/* Upload Section */}
          <div className="mt-6">
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider font-mono">Unggah Foto KTM / KTP Asli</label>
            
            {isVerifying ? (
              <div className="border-2 border-emerald-500/50 bg-emerald-500/10 rounded-2xl p-8 text-center flex flex-col items-center justify-center space-y-3 relative overflow-hidden h-[162px]">
                {/* Laser Scanning Bar */}
                <div className="absolute left-0 right-0 h-0.5 bg-emerald-400 opacity-80 animate-bounce top-0"></div>
                <div className="w-8 h-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
                <div>
                  <p className="text-xs font-bold text-emerald-400 animate-pulse font-mono">MEMPROSES ANALISIS AI...</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-sans">Memvalidasi dokumen identitas KTP/KTM/SIM...</p>
                </div>
              </div>
            ) : !profile.ktmUrl ? (
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  dragActive
                    ? "border-emerald-500 bg-emerald-500/10"
                    : "border-white/10 bg-stone-950/20 hover:bg-stone-950/40 hover:border-white/20"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
                <Upload className="w-8 h-8 text-slate-500 mx-auto mb-3 animate-pulse" />
                <p className="text-sm font-medium text-slate-200">Tarik & lepas foto di sini, atau klik untuk memilih</p>
                <p className="text-[11px] text-slate-500 mt-1 font-mono">Format JPG, PNG. Pastikan data terbaca dengan jelas.</p>
              </div>
            ) : (
              <div className="relative bg-stone-950/40 rounded-2xl border border-white/10 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-12 rounded-lg overflow-hidden bg-stone-900 border border-white/10">
                    <img src={profile.ktmUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-200">Foto_Jaminan_Sewa.jpg</p>
                    <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium mt-0.5">
                      <CheckCircle className="w-3 h-3" /> Berhasil Diunggah
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Verification Status Alert */}
        <div className={`mt-6 p-4 rounded-xl border transition-all duration-300 ${
          verificationFeedback.status === "success" || (profile.isVerified && !verificationFeedback.status)
            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-200" 
            : verificationFeedback.status === "error"
            ? "bg-rose-500/10 border-rose-500/20 text-rose-200"
            : "bg-amber-500/10 border-amber-500/20 text-amber-200"
        }`}>
          <div className="flex gap-3">
            {verificationFeedback.status === "success" || (profile.isVerified && !verificationFeedback.status) ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : verificationFeedback.status === "error" ? (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider font-mono">
                {verificationFeedback.status === "success" || (profile.isVerified && !verificationFeedback.status)
                  ? "STATUS: VERIFIKASI BERHASIL" 
                  : verificationFeedback.status === "error"
                  ? "STATUS: VALIDASI GAGAL"
                  : "STATUS: BELUM LENGKAP"}
              </h4>
              <p className="text-xs leading-relaxed mt-1 opacity-95 whitespace-pre-line">
                {verificationFeedback.message 
                  ? verificationFeedback.message
                  : profile.isVerified 
                  ? "VALIDASI BERHASIL: Dokumen berhasil diverifikasi. Kamu bisa melanjutkan ke proses checkout, Sam/Mbak!" 
                  : "Silakan lengkapi Nama, Kampus, dan Unggah KTM/KTP/SIM untuk mengaktifkan status verifikasi jaminan sewa."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Digital ID Mockup Card Column */}
      <div className="lg:col-span-5 flex flex-col justify-center">
        <div className="relative bg-gradient-to-br from-stone-950 via-[#0d2a1c] to-[#054024] rounded-3xl p-6 text-white shadow-2xl overflow-hidden aspect-[1.586/1] border border-white/25 max-w-sm mx-auto w-full">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-10 -mt-10 blur-xl"></div>
          <div className="absolute -bottom-20 -left-10 w-48 h-48 bg-emerald-500/20 rounded-full blur-2xl"></div>

          <div className="relative h-full flex flex-col justify-between">
            {/* ID Header */}
             <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-black text-emerald-400 font-mono">
                  KARTU JAMINAN {profile.identityType || "KTM"} DIGITAL
                </span>
                <h3 className="font-display font-black text-xl tracking-wide text-white">ELEVA NGALAM</h3>
              </div>
              <ShieldCheck className={`w-8 h-8 ${profile.isVerified ? "text-emerald-400" : "text-slate-600"}`} />
            </div>

            {/* ID Body */}
            <div className="my-4 flex gap-4 items-center">
              <div className="w-16 h-16 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center overflow-hidden shrink-0">
                {profile.ktmUrl ? (
                  <img src={profile.ktmUrl} alt="KTM" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-white/20" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black truncate">{profile.name || "NAMA MAHASISWA"}</p>
                <p className="text-xs font-semibold text-emerald-300 truncate mt-0.5">{profile.university || "KAMPUS MALANG"}</p>
                <p className="text-[10px] font-mono text-slate-400 tracking-wider mt-1">{profile.studentId || "NIM/NIDN"}</p>
                {profile.address && (
                  <p className="text-[9px] text-slate-400 truncate mt-0.5" title={profile.address}>Alamat: {profile.address}</p>
                )}
              </div>
            </div>

            {/* ID Footer */}
            <div className="flex justify-between items-end border-t border-white/10 pt-3">
              <div>
                <p className="text-[9px] text-slate-500 uppercase font-mono">Garansi Sewa</p>
                <p className="text-[10px] font-mono tracking-wider font-bold text-emerald-300">
                  {profile.isVerified ? `${profile.identityType || "KTM"} DISETUJUI` : "BELUM AKTIF"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-slate-500 uppercase font-mono">Verified Member</p>
                <p className="text-[10px] font-mono font-bold text-emerald-400">
                  {profile.isVerified ? "YES" : "NO"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-center text-slate-400 mt-4 max-w-xs mx-auto leading-normal">
          *Eleva menjamin kerahasiaan identitasmu. Data KTM/KTP hanya digunakan untuk validasi jaminan sewa saat serah terima alat.
        </p>
      </div>
    </div>
  );
}
