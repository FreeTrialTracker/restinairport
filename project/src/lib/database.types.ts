export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      airport_facilities: {
        Row: {
          id: string
          airport: string
          airport_code: string
          facility: string
          location: string
          type: string
          immigration: string
          transit_safe: boolean
          zone: string
          connectivity: string
          eligibility: string
          cards: string | null
          price: string
          notes: string | null
          search_text: string | null
          capacity: string | null
          pricing_details: string | null
          access_details: string | null
          amenities: string | null
          summary: string | null
          full_description: string | null
          url: string | null
          website_url: string | null
          slug: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          airport: string
          airport_code: string
          facility: string
          location: string
          type: string
          immigration: string
          transit_safe?: boolean
          zone: string
          connectivity: string
          eligibility: string
          cards?: string | null
          price: string
          notes?: string | null
          capacity?: string | null
          pricing_details?: string | null
          access_details?: string | null
          amenities?: string | null
          summary?: string | null
          full_description?: string | null
          url?: string | null
          website_url?: string | null
          slug?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          airport?: string
          airport_code?: string
          facility?: string
          location?: string
          type?: string
          immigration?: string
          transit_safe?: boolean
          zone?: string
          connectivity?: string
          eligibility?: string
          cards?: string | null
          price?: string
          notes?: string | null
          capacity?: string | null
          pricing_details?: string | null
          access_details?: string | null
          amenities?: string | null
          summary?: string | null
          full_description?: string | null
          url?: string | null
          website_url?: string | null
          slug?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type AirportFacility = Database['public']['Tables']['airport_facilities']['Row'];
