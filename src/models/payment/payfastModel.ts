// PayFast Model - Data Transfer Objects only
// This file contains simple data models without business logic

export interface PaymentRequest {
  amount: number; // Amount in cents
  transactionId: string;
  customerEmail: string;
  customerName?: string;
  customerPhone?: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  success: boolean;
  paymentUrl?: string;
  transactionId: string;
  paymentId?: string;  // PayFast payment ID for reference
  message?: string;
  formData?: string;
}

export interface PaymentStatus {
  transactionId: string;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  customerEmail: string;
  timestamp: string;
}

// PayFast Payment Data - matches actual PayFast API
export interface PayFastPaymentData {
  merchant_id: string;
  merchant_key: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  name_first: string;
  name_last: string;
  email_address: string;
  cell_number?: string;
  m_payment_id: string;
  amount: string;
  item_name: string;
  item_description?: string;
  custom_str1?: string;
  custom_str2?: string;
  custom_str3?: string;
  custom_str4?: string;
  custom_str5?: string;
  custom_int1?: string;
  custom_int2?: string;
  custom_int3?: string;
  custom_int4?: string;
  custom_int5?: string;
  email_confirmation?: string;
  confirmation_address?: string;
  signature?: string;
}

// PayFast ITN Response - matches actual PayFast ITN payload
export interface PayFastITNResponse {
  m_payment_id: string;
  pf_payment_id: string;
  payment_status: string;
  item_name: string;
  item_description?: string;
  amount_gross: number;
  amount_fee: number;
  amount_net: number;
  custom_str1?: string;
  custom_str2?: string;
  custom_str3?: string;
  custom_str4?: string;
  custom_str5?: string;
  custom_int1?: string;
  custom_int2?: string;
  custom_int3?: string;
  custom_int4?: string;
  custom_int5?: string;
  name_first?: string;
  name_last?: string;
  email_address?: string;
  merchant_id: string;
  signature: string;
}