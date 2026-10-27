
import { prisma } from "./lib/prisma.js";
import {
  createPatient,
  getPatient,
  searchPatients,
  updatePatientPhone,
  deletePatient,
} from "./lib/patients.js";
import {
  createDoctor,
  getDoctor,
  listDoctorsBySpecialty,
  deleteDoctor,
} from "./lib/doctors.js";
import {
  bookAppointment,
  getAppointmentFull,
  getDoctorUpcomingAppointments,
  setAppointmentStatus,
  cancelAllPatientAppointments,
  deleteAppointment,
} from "./lib/appointments.js";

async function main() {
  console.log("=== PATIENT TESTS ===");

  const patient = await createPatient(
    "Test Patient",
    `test-${Date.now()}@example.com`,
    "9000000000",
    new Date("2001-01-01"),
  );
  console.log("Created patient:", patient.name);

  const foundPatient = await getPatient(patient.id);
  console.log("Found patient:", foundPatient?.email);

  const searchedPatients = await searchPatients("Test Patient");
  console.log("Search results:", searchedPatients.length);

  await updatePatientPhone(patient.id, "9111111111");
  console.log("Updated phone:", (await getPatient(patient.id))?.phone);

  console.log("\n=== DOCTOR TESTS ===");

  const doctor = await createDoctor(
    "Dr. Test",
    "Cardiology",
    `doctor-${Date.now()}@example.com`,
  );
  console.log("Created doctor:", doctor.name);

  console.log("Found doctor:", (await getDoctor(doctor.id))?.name);

  const doctors = await listDoctorsBySpecialty("Cardiology");
  console.log("Cardiology doctors:", doctors.length);

  console.log("\n=== APPOINTMENT TESTS ===");

  const appointment = await bookAppointment(
    patient.id,
    doctor.id,
    new Date(Date.now() + 24 * 60 * 60 * 1000),
    "Test appointment",
  );
  console.log("Booked appointment:", appointment.id);
  console.log("Patient on appointment:", appointment.patient.name);
  console.log("Doctor on appointment:", appointment.doctor.name);

  const fullAppointment = await getAppointmentFull(appointment.id);
  console.log("Full appointment found:", fullAppointment !== null);

  const upcoming = await getDoctorUpcomingAppointments(doctor.id);
  console.log("Upcoming appointments:", upcoming.length);

  await setAppointmentStatus(appointment.id, "confirmed");
  console.log(
    "Updated status:",
    (await getAppointmentFull(appointment.id))?.status,
  );

  await cancelAllPatientAppointments(patient.id);
  console.log("Patient appointments cancelled.");

  await deleteAppointment(appointment.id);
  console.log("Appointment deleted.");

  await deletePatient(patient.id);
  console.log("Test patient deleted.");

  await deleteDoctor(doctor.id);
  console.log("Test doctor deleted.");

  console.log("\nAll tests completed.");
}

main()
  .catch((error: unknown) => {
    console.error("Test failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
