import axiosClient from "@/lib/axiosClient";
import { Voucher } from "./types";

const voucherService = {

  validateByCode: async (code: string): Promise<boolean> => {
    try {
      const result = await axiosClient.get(`/other/vouchers/check/${code}`) as any;
      return result === true || result?.valid === true;
    } catch (error) {
      return false;
    }
  },

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
};

export default voucherService;
