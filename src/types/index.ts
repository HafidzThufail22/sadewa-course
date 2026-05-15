// Cetakan untuk tabel packages
export interface Package {
  id: number;
  created_at: string;
  name: string;
  price: number;
  description: string;
  duration: string;
  vehicle: string;
  is_popular: boolean;
}

// Cetakan untuk tabel user_roles
export interface UserRole {
  id: number;
  created_at: string;
  user_id: string; // UUID dari auth Supabase
  role: "super_admin" | "admin";
}
