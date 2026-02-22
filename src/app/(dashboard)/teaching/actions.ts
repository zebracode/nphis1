'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Decimal } from '@prisma/client/runtime/library'

export async function getStudents() {
  return prisma.user.findMany({
    where: { role: 'STUDENT' },
    orderBy: { name: 'asc' }
  })
}

export async function getExaminationsWithoutTeachingCase() {
  return prisma.examination.findMany({
    where: { teachingCase: null },
    orderBy: { createdAt: 'desc' },
    include: { appointment: { include: { farm: true, animal: true } } }
  })
}

export async function getTeachingCases() {
  return prisma.teachingCase.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      examination: { include: { appointment: { include: { farm: true, animal: true } } } },
      student: true
    }
  })
}

export async function getTeachingCase(id: number) {
  return prisma.teachingCase.findUnique({
    where: { id },
    include: {
      examination: { include: { appointment: { include: { farm: true, animal: true } }, images: true } },
      student: true
    }
  })
}

export async function assignCase(examinationId: number, studentId: number) {
  const existing = await prisma.teachingCase.findUnique({ where: { examinationId } })
  if (existing) return { error: 'เคสนี้มอบให้นักศึกษาแล้ว' }
  await prisma.teachingCase.create({
    data: { examinationId, studentId, status: 'PENDING_APPROVAL' }
  })
  revalidatePath('/teaching')
  revalidatePath('/examinations')
  redirect('/teaching')
}

export type AssignCaseFormState = { error?: string }

export async function assignCaseFromForm(
  _prev: AssignCaseFormState,
  formData: FormData
): Promise<AssignCaseFormState> {
  const examinationId = parseInt((formData.get('examinationId') as string) || '0', 10)
  const studentId = parseInt((formData.get('studentId') as string) || '0', 10)
  if (!examinationId || !studentId) return { error: 'กรุณาเลือกการตรวจและนักศึกษา' }
  const existing = await prisma.teachingCase.findUnique({ where: { examinationId } })
  if (existing) return { error: 'เคสนี้มอบให้นักศึกษาแล้ว' }
  await prisma.teachingCase.create({
    data: { examinationId, studentId, status: 'PENDING_APPROVAL' }
  })
  revalidatePath('/teaching')
  revalidatePath('/examinations')
  redirect('/teaching')
}

export type StudentNoteState = { error?: string }

export async function submitStudentNote(_prev: StudentNoteState, formData: FormData): Promise<StudentNoteState> {
  const caseId = parseInt((formData.get('caseId') as string) || '0', 10)
  const note = (formData.get('studentNote') as string) || null
  if (!caseId) return { error: 'ข้อมูลเคสไม่ถูกต้อง' }
  await prisma.teachingCase.update({
    where: { id: caseId },
    data: { studentNote: note?.trim() || null, status: 'PENDING_APPROVAL' }
  })
  revalidatePath(`/teaching/cases/${caseId}`)
  redirect(`/teaching/cases/${caseId}`)
}

export type ApproveCaseState = { error?: string }

export async function approveCase(_prev: ApproveCaseState, formData: FormData): Promise<ApproveCaseState> {
  const caseId = parseInt((formData.get('caseId') as string) || '0', 10)
  const actualCostRaw = formData.get('actualCost') as string
  const costWaived = formData.get('costWaivedForTeaching') === 'true'
  const costNote = (formData.get('costNote') as string) || null
  const actualCost = actualCostRaw?.trim() ? new Decimal(actualCostRaw.trim()) : null

  if (!caseId) return { error: 'ข้อมูลเคสไม่ถูกต้อง' }
  const tc = await prisma.teachingCase.findUnique({
    where: { id: caseId },
    include: { examination: { select: { appointmentId: true } } }
  })
  if (!tc) return { error: 'ไม่พบเคส' }

  await prisma.$transaction([
    prisma.teachingCase.update({
      where: { id: caseId },
      data: {
        status: 'APPROVED',
        actualCost,
        costWaivedForTeaching: costWaived,
        costNote: costNote?.trim() || null,
        approvedAt: new Date()
      }
    }),
    ...(tc.examination?.appointmentId
      ? [
          prisma.examination.update({
            where: { id: tc.examinationId },
            data: { status: 'APPROVED' }
          }),
          prisma.appointment.update({
            where: { id: tc.examination.appointmentId },
            data: { status: 'COMPLETED' }
          })
        ]
      : [])
  ])

  revalidatePath('/teaching')
  revalidatePath(`/teaching/cases/${caseId}`)
  revalidatePath('/portal/appointments')
  redirect('/teaching')
}
