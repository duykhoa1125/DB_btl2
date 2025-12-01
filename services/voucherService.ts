import axiosClient from "@/lib/axiosClient";
import { Voucher } from "./types";

const voucherService = {
  /**
   * Get all vouchers
   */
  getAll: (): Promise<Voucher[]> => {
    return axiosClient.get("/vouchers");
  },

  /**
   * Get vouchers for a specific user
   */
  getByUser: (phoneNumber: string): Promise<Voucher[]> => {
    return axiosClient.get("/vouchers", {
      params: { phone_number: phoneNumber },
    });
  },

  /**
   * Get voucher by code
   */
  getByCode: (code: string): Promise<Voucher> => {
    return axiosClient.get(`/vouchers/${code}`);
  },

  /**
   * Validate voucher by code
   * Server endpoint: GET /other/vouchers/check/:code
   * Returns boolean indicating if voucher is valid
   */
  validateByCode: async (code: string): Promise<boolean> => {
    try {
      const result = await axiosClient.get(`/other/vouchers/check/${code}`);
      return result === true || result?.valid === true;
    } catch (error) {
      return false;
    }
  },

  /**
   * Get voucher with full details (promotional, discount, gift info)
   * Note: Server currently only supports validation, not full details
   * Returns a mock voucher object if valid
   */
  getDetailByCode: async (code: string): Promise<any> => {
    const isValid = await voucherService.validateByCode(code);
    if (!isValid) {
      return null;
    }
    // Return mock voucher data since server doesn't provide full details
    return {
      code: code.toUpperCase(),
      promotional_id: "PROMO001",
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      state: "active",
      phone_number: "",
      discount: {
        promotional_id: "PROMO001",
        percent_reduce: 10, // Default 10% discount
        max_price_can_reduce: 50000,
      },
    };
  },

  /**
   * Get active vouchers for a user
   */
  getActiveVouchers: (phoneNumber: string): Promise<Voucher[]> => {
    return axiosClient.get("/vouchers/active", {
      params: { phone_number: phoneNumber },
    });
  },

  /**
   * Validate if a voucher can be used
   */
  validateVoucher: (
    code: string,
    phoneNumber: string
  ): Promise<{ valid: boolean; message: string }> => {
    return axiosClient.post("/vouchers/validate", {
      code,
      phone_number: phoneNumber,
    });
  },

  /**
   * Apply voucher to a bill
   */
  applyVoucher: (
    code: string,
    billId: string
  ): Promise<{ discount: number; message: string }> => {
    return axiosClient.post("/vouchers/apply", { code, bill_id: billId });
  },

  /**
   * Create voucher (admin)
   */
  create: (data: Omit<Voucher, "code">): Promise<Voucher> => {
    return axiosClient.post("/vouchers", data);
  },

  /**
   * Update voucher state (admin)
   */
  updateState: (
    code: string,
    state: "active" | "used" | "expired"
  ): Promise<Voucher> => {
    return axiosClient.put(`/vouchers/${code}`, { state });
  },

  /**
   * Delete voucher (admin)
   */
  delete: (code: string): Promise<void> => {
    return axiosClient.delete(`/vouchers/${code}`);
  },
};

export default voucherService;
