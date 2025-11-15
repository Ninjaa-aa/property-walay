/**
 * Format Pakistani phone numbers
 */

export function formatPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return "N/A";

  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "");

  // Pakistani phone number formats:
  // 03XX-XXXXXXX (11 digits starting with 0)
  // +92-3XX-XXXXXXX (12 digits starting with +92)
  // 92-3XX-XXXXXXX (12 digits starting with 92)

  if (digits.length === 11 && digits.startsWith("0")) {
    // Format: 03XX-XXXXXXX
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  } else if (digits.length === 12 && digits.startsWith("92")) {
    // Format: +92-3XX-XXXXXXX
    return `+${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
  } else if (digits.length === 10) {
    // Format: 3XX-XXXXXXX
    return `0${digits.slice(0, 3)}-${digits.slice(3)}`;
  }

  // Return as-is if format doesn't match
  return phone;
}

/**
 * Get WhatsApp link for phone number
 */
export function getWhatsAppLink(
  phone: string | null | undefined
): string | null {
  if (!phone) return null;

  const digits = phone.replace(/\D/g, "");
  let whatsappNumber = digits;

  // Convert to international format
  if (digits.startsWith("0")) {
    whatsappNumber = `92${digits.slice(1)}`;
  } else if (!digits.startsWith("92")) {
    whatsappNumber = `92${digits}`;
  }

  return `https://wa.me/${whatsappNumber}`;
}

/**
 * Get tel: link for phone number
 */
export function getTelLink(phone: string | null | undefined): string | null {
  if (!phone) return null;

  const digits = phone.replace(/\D/g, "");
  let telNumber = digits;

  // Ensure it starts with +92
  if (digits.startsWith("0")) {
    telNumber = `+92${digits.slice(1)}`;
  } else if (!digits.startsWith("92")) {
    telNumber = `+92${digits}`;
  } else {
    telNumber = `+${digits}`;
  }

  return `tel:${telNumber}`;
}
