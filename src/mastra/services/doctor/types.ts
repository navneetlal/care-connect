import { z } from "zod";

// Input schema
export const DoctorAvailabilityInputSchema = z.object({
  specialty: z
    .string()
    .optional()
    .describe(
      "The medical specialty to filter doctors (e.g., 'Cardiology', 'Dermatology')",
    ),
  date: z
    .string()
    .optional()
    .describe("The date to check availability in 'YYYY-MM-DD' format"),
  doctorName: z
    .string()
    .optional()
    .describe("The name of a specific doctor to check availability"),
});

// Output schemas
export const DoctorAvailabilitySchema = z.object({
  id: z.number().describe("The unique identifier of the doctor"),
  name: z.string().describe("The doctor's full name"),
  specialty: z.string().describe("The doctor's medical specialty"),
  availableSlots: z.array(z.string()).describe("List of available time slots in 'YYYY-MM-DD HH:MM' format"),
});

export const DoctorAvailabilityResponseSchema = z.object({
  message: z.string().describe("A message describing the result"),
  availableDoctors: z.array(DoctorAvailabilitySchema).describe("List of available doctors"),
  error: z.string().optional().describe("Error message if something went wrong"),
});

// Type exports
export type DoctorAvailabilityInput = z.infer<typeof DoctorAvailabilityInputSchema>;
export type DoctorAvailabilityResponse = z.infer<typeof DoctorAvailabilityResponseSchema>;
export type DoctorAvailability = z.infer<typeof DoctorAvailabilitySchema>;
