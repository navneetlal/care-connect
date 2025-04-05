import pool from "../pg";
import { DoctorAvailability } from "../../services/doctor/types";

export class DoctorRepository {
  async getDoctorDetails(doctorId: number) {
    const doctorQuery = `SELECT name, specialty FROM doctors WHERE id = $1`;
    const result = await pool.query(doctorQuery, [doctorId]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async findAvailableDoctors(
    specialty?: string,
    date?: string,
    doctorName?: string
  ): Promise<DoctorAvailability[]> {
    let query = `
      SELECT d.id, d.name, d.specialty,
             ARRAY_AGG(DISTINCT TO_CHAR(s.start_time, 'YYYY-MM-DD HH24:MI')) AS available_slots
      FROM doctors d
      JOIN availability_slots s ON d.id = s.doctor_id
      WHERE s.is_booked = false
    `;

    const queryParams = [];
    let paramCounter = 1;

    if (specialty) {
      query += ` AND d.specialty ILIKE $${paramCounter}`;
      queryParams.push(`%${specialty}%`);
      paramCounter++;
    }

    if (doctorName) {
      query += ` AND d.name ILIKE $${paramCounter}`;
      queryParams.push(`%${doctorName}%`);
      paramCounter++;
    }

    if (date) {
      query += ` AND DATE(s.start_time) = $${paramCounter}`;
      queryParams.push(date);
      paramCounter++;
    }

    query += ` GROUP BY d.id, d.name, d.specialty ORDER BY d.name`;

    const result = await pool.query(query, queryParams);

    return result.rows.map(doctor => ({
      id: doctor.id,
      name: doctor.name,
      specialty: doctor.specialty,
      availableSlots: doctor.available_slots,
    }));
  }
}
