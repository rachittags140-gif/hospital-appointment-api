
import { prisma } from "./lib/prisma.js";

async function main() {
  const patient1 = await prisma.patient.upsert({
    where: { email: "arun@example.com" },
    update: {},
    create: {
      name: "Arun Kumar",
      email: "arun@example.com",
      phone: "9876543210",
      dateOfBirth: new Date("2000-05-15"),
    },
  });

  const patient2 = await prisma.patient.upsert({
    where: { email: "priya@example.com" },
    update: {},
    create: {
      name: "Priya Sharma",
      email: "priya@example.com",
      phone: "9876543211",
      dateOfBirth: new Date("1998-08-20"),
    },
  });

  const doctor1 = await prisma.doctor.upsert({
    where: { email: "dr.rajesh@hospital.com" },
    update: {},
    create: {
      name: "Dr. Rajesh",
      specialty: "Cardiology",
      email: "dr.rajesh@hospital.com",
    },
  });

  const doctor2 = await prisma.doctor.upsert({
    where: { email: "dr.meena@hospital.com" },
    update: {},
    create: {
      name: "Dr. Meena",
      specialty: "Dermatology",
      email: "dr.meena@hospital.com",
    },
  });

  await prisma.appointment.createMany({
    data: [
      {
        patientId: patient1.id,
        doctorId: doctor1.id,
        appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        notes: "Routine check-up",
      },
      {
        patientId: patient2.id,
        doctorId: doctor2.id,
        appointmentDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
        notes: "Skin consultation",
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seed data created successfully.");
}

main()
  .catch((error: unknown) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
