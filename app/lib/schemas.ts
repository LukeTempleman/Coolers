import * as z from "zod";
import { CoolerModelEnum, CoolerStatusEnum } from "./constants";
// MongoDB ObjectId as string
const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");

// GeoJSON Point with city, province, country
const geoPointSchema = z.object({
  type: z.literal("Point"),
  coordinates: z.tuple([z.number(), z.number()]), // [lng, lat]
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required"),
  country: z.string().min(1, "Country is required"),
});

// Cooler location history entry
const locationHistorySchema = z.object({
  coordinates: z.tuple([z.number(), z.number()]),
  timestamp: z.string().datetime().optional(),
});

// Customer contract schema
const customerContractSchema = z.object({
  contractNumber: z.string(),
  customerName: z.string(),
  customerEmail: z.string().email(),
  customerPhone: z.string(),
  contractStartDate: z.string().datetime(),
  contractEndDate: z.string().datetime(),
  monthlyFee: z.number(),
  depositAmount: z.number(),
  contractStatus: z.enum(['Active', 'Pending', 'Expired', 'Cancelled']),
  serviceLevel: z.enum(['Basic', 'Standard', 'Premium']),
  billingAddress: z.object({
    street: z.string(),
    city: z.string(),
    province: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }),
  paymentMethod: z.enum(['Credit Card', 'Bank Transfer', 'Cash', 'Debit Order']),
  lastPaymentDate: z.string().datetime().optional(),
  nextPaymentDate: z.string().datetime().optional(),
});

// Cooler
export const coolerSchema = z.object({
  _id: objectId.optional(),
  name: z.string(),
  company: objectId,
  location: geoPointSchema,
  photoUrls: z.array(z.string()).optional(),
  coolerModel: z.nativeEnum(CoolerModelEnum),
  humidity: z.number().min(0).max(100).optional(),
  lastServiceDate: z.string().datetime().optional(),
  temperature: z.number().min(-50).max(50).optional(),
  status: z.nativeEnum(CoolerStatusEnum),
  radius: z.number().default(200),
  isActive: z.boolean().default(true),
  lastNotification: z.string().datetime().optional(),
  locationHistory: z.array(locationHistorySchema).optional(),
  customerContract: customerContractSchema.optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});
export type Cooler = z.infer<typeof coolerSchema>;

// GpsData
export const gpsDataSchema = z.object({
  _id: objectId.optional(),
  deviceId: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  timestamp: z.string().datetime().optional(),
  raw: z.string().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});
export type GpsData = z.infer<typeof gpsDataSchema>;

// EventLog
export const eventLogSchema = z.object({
  _id: objectId.optional(),
  eventType: z.enum([
    "LOCATION_UPDATE",
    "GEOFENCE_BREACH",
    "COOLER_CREATED",
    "COOLER_UPDATED",
    "COOLER_DEACTIVATED",
    "USER_LOGIN",
    "USER_CREATED",
    "USER_UPDATED",
    "NOTIFICATION_SENT",
    "SYSTEM_EVENT",
  ]),
  company: objectId,
  cooler: objectId.optional(),
  user: objectId.optional(),
  description: z.string(),
  metadata: z.unknown().optional(),
  timestamp: z.string().datetime().optional(),
});
export type EventLog = z.infer<typeof eventLogSchema>;

// CoolerUsage
export const coolerUsageSchema = z.object({
  _id: objectId.optional(),
  cooler: objectId,
  company: objectId,
  date: z.string().datetime(),
  totalDistance: z.number().default(0),
  movementHours: z.number().default(0),
  powerCutCount: z.number().default(0),
  powerCutDuration: z.number().default(0),
  breachCount: z.number().default(0),
  utilizationRate: z.number().min(0).max(100).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});
export type CoolerUsage = z.infer<typeof coolerUsageSchema>;

// Company
export const companySchema = z.object({
  _id: objectId.optional(),
  name: z.string(),
  contactEmail: z.string().email(),
  createdAt: z.string().datetime().optional(),
});
export type Company = z.infer<typeof companySchema>;

// GeofenceBreach
export const geofenceBreachSchema = z.object({
  _id: objectId.optional(),
  cooler: objectId,
  company: objectId,
  breachTime: z.string().datetime(),
  location: geoPointSchema,
  distance: z.number(),
  resolved: z.boolean().default(false),
  resolvedTime: z.string().datetime().optional(),
  notificationSent: z.boolean().default(false),
  duration: z.number().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});
export type GeofenceBreach = z.infer<typeof geofenceBreachSchema>;

// User
export const userSchema = z.object({
  _id: objectId.optional(),
  name: z.string(), 
  email: z.string().email(),
  password: z.string(),
  company: objectId, 
  role: z.enum(["admin", "user"]).default("user"),
  createdAt: z.string().datetime().optional(),
});
export type User = z.infer<typeof userSchema>;

export const settingsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
});
export type SettingsFormData = z.infer<typeof settingsSchema>;