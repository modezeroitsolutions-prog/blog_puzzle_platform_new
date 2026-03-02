/**
 * Generate a short referral code from uid (safe for URLs).
 */
export function generateReferralCode(uid: string): string {
  const base = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  let n = 0;
  for (let i = 0; i < uid.length; i++) n = (n + uid.charCodeAt(i)) >>> 0;
  for (let i = 0; i < 8; i++) {
    code += base[(n % base.length)];
    n = (n * 31) >>> 0;
  }
  return code;
}
