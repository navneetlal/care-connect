import { createTool } from "@mastra/core/tools";

import { getDoctorAvailability } from "../services/doctor/get-doctor-avaibility";
import { DoctorAvailabilityInputSchema, DoctorAvailabilityResponseSchema } from "../services/doctor/types";

export const doctorAvailabilityTool = createTool({
  id: "doctorAvailabilityTool",
  description: "Get information about which doctors are available for appointments",
  inputSchema: DoctorAvailabilityInputSchema,
  outputSchema: DoctorAvailabilityResponseSchema,
  execute: async ({ context }) => {
    console.log("🔍 doctorAvailabilityTool called with:", context);
    return await getDoctorAvailability(context);
  },
});
