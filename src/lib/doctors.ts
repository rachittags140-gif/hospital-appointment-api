
import { prisma } from "./prisma.js";

export async function createDoctor(
  name: string,
  specialty: string,
  email: string
) {
  return prisma.doctor.create({
    data: {
      name,
      specialty,
      email,
    },
  });
}

export async function getDoctor(id: number) {
  return prisma.doctor.findUnique({
    where: { id },
  });
}

export async function listDoctorsBySpecialty(specialty: string) {
  return prisma.doctor.findMany({
    where: {
      specialty: {
        equals: specialty,
        mode: "insensitive",
      },
    },
    orderBy: { name: "asc" },
  });
}

export async function deleteDoctor(id: number) {
  return prisma.doctor.delete({
    where: { id },
  });
}
