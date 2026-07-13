export interface Mountain {
  id: string;
  name: string;
  height: number; // in meters (MDPL)
  difficulty: "Trek Ringan" | "Trek Sedang" | "Trek Dingin/Tinggi";
  description: string;
  coordinates: string;
  location: string;
  status: string;
  image: string;
  recommendedGearIds: string[];
}

export interface GearItem {
  id: string;
  name: string;
  pricePerDay: number; // in IDR
  category: string;
  description: string;
  iconName?: string;
  isSafetyCritical?: boolean;
  imageUrl?: string;
  availableColors?: string[];
  availableSizes?: (number | string)[];
  availableModels?: string[];
}

export interface RentalPackage {
  id: string;
  name: string;
  description: string;
  pricePerDay: number;
  gearIds: string[];
  type: "ringan" | "sedang" | "tinggi";
  badge: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface UserProfile {
  name: string;
  university: string;
  studentId: string;
  address?: string;
  identityType?: "KTP" | "KTM" | "SIM";
  ktmUrl: string | null;
  ktpUrl: string | null;
  isVerified: boolean;
}
