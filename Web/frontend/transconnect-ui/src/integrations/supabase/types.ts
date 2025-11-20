export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      agencies: {
        Row: {
          address: string | null
          admin_id: string | null
          created_at: string | null
          email: string | null
          id: string
          license_number: string | null
          name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          admin_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          license_number?: string | null
          name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          admin_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          license_number?: string | null
          name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          booking_date: string | null
          created_at: string | null
          id: string
          payment_status: string | null
          seats_booked: number | null
          status: string | null
          total_amount: number | null
          trip_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          booking_date?: string | null
          created_at?: string | null
          id?: string
          payment_status?: string | null
          seats_booked?: number | null
          status?: string | null
          total_amount?: number | null
          trip_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          booking_date?: string | null
          created_at?: string | null
          id?: string
          payment_status?: string | null
          seats_booked?: number | null
          status?: string | null
          total_amount?: number | null
          trip_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          agency_id: string | null
          created_at: string | null
          id: string
          license_expiry: string | null
          license_number: string
          phone: string | null
          rating: number | null
          status: string | null
          total_trips: number | null
          updated_at: string | null
          user_id: string | null
          vehicle_type: string | null
        }
        Insert: {
          agency_id?: string | null
          created_at?: string | null
          id?: string
          license_expiry?: string | null
          license_number: string
          phone?: string | null
          rating?: number | null
          status?: string | null
          total_trips?: number | null
          updated_at?: string | null
          user_id?: string | null
          vehicle_type?: string | null
        }
        Update: {
          agency_id?: string | null
          created_at?: string | null
          id?: string
          license_expiry?: string | null
          license_number?: string
          phone?: string | null
          rating?: number | null
          status?: string | null
          total_trips?: number | null
          updated_at?: string | null
          user_id?: string | null
          vehicle_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drivers_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          comment: string | null
          created_at: string | null
          driver_id: string | null
          id: string
          rating: number | null
          trip_id: string | null
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          driver_id?: string | null
          id?: string
          rating?: number | null
          trip_id?: string | null
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          driver_id?: string | null
          id?: string
          rating?: number | null
          trip_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      movements: {
        Row: {
          created_at: string | null
          current_location: Json | null
          driver_id: string
          id: string
          speed: number | null
          status: string | null
          timestamp: string | null
          trip_id: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string | null
          current_location?: Json | null
          driver_id: string
          id?: string
          speed?: number | null
          status?: string | null
          timestamp?: string | null
          trip_id: string
          vehicle_id: string
        }
        Update: {
          created_at?: string | null
          current_location?: Json | null
          driver_id?: string
          id?: string
          speed?: number | null
          status?: string | null
          timestamp?: string | null
          trip_id?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "movements_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movements_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movements_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      routes: {
        Row: {
          created_at: string | null
          distance_km: number | null
          end_location: string
          estimated_duration: number | null
          fare_amount: number | null
          id: string
          is_active: boolean | null
          name: string
          start_location: string
          stops: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          distance_km?: number | null
          end_location: string
          estimated_duration?: number | null
          fare_amount?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          start_location: string
          stops?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          distance_km?: number | null
          end_location?: string
          estimated_duration?: number | null
          fare_amount?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          start_location?: string
          stops?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      staff: {
        Row: {
          agency_id: string | null
          created_at: string | null
          department: string | null
          hire_date: string | null
          id: string
          position: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          agency_id?: string | null
          created_at?: string | null
          department?: string | null
          hire_date?: string | null
          id?: string
          position?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          agency_id?: string | null
          created_at?: string | null
          department?: string | null
          hire_date?: string | null
          id?: string
          position?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          arrival_time: string | null
          available_seats: number | null
          created_at: string | null
          departure_time: string
          driver_id: string | null
          id: string
          route_id: string | null
          status: string | null
          updated_at: string | null
          vehicle_id: string | null
        }
        Insert: {
          arrival_time?: string | null
          available_seats?: number | null
          created_at?: string | null
          departure_time: string
          driver_id?: string | null
          id?: string
          route_id?: string | null
          status?: string | null
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Update: {
          arrival_time?: string | null
          available_seats?: number | null
          created_at?: string | null
          departure_time?: string
          driver_id?: string | null
          id?: string
          route_id?: string | null
          status?: string | null
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trips_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          agency_id: string | null
          capacity: number | null
          created_at: string | null
          driver_id: string | null
          id: string
          model: string | null
          plate_number: string
          status: string | null
          updated_at: string | null
          vehicle_type: string
        }
        Insert: {
          agency_id?: string | null
          capacity?: number | null
          created_at?: string | null
          driver_id?: string | null
          id?: string
          model?: string | null
          plate_number: string
          status?: string | null
          updated_at?: string | null
          vehicle_type: string
        }
        Update: {
          agency_id?: string | null
          capacity?: number | null
          created_at?: string | null
          driver_id?: string | null
          id?: string
          model?: string | null
          plate_number?: string
          status?: string | null
          updated_at?: string | null
          vehicle_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "driver" | "user" | "agency_admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "driver", "user", "agency_admin"],
    },
  },
} as const
