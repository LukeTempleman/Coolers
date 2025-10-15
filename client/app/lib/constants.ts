import {
  Thermometer,
  Building,
  LucideIcon,
  Package,
  Zap,
  Snowflake,
  Box,
} from "lucide-react";


export const NAVBAR_HEIGHT = 52; // in pixels


import {
  Battery,
  MapPin,
  AlertTriangle,
  Clock,
  Activity,
  User,
  Shield,
  FileText,
  Bell,
  Settings,
  Layers,
  PieChart,
  BarChart,
} from "lucide-react";

export enum CoolerStatusEnum {
  Active = "Active",
  Maintenance = "Maintenance",
  Idle = "Idle",
  Decommissioned = "Decommissioned",
  Alert = "Alert",
}

export const CoolerStatusIcons: Record<CoolerStatusEnum, LucideIcon> = {
  Active: Activity,
  Maintenance: Settings,
  Idle: Clock,
  Decommissioned: AlertTriangle,
  Alert: Bell,
};

export enum EventTypeEnum {
  LocationUpdate = "LOCATION_UPDATE",
  GeofenceBreach = "GEOFENCE_BREACH",
  CoolerCreated = "COOLER_CREATED",
  CoolerUpdated = "COOLER_UPDATED",
  CoolerDeactivated = "COOLER_DEACTIVATED",
  UserLogin = "USER_LOGIN",
  UserCreated = "USER_CREATED",
  UserUpdated = "USER_UPDATED",
  NotificationSent = "NOTIFICATION_SENT",
  SystemEvent = "SYSTEM_EVENT",
  TemperatureAlert = "TEMPERATURE_ALERT",
  BatteryLow = "BATTERY_LOW",
  MaintenanceRequired = "MAINTENANCE_REQUIRED",
}

export const EventTypeIcons: Record<EventTypeEnum, LucideIcon> = {
  LOCATION_UPDATE: MapPin,
  GEOFENCE_BREACH: AlertTriangle,
  COOLER_CREATED: Layers,
  COOLER_UPDATED: Settings,
  COOLER_DEACTIVATED: AlertTriangle,
  USER_LOGIN: User,
  USER_CREATED: User,
  USER_UPDATED: User,
  NOTIFICATION_SENT: Bell,
  SYSTEM_EVENT: Settings,
  TEMPERATURE_ALERT: Thermometer,
  BATTERY_LOW: Battery,
  MAINTENANCE_REQUIRED: Settings,
};

export enum CoolerModelEnum {
  Standard = "Standard",
  Premium = "Premium",
  Ultra = "Ultra",
  Compact = "Compact",
}

export const CoolerModelIcons = {
  'Standard': Package,
  'Premium': Zap, 
  'Ultra': Snowflake,
  'Compact': Box
} as const;



// Then use this in your FiltersBar:

export enum UserRoleEnum {
  Admin = "admin",
  User = "user",
}

export const UserRoleIcons: Record<UserRoleEnum, LucideIcon> = {
  admin: Shield,
  user: User,
};

// Dashboard sections
export enum DashboardSectionEnum {
  Overview = "Overview",
  Coolers = "Coolers",
  Companies = "Companies",
  Users = "Users",
  Events = "Events",
  Notifications = "Notifications",
  Reports = "Reports",
  Settings = "Settings",
}

export const DashboardSectionIcons: Record<DashboardSectionEnum, LucideIcon> = {
  Overview: PieChart,
  Coolers: Thermometer,
  Companies: Building,
  Users: User,
  Events: Activity,
  Notifications: Bell,
  Reports: FileText,
  Settings: Settings,
};

// Statistics types for dashboard
export enum StatisticTypeEnum {
  TotalCoolers = "TotalCoolers",
  ActiveCoolers = "ActiveCoolers",
  AlertCoolers = "AlertCoolers",
  GeofenceBreaches = "GeofenceBreaches",
  TemperatureAlerts = "TemperatureAlerts",
  BatteryAlerts = "BatteryAlerts",
}

export const StatisticTypeIcons: Record<StatisticTypeEnum, LucideIcon> = {
  TotalCoolers: Layers,
  ActiveCoolers: Activity,
  AlertCoolers: AlertTriangle,
  GeofenceBreaches: MapPin,
  TemperatureAlerts: Thermometer,
  BatteryAlerts: Battery,
};

// Time periods for reports and statistics
export enum TimePeriodEnum {
  Today = "Today",
  Yesterday = "Yesterday",
  ThisWeek = "ThisWeek",
  LastWeek = "LastWeek",
  ThisMonth = "ThisMonth",
  LastMonth = "LastMonth",
  Custom = "Custom",
}

// Chart types
export enum ChartTypeEnum {
  Line = "Line",
  Bar = "Bar",
  Pie = "Pie",
}

export const ChartTypeIcons: Record<ChartTypeEnum, LucideIcon> = {
  Line: Activity,
  Bar: BarChart,
  Pie: PieChart,
};

// App constants
export const SIDEBAR_WIDTH = 250; // in pixels
export const MAP_DEFAULT_ZOOM = 13;
export const MAP_DEFAULT_CENTER = { lat: 37.7749, lng: -122.4194 }; // San Francisco
export const TEMPERATURE_WARNING_THRESHOLD = 8; // degrees Celsius
export const TEMPERATURE_ALERT_THRESHOLD = 10; // degrees Celsius
export const BATTERY_WARNING_THRESHOLD = 30; // percent
export const BATTERY_ALERT_THRESHOLD = 15; // percent

// Test users for development
export const testUsers = {
  admin: {
    username: "Admin User",
    userId: "us-east-2:12345678-90ab-cdef-1234-567890abcdef",
    signInDetails: {
      loginId: "admin@example.com",
      authFlowType: "USER_SRP_AUTH",
    },
    role: "admin",
  },
  user: {
    username: "Company Manager",
    userId: "us-east-2:76543210-90ab-cdef-1234-567890abcdef",
    signInDetails: {
      loginId: "manager@company.com",
      authFlowType: "USER_SRP_AUTH",
    },
    role: "user",
  },
};
