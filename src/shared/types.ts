import z from "zod";

// Service types
export const ServiceTypes = {
  REPAIR: 'repair',
  MAINTENANCE: 'maintenance', 
  RENT: 'rent'
} as const;

export const ACTypes = {
  WINDOW: 'window',
  SPLIT: 'split',
  CENTRAL: 'central'
} as const;

export const BookingStatus = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

// Zod schemas for API validation
export const BookingSchema = z.object({
  id: z.number().optional(),
  customer_name: z.string().min(1, "Name is required"),
  customer_phone: z.string().min(10, "Valid phone number is required"),
  customer_email: z.string().email().optional().or(z.literal("")),
  service_type: z.enum([ServiceTypes.REPAIR, ServiceTypes.MAINTENANCE, ServiceTypes.RENT]),
  ac_type: z.enum([ACTypes.WINDOW, ACTypes.SPLIT, ACTypes.CENTRAL]),
  address: z.string().min(5, "Complete address is required"),
  preferred_date: z.string().min(1, "Date is required"),
  preferred_time: z.string().min(1, "Time is required"),
  status: z.enum([BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.COMPLETED, BookingStatus.CANCELLED]).optional(),
  notes: z.string().optional(),
  user_id: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
});

export const CreateBookingSchema = BookingSchema.omit({
  id: true,
  status: true,
  user_id: true,
  created_at: true,
  updated_at: true
});

export const UpdateBookingStatusSchema = z.object({
  id: z.number(),
  status: z.enum([BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.COMPLETED, BookingStatus.CANCELLED])
});

export const ChatMessageSchema = z.object({
  message: z.string().min(1, "Message is required")
});

export type BookingType = z.infer<typeof BookingSchema>;
export type CreateBookingType = z.infer<typeof CreateBookingSchema>;
export type UpdateBookingStatusType = z.infer<typeof UpdateBookingStatusSchema>;
export type ChatMessageType = z.infer<typeof ChatMessageSchema>;

// Helper types
export type ServiceTypeKeys = keyof typeof ServiceTypes;
export type ACTypeKeys = keyof typeof ACTypes;
export type BookingStatusKeys = keyof typeof BookingStatus;
