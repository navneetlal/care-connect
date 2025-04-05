import { createTool } from "@mastra/core/tools";

import { bookAppointment } from "../services/appointment/book-appointment";
import { BookAppointmentInputSchema } from "../services/appointment/types";

export const bookAppointmentTool = createTool({
  id: "bookAppointmentTool",
  description: "Book an appointment with a doctor",
  inputSchema: BookAppointmentInputSchema,
  execute: async ({ context }) => {
    return await bookAppointment(context)
  },
});
