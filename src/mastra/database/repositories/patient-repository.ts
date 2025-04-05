import pool from "../pg";

export class PatientRepository {
  async findPatientByNameAndPhone(name: string, phone: string) {
    const patientCheckQuery = `SELECT id FROM patients WHERE name = $1 AND phone = $2`;
    const result = await pool.query(patientCheckQuery, [name, phone]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async createPatient(name: string, phone: string, email: string | null, insuranceInfo: string | null) {
    const newPatientQuery = `
      INSERT INTO patients (name, phone, email, insurance_info)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `;

    const result = await pool.query(newPatientQuery, [name, phone, email, insuranceInfo]);
    return result.rows[0];
  }
}
