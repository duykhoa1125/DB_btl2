import axiosClient from "@/lib/axiosClient";
import { Voucher } from "./types";

const voucherService = {
  // ============================================================================
  // ACTIVE METHODS - Compatible with current backend
  // ============================================================================

  /**
   * Validate voucher by code
   * Server endpoint: GET /other/vouchers/check/:code
   * Returns boolean indicating if voucher exists in database
   */
  validateByCode: async (code: string): Promise<boolean> => {
    try {
      const result = await axiosClient.get(`/other/vouchers/check/${code}`) as any;
      return result === true || result?.valid === true;
    } catch (error) {
      return false;
    }
  },

  /**
   * Get voucher details for UI display
   * Note: Backend only provides validation, not full details.
   * This method validates the voucher and returns a simplified object for UI.
   * Actual discount (10%) is applied by backend during booking.
   */
  getDetailByCode: async (code: string): Promise<any> => {
    const isValid = await voucherService.validateByCode(code);
    if (!isValid) {
      return null;
    }

    // Return simplified voucher object for UI
    // Backend will apply actual 10% discount during booking (booking_service.js line 103)
    return {
      code: code.toUpperCase(),
      promotional_id: "DISCOUNT",
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      state: "active",
      phone_number: "",
      discount: {
        promotional_id: "DISCOUNT",
        percent_reduce: 10, // Match backend's hardcoded 10% (booking_service.js line 103)
        max_price_can_reduce: 0, // No limit (backend doesn't apply cap)
      },
    };
  },

  // ============================================================================
  // UNUSED METHODS - Commented out (Backend APIs don't exist)
  // ============================================================================

  /**
   * Get all vouchers
   * DISABLED: Backend endpoint /vouchers does not exist
   */
  // getAll: (): Promise<Voucher[]> => {
  //   return axiosClient.get("/vouchers");
  // },

  /**
   * Get vouchers for a specific user
   * DISABLED: Backend endpoint /vouchers does not exist
   */
  // getByUser: (phoneNumber: string): Promise<Voucher[]> => {
  //   return axiosClient.get("/vouchers", {
  //     params: { phone_number: phoneNumber },
  //   });
  // },

  /**
   * Get voucher by code
   * DISABLED: Backend endpoint /vouchers/:code does not exist
   */
  // getByCode: (code: string): Promise<Voucher> => {
  //   return axiosClient.get(`/vouchers/${code}`);
  // },

  /**
   * Get active vouchers for a user
   * DISABLED: Backend endpoint /vouchers/active does not exist
   */
  // getActiveVouchers: (phoneNumber: string): Promise<Voucher[]> => {
  //   return axiosClient.get("/vouchers/active", {
  //     params: { phone_number: phoneNumber },
  //   });
  // },

  /**
   * Validate if a voucher can be used
   * DISABLED: Backend endpoint /vouchers/validate does not exist
   */
  // validateVoucher: (
  //   code: string,
  //   phoneNumber: string
  // ): Promise<{ valid: boolean; message: string }> => {
  //   return axiosClient.post("/vouchers/validate", {
  //     code,
  //     phone_number: phoneNumber,
  //   });
  // },

  /**
   * Apply voucher to a bill
   * DISABLED: Backend endpoint /vouchers/apply does not exist
   * Note: Voucher is applied by passing voucher_code to booking API
   */
  // applyVoucher: (
  //   code: string,
  //   billId: string
  // ): Promise<{ discount: number; message: string }> => {
  //   return axiosClient.post("/vouchers/apply", { code, bill_id: billId });
  // },

  /**
   * Create voucher (admin)
   * DISABLED: Backend endpoint /vouchers does not exist
   */
  // create: (data: Omit<Voucher, "code">): Promise<Voucher> => {
  //   return axiosClient.post("/vouchers", data);
  // },

  /**
   * Update voucher state (admin)
   * DISABLED: Backend endpoint /vouchers/:code does not exist
   */
  // updateState: (
  //   code: string,
  //   state: "active" | "used" | "expired"
  // ): Promise<Voucher> => {
  //   return axiosClient.put(`/vouchers/${code}`, { state });
  // },

  /**
   * Delete voucher (admin)
   * DISABLED: Backend endpoint /vouchers/:code does not exist
   */
  // delete: (code: string): Promise<void> => {
  //   return axiosClient.delete(`/vouchers/${code}`);
  // },
};

export default voucherService;
