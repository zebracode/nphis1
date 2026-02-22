'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Decimal } from '@prisma/client/runtime/library'

export async function getDailyRecordsByAnimal(animalId: number) {
  return prisma.dailyRecord.findMany({
    where: { animalId },
    orderBy: { recordDate: 'desc' },
    take: 50
  })
}

export type DailyRecordFormState = { error?: string }

export async function createDailyRecord(
  _prev: DailyRecordFormState,
  formData: FormData
): Promise<DailyRecordFormState> {
  const animalId = parseInt((formData.get('animalId') as string) || '0', 10)
  const recordDate = formData.get('recordDate') as string
  const feedAmount = (formData.get('feedAmount') as string) || null
  const symptoms = (formData.get('symptoms') as string) || null
  const weightKg = formData.get('weightKg') as string
  const milkAmount = (formData.get('milkAmount') as string) || null
  if (!animalId) return { error: 'ข้อมูลสัตว์ไม่ถูกต้อง' }
  if (!recordDate?.trim()) return { error: 'กรุณาเลือกวันที่' }
  const weight = weightKg?.trim() ? new Decimal(weightKg.trim()) : null
  await prisma.dailyRecord.create({
    data: {
      animalId,
      recordDate: new Date(recordDate),
      feedAmount: feedAmount?.trim() || null,
      symptoms: symptoms?.trim() || null,
      weightKg: weight,
      milkAmount: milkAmount?.trim() || null
    }
  })
  revalidatePath(`/portal/animals/${animalId}`)
  redirect(`/portal/animals/${animalId}`)
}
