import pool from "../../database/pg";
import { AppointmentRepository } from "../../database/repositories/appointment-repository";
import { DoctorRepository } from "../../database/repositories/doctor-repository";
import { PatientRepository } from "../../database/repositories/patient-repository";
import { BookAppointmentInput, BookAppointmentResponse } from "./types";

// Create repository instances
const appointmentRepo = new AppointmentRepository();
const doctorRepo = new DoctorRepository();
const patientRepo = new PatientRepository();

export async function bookAppointment({
  patientName,
  patientId,
  patientPhone,
  patientEmail,
  doctorId,
  appointmentSlot,
  reason,
  insuranceInfo,
}: BookAppointmentInput): Promise<BookAppointmentResponse> {
  // Using a transaction to ensure data consistency
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Check if the appointment slot is available
    const slot = await appointmentRepo.checkSlotAvailability(doctorId, appointmentSlot);

    if (!slot) {
      return {
        success: false,
        message: "Sorry, this appointment slot is no longer available. Please select another time."
      };
    }

    // Get patient ID or create new patient
    let actualPatientId: string = "";

    if (!patientId) {
      // Check if patient already exists with same name and phone
      const existingPatient = await patientRepo.findPatientByNameAndPhone(patientName, patientPhone);

      if (existingPatient) {
        actualPatientId = existingPatient.id;
      } else {
        // Create new patient
        const newPatient = await patientRepo.createPatient(
          patientName,
          patientPhone,
          patientEmail || null,
          insuranceInfo || null
        );

        actualPatientId = newPatient.id;
      }
    }

    // Book the appointment
    const booking = await appointmentRepo.bookAppointment(
      patientId ?? actualPatientId,
      doctorId,
      slot.id,
      reason
    );

    // Mark the slot as booked
    await appointmentRepo.markSlotAsBooked(slot.id);

    // Get doctor details for confirmation
    const doctorDetails = await doctorRepo.getDoctorDetails(doctorId);

    await client.query("COMMIT");

    return {
      success: true,
      message: "Appointment booked successfully!",
      appointmentDetails: {
        appointmentId: booking.id,
        patientName,
        patientId: patientId ?? actualPatientId,
        doctorName: doctorDetails.name,
        doctorSpecialty: doctorDetails.specialty,
        appointmentTime: appointmentSlot,
        reason,
      },
      instructions: "Please arrive 15 minutes before your appointment. Bring your insurance card and ID."
    };
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error booking appointment:", error);

    return {
      success: false,
      message: "Sorry, there was an error while booking your appointment. Please try again later.",
      error: error instanceof Error ? error.message : "Unknown error"
    };
  } finally {
    client.release();
  }
}
