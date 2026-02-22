'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { AppointmentType } from '@prisma/client'

export async function getFarmsWithAnimals() {
  return prisma.farm.findMany({
    orderBy: { name: 'asc' },
    include: { animals: { orderBy: { species: 'asc' } } }
  })
}

export async function getAppointments() {
  return prisma.appointment.findMany({
    orderBy: { appointmentDate: 'desc' },
    include: { farm: true, animal: true }
  })
}

export async function getAppointment(id: number) {
  return prisma.appointment.findUnique({
    where: { id },
    include: { farm: true, animal: true, examination: true }
  })
}

export type AppointmentFormState = { error?: string }

export async function createAppointment(
  _prev: AppointmentFormState,
  formData: FormData
): Promise<AppointmentFormState> {
  const farmId = formData.get('farmId') as string
  const animalIdRaw = formData.get('animalId') as string
  const type = formData.get('type') as string
  const appointmentDate = formData.get('appointmentDate') as string
  const note = (formData.get('note') as string) || null
  if (!farmId || !appointmentDate?.trim()) return { error: 'กรุณาเลือกฟาร์มและวันที่นัด' }
  const animalId = animalIdRaw?.trim() ? parseInt(animalIdRaw, 10) : null
  await prisma.appointment.create({
    data: {
      farmId: parseInt(farmId, 10),
      animalId,
      type: type === 'URGENT' ? AppointmentType.URGENT : AppointmentType.NORMAL,
      appointmentDate: new Date(appointmentDate),
      note: note?.trim() || null
    }
  })
  revalidatePath('/portal/appointments')
  redirect('/portal/appointments')
}
