import pool from "../pg";

export class AppointmentRepository {
  async checkSlotAvailability(doctorId: number, appointmentSlot: string) {
    const slotCheckQuery = `
      SELECT id FROM availability_slots
      WHERE doctor_id = $1
      AND TO_CHAR(start_time, 'YYYY-MM-DD HH24:MI') = $2
      AND is_booked = false
    `;

    const result = await pool.query(slotCheckQuery, [doctorId, appointmentSlot]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async bookAppointment(patientId: string, doctorId: number, slotId: number, reason: string) {
    const bookingQuery = `
      INSERT INTO appointments (patient_id, doctor_id, slot_id, reason, status, booked_at)
      VALUES ($1, $2, $3, $4, 'confirmed', NOW())
      RETURNING id
    `;

    const result = await pool.query(bookingQuery, [patientId, doctorId, slotId, reason]);
    return result.rows[0];
  }

  async markSlotAsBooked(slotId: number) {
    return pool.query(`UPDATE availability_slots SET is_booked = true WHERE id = $1`, [slotId]);
  }
}
