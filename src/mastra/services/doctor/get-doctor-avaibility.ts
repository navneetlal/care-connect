import { DoctorRepository } from "../../database/repositories/doctor-repository";
import { DoctorAvailabilityInput, DoctorAvailabilityResponse } from "./types";

const doctorRepo = new DoctorRepository();

export async function getDoctorAvailability({
  specialty,
  date,
  doctorName,
}: DoctorAvailabilityInput): Promise<DoctorAvailabilityResponse> {
  try {
    const availableDoctors = await doctorRepo.findAvailableDoctors(
      specialty,
      date,
      doctorName
    );

    if (availableDoctors.length === 0) {
      return {
        message:
          "No doctors available with the specified criteria. Please try different parameters or contact our scheduling department.",
        availableDoctors: [],
      };
    }

    return {
      message: "Here are the available doctors matching your criteria:",
      availableDoctors,
    };
  } catch (error) {
    console.error("Error fetching doctor availability:", error);
    return {
      message:
        "Sorry, there was an error retrieving doctor availability. Please try again later.",
      error: error instanceof Error ? error.message : "Unknown error",
      availableDoctors: [],
    };
  }
}
