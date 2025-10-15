import { LucideIcon } from "lucide-react";
import { MotionProps as OriginalMotionProps } from "framer-motion";
import { Cooler, Company, User, GpsData, EventLog, CoolerUsage, Geofence } from "../lib/schemas";

declare module "framer-motion" {
  interface MotionProps extends OriginalMotionProps {
    className?: string;
  }
}

declare global {
  type ObjectId = string;

  type userType = "admin" | "user";

  // Add message types
  interface MessageSender {
    id: ObjectId;
    name: string;
    email?: string;
    role?: userType;
  }

  interface Message {
    id: ObjectId;
    sender: MessageSender;
    content: string;
    timestamp: string;
    read: boolean;
    threadId?: string;
  }

  interface MessageThread {
    id: ObjectId;
    threadId: string;
    sender: MessageSender;
    thread: ThreadMessage[];
  }

  interface ThreadMessage {
    content: string;
    timestamp: string;
    isFromMe: boolean;
  }

  interface NotificationItem {
    id: ObjectId;
    title: string;
    message: string;
    type: 'COOLER_ALERT' | 'NEW_MESSAGE' | 'SYSTEM' | 'INFO';
    read: boolean;
    priority: 'low' | 'medium' | 'high';
    timestamp: string;
    coolerId?: ObjectId;
    metadata?: Record<string, unknown>;
    icon?: LucideIcon;
  }

  // Message component props
  interface MessagesListProps {
    messages: Message[];
    selectedId?: ObjectId;
    onSelectMessage: (message: Message) => void;
    isLoading?: boolean;
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
  }

  interface MessageThreadViewProps {
    thread: MessageThread;
    onSendMessage: (content: string) => Promise<void>;
    isLoading?: boolean;
  }

  interface MessageComposeProps {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    isLoading?: boolean;
  }

  interface NotificationItemProps {
    notification: NotificationItem;
    onClick: (notification: NotificationItem) => void;
  }

  interface NotificationsListProps {
    notifications: NotificationItem[];
    filter?: 'all' | 'unread' | 'read';
    onFilterChange?: (filter: 'all' | 'unread' | 'read') => void;
    onNotificationClick: (notification: NotificationItem) => void;
    isLoading?: boolean;
  }

  // Existing interfaces
  interface SidebarLinkProps {
    href: string;
    icon: LucideIcon;
    label: string;
  }
    interface CardProps {
    cooler: Cooler;
    // isFavorite: boolean;
    // onFavoriteToggle: () => void;
    // showFavoriteButton?: boolean;
    coolerLink?: string;
  }
    interface ImagePreviewsProps {
    images: string[];
  }
    interface CoolerDetailsProps {
    coolerId: string;
  }

  interface CoolerOverviewProps {
    coolerId: string;
  }

  interface CoolerLocationProps {
    coolerId: number;
  }
  

  interface CardCompactProps {
    cooler: Cooler;
    // isFavorite: boolean;
    // onFavoriteToggle: () => void;
    // showFavoriteButton?: boolean;
    coolerLink?: string;
  }

  interface CoolerDetailsProps {
    cooler: Cooler;
    company: Company;
    usage?: CoolerUsage[];
    geofenceBreaches?: GeofenceBreach[];
    eventLogs?: EventLog[];
    gpsData?: GpsData[];
  }

  interface CompanyCardProps {
    company: Company;
    onViewDetails: (id: ObjectId) => void;
  }

  interface AppSidebarProps {
    userType: "admin" | "user";
  }
  interface UserCardProps {
    user: User;
    onEdit: (id: ObjectId) => void;
    onDelete: (id: ObjectId) => void;
  }

  interface GpsDataTableProps {
    gpsData: GpsData[];
    coolerId: ObjectId;
  }

  interface GeofenceBreachTableProps {
    breaches: GeofenceBreach[];
    coolerId: ObjectId;
  }

  interface EventLogTableProps {
    logs: EventLog[];
    coolerId: ObjectId;
  }

  interface SettingsFormProps {
    initialData: SettingsFormData;
    onSubmit: (data: SettingsFormData) => Promise<void>;
    userType: "admin" | "user";
  }
}

export {};
