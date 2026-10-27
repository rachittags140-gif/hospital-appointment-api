
import { prisma } from "./prisma.js";

export async function bookAppointment(
  patientId: number,
  doctorId: number,
  appointmentDate: Date,
  notes?: string
) {
  return prisma.appointment.create({
    data: {
      patient: {
        connect: { id: patientId },
      },
      doctor: {
        connect: { id: doctorId },
      },
      appointmentDate,
      ...(notes !== undefined && { notes }),
    },
    include: {
      patient: true,
      doctor: true,
    },
  });
}

export async function getAppointmentFull(id: number) {
  return prisma.appointment.findUnique({
    where: { id },
    include: {
      patient: true,
      doctor: true,
    },
  });
}

export async function getDoctorUpcomingAppointments(doctorId: number) {
  return prisma.appointment.findMany({
    where: {
      doctorId,
      appointmentDate: { gte: new Date() },
      status: "scheduled",
    },
    include: {
      patient: true,
    },
    orderBy: { appointmentDate: "asc" },
  });
}

export async function setAppointmentStatus(id: number, status: string) {
  return prisma.appointment.update({
    where: { id },
    data: { status },
  });
}

export async function cancelAllPatientAppointments(patientId: number) {
  return prisma.appointment.updateMany({
    where: {
      patientId,
      status: "scheduled",
    },
    data: {
      status: "cancelled",
    },
  });
}

export async function deleteAppointment(id: number) {
  return prisma.appointment.delete({
    where: { id },
  });
}
