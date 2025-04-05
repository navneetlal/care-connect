import { createTool } from "@mastra/core/tools";

import { getDoctorAvailability } from "../services/doctor/get-doctor-avaibility";
import { DoctorAvailabilityInputSchema } from "../services/doctor/types";

export const doctorAvailabilityTool = createTool({
  id: "doctorAvailabilityTool",
  description: "Get information about which doctors are available for appointments",
  inputSchema: DoctorAvailabilityInputSchema,
  execute: async ({ context }) => {
    return await getDoctorAvailability(context);
  },
});
