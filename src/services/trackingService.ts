import { CustomerShipmentView, LookupResponse } from '../types.ts';
import { ADMIN_SHIPMENT_DATABASE, filterForCustomer } from '../data/shipments.ts';
import { isSupabaseConfigured } from '../lib/supabase.ts';
import { lookupShipmentFromSupabase } from './supabaseShipmentService.ts';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  normalizedCode?: string;
}

/**
 * Validates that tracking code is:
 * - Exactly 11 alphanumeric characters
 * - Contains both letters and numbers
 * - No spaces or special characters
 */
export function validateTrackingCode(rawCode: string): ValidationResult {
  const trimmed = rawCode.trim();

  if (!trimmed) {
    return {
      isValid: false,
      error: 'Please enter a valid 11-character alphanumeric tracking code.',
    };
  }

  // Check character count
  if (trimmed.length !== 11) {
    return {
      isValid: false,
      error: 'Please enter a valid 11-character alphanumeric tracking code.',
    };
  }

  // Check only alphanumeric
  const isAlphaNumeric = /^[a-zA-Z0-9]{11}$/.test(trimmed);
  if (!isAlphaNumeric) {
    return {
      isValid: false,
      error: 'Please enter a valid 11-character alphanumeric tracking code.',
    };
  }

  // Check contains both letters and numbers
  const hasLetter = /[a-zA-Z]/.test(trimmed);
  const hasNumber = /[0-9]/.test(trimmed);

  if (!hasLetter || !hasNumber) {
    return {
      isValid: false,
      error: 'Please enter a valid 11-character alphanumeric tracking code.',
    };
  }

  return {
    isValid: true,
    normalizedCode: trimmed.toUpperCase(),
  };
}

/**
 * Perform exact database lookup for the tracking code.
 * Searches via backend API first, falling back to exact client dataset if offline.
 * Strict exact matching only: no partial, approximate, or generated records.
 */
export async function lookupShipment(rawCode: string): Promise<LookupResponse> {
  const validation = validateTrackingCode(rawCode);
  if (!validation.isValid || !validation.normalizedCode) {
    return {
      success: false,
      error: 'INVALID_FORMAT',
      message: 'Invalid Tracking Code Format',
      details: validation.error || 'Please enter a valid 11-character alphanumeric tracking code.',
    };
  }

  const code = validation.normalizedCode;

  // If Supabase credentials are provided in environment, prioritize direct Supabase query
  if (isSupabaseConfigured()) {
    try {
      const supabaseResult = await lookupShipmentFromSupabase(code);
      if (supabaseResult) {
        return supabaseResult;
      }
    } catch (supabaseErr) {
      console.warn('[TrackingService] Supabase query failed, falling back:', supabaseErr);
    }
  }

  try {
    const response = await fetch(`/api/track/${encodeURIComponent(code)}`);
    const contentType = response.headers.get('content-type') || '';
    if (response.ok && contentType.includes('application/json')) {
      const data = await response.json();
      return {
        success: true,
        data: data.data,
      };
    }

    if (response.status === 404) {
      return {
        success: false,
        error: 'NOT_FOUND',
        message: 'Tracking Code Not Found',
        details: isSupabaseConfigured()
          ? "We couldn't find a shipment associated with this tracking code in the database. Please check the code and try again."
          : "We couldn't find this tracking code. If this shipment was created in Supabase, make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are configured.",
      };
    }

    if (!response.ok && contentType.includes('application/json')) {
      const errData = await response.json().catch(() => null);
      if (errData?.details || errData?.message) {
        return {
          success: false,
          error: errData.error || 'SERVER_ERROR',
          message: errData.message || 'System Error',
          details: errData.details,
        };
      }
    }
  } catch (_err) {
    // Continue to client fallback
  }

  // Fallback: perform exact lookup against the local demo database
  const exactRecord = ADMIN_SHIPMENT_DATABASE.find(
    (r) => r.trackingCode.toUpperCase() === code
  );

  if (exactRecord) {
    return {
      success: true,
      data: filterForCustomer(exactRecord),
    };
  }

  return {
    success: false,
    error: 'NOT_FOUND',
    message: 'Tracking Code Not Found',
    details: isSupabaseConfigured()
      ? "We couldn't find a shipment associated with this tracking code. Please verify the code and try again."
      : "Tracking code not found in the demo dataset. If you created this shipment in Supabase, please ensure your Supabase database credentials (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) are configured in your environment.",
  };
}
