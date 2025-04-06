import { createTool } from "@mastra/core/tools";

import { bookAppointment } from "../services/appointment/book-appointment";
import { BookAppointmentInputSchema, BookAppointmentResponseSchema } from "../services/appointment/types";

export const bookAppointmentTool = createTool({
  id: "bookAppointmentTool",
  description: "Book an appointment with a doctor",
  inputSchema: BookAppointmentInputSchema,
  outputSchema: BookAppointmentResponseSchema,
  execute: async ({ context }) => {
    console.log("🔖  bookAppointmentTool called with:", context);
    return await bookAppointment(context)
  },
});
