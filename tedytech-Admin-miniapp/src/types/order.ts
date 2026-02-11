/**
 * Phone action type matching Convex schema
 */
export interface PhoneAction {
  _id: string;
  _creationTime: number;
  sessionId: string;
  phoneId: string;
  variantId?: string;
  actionType: "reserve" | "ask" | "view";
  createdAt: number;
  // Joined data (may be populated from products)
  phoneName?: string;
  phonePrice?: number;
}

/**
 * Exchange request type matching Convex schema
 */
export interface ExchangeRequest {
  _id: string;
  _creationTime: number;
  sessionId: string;
  desiredPhoneId: string;
  offeredModel: string;
  offeredStorageGb: number;
  offeredCondition: string;
  offeredNotes: string;
  status: "new" | "pending" | "completed" | "rejected";
  createdAt: number;
  // Joined data (may be populated from products)
  desiredPhoneName?: string;
  desiredPhonePrice?: number;
}

/**
 * Order status type
 */
export type OrderStatus = "new" | "pending" | "completed" | "rejected";

/**
 * Action type
 */
export type ActionType = "reserve" | "ask" | "view";
