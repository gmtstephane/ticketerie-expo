/**
 * Generated by orval v6.25.0 🍺
 * Do not edit manually.
 * Ticketerie API
 * OpenAPI spec version: 1.0.0
 */
import type { EventType } from './eventType';

export interface EventDescription {
  championship: string;
  date: string;
  icon: string;
  id: string;
  latitude: number;
  location: string;
  longitude: number;
  min_price: number;
  name: string;
  sport: string;
  type: EventType;
}
