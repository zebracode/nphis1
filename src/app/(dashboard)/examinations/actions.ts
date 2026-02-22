'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { prisma } from '@/lib/prisma'
import { ClinicType } from '@prisma/client'

export async function getAppointmentsForExamination() {
  return prisma.appointment.findMany({
    where: { status: { in: ['PENDING', 'CONFIRMED'] } },
    orderBy: { appointmentDate: 'desc' },
    include: { farm: true, animal: true, examination: true }
  })
}

export async function getExaminations() {
  return prisma.examination.findMany({
    orderBy: { createdAt: 'desc' },
    include: { appointment: { include: { farm: true, animal: true } }, images: true, teachingCase: true }
  })
}

export async function getExamination(id: number) {
  return prisma.examination.findUnique({
    where: { id },
    include: { appointment: { include: { farm: true, animal: true } }, images: { orderBy: { sortOrder: 'asc' } }, teachingCase: true }
  })
}

export type ExaminationFormState = { error?: string }

export async function createExaminationFromAppointment(
  _prev: ExaminationFormState,
  formData: FormData
): Promise<ExaminationFormState> {
  const appointmentId = parseInt((formData.get('appointmentId') as string) || '0', 10)
  const summary = (formData.get('summary') as string) || null
  const clinicType = (formData.get('clinicType') as string) || 'LIVESTOCK'
  const isFarmVisit = formData.get('isFarmVisit') === 'true'

  if (!appointmentId) return { error: 'ข้อมูลนัดหมายไม่ถูกต้อง' }
  const existing = await prisma.examination.findUnique({ where: { appointmentId } })
  if (existing) return { error: 'นัดนี้เปิดเคสแล้ว' }
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { animal: true, farm: true }
  })
  if (!appointment) return { error: 'ไม่พบนัดหมาย' }

  const exam = await prisma.examination.create({
    data: {
      appointmentId,
      animalId: appointment.animalId,
      farmId: appointment.farmId,
      clinicType: clinicType === 'HORSE' ? ClinicType.HORSE : clinicType === 'OTHER' ? ClinicType.OTHER : ClinicType.LIVESTOCK,
      summary: summary?.trim() || null,
      isFarmVisit,
      status: 'DRAFT'
    }
  })

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'examinations', String(exam.id))
  await mkdir(uploadDir, { recursive: true })
  let sortOrder = 0
  for (const [key, value] of formData.entries()) {
    if (value instanceof File && value.size > 0 && key.startsWith('image')) {
      const ext = path.extname(value.name) || '.jpg'
      const filename = `img-${sortOrder}${ext}`
      const filePath = path.join(uploadDir, filename)
      const buf = Buffer.from(await value.arrayBuffer())
      await writeFile(filePath, buf)
      const relativePath = `/uploads/examinations/${exam.id}/${filename}`
      await prisma.examinationImage.create({
        data: { examinationId: exam.id, filePath: relativePath, sortOrder }
      })
      sortOrder++
    }
  }

  revalidatePath('/examinations')
  redirect('/examinations')
}

export async function addExaminationImages(id: number, formData: FormData) {
  const exam = await prisma.examination.findUnique({ where: { id }, include: { images: true } })
  if (!exam) return { error: 'ไม่พบการตรวจ' }
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'examinations', String(id))
  await mkdir(uploadDir, { recursive: true })
  const startOrder = exam.images.length
  let sortOrder = startOrder
  for (const [key, value] of formData.entries()) {
    if (value instanceof File && value.size > 0 && key.startsWith('image')) {
      const ext = path.extname(value.name) || '.jpg'
      const filename = `img-${sortOrder}${ext}`
      const filePath = path.join(uploadDir, filename)
      const buf = Buffer.from(await value.arrayBuffer())
      await writeFile(filePath, buf)
      const relativePath = `/uploads/examinations/${id}/${filename}`
      await prisma.examinationImage.create({
        data: { examinationId: id, filePath: relativePath, sortOrder }
      })
      sortOrder++
    }
  }
  revalidatePath(`/examinations/${id}`)
  redirect(`/examinations/${id}`)
}
