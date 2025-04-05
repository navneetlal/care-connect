import { z } from "zod";

// Input schema
export const BookAppointmentInputSchema = z.object({
  patientName: z.string().describe("Full name of the patient"),
  patientId: z.string().optional().describe("Patient ID if existing patient"),
  patientPhone: z.string().describe("Patient's contact phone number"),
  patientEmail: z
    .string()
    .email()
    .optional()
    .describe("Patient's email address"),
  doctorId: z
    .number()
    .describe("ID of the doctor to book an appointment with"),
  appointmentSlot: z
    .string()
    .describe("The desired appointment slot in 'YYYY-MM-DD HH:MM' format"),
  reason: z.string().describe("Brief reason for the appointment"),
  insuranceInfo: z
    .string()
    .optional()
    .describe("Patient's insurance information"),
});

// Output schemas
export const AppointmentDetailsSchema = z.object({
  appointmentId: z.number().describe("Unique identifier for the appointment"),
  patientName: z.string().describe("Name of the patient"),
  patientId: z.string().describe("ID of the patient"),
  doctorName: z.string().describe("Name of the doctor"),
  doctorSpecialty: z.string().describe("Medical specialty of the doctor"),
  appointmentTime: z.string().describe("Date and time of the appointment"),
  reason: z.string().describe("Reason for the appointment"),
});

export const SuccessResponseSchema = z.object({
  success: z.literal(true),
  message: z.string().describe("Success confirmation message"),
  appointmentDetails: AppointmentDetailsSchema,
  instructions: z.string().describe("Post-booking instructions for the patient"),
});

export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string().describe("Error message explaining the failure"),
  error: z.string().optional().describe("Technical error details if available"),
});

export const BookAppointmentResponseSchema = z.union([
  SuccessResponseSchema,
  ErrorResponseSchema,
]);

// Type exports
export type BookAppointmentInput = z.infer<typeof BookAppointmentInputSchema>;
export type BookAppointmentResponse = z.infer<typeof BookAppointmentResponseSchema>;
export type AppointmentDetails = z.infer<typeof AppointmentDetailsSchema>;
