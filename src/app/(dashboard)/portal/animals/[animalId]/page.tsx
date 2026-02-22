import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAnimal } from '@/app/(dashboard)/farms/[farmId]/animals/actions'
import { getDailyRecordsByAnimal } from '../../daily-records/actions'
import { createDailyRecord } from '../../daily-records/actions'
import DailyRecordForm from '../../DailyRecordForm'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

type Props = { params: Promise<{ animalId: string }> }

export default async function AnimalDetailPage({ params }: Props) {
  const { animalId } = await params
  const id = parseInt(animalId, 10)
  if (isNaN(id)) notFound()
  const [animal, records] = await Promise.all([getAnimal(id), getDailyRecordsByAnimal(id)])
  if (!animal) notFound()

  return (
    <>
      <div className='mb-6'>
        <Button
          component={Link}
          href={`/farms/${animal.farmId}/animals`}
          variant='text'
          startIcon={<i className='tabler-arrow-left' />}
        >
          กลับสัตว์ในฟาร์ม
        </Button>
        <Typography variant='h4' className='mt-2'>
          บันทึกประจำวัน: {animal.name || animal.species} ({animal.species})
        </Typography>
      </div>

      <Card className='mb-6'>
        <CardContent>
          <Typography variant='h6' className='mb-4'>
            เพิ่มบันทึกประจำวัน
          </Typography>
          <DailyRecordForm action={createDailyRecord} animalId={id} />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant='h6' className='mb-4'>
            ประวัติบันทึก
          </Typography>
          {records.length === 0 ? (
            <Typography color='text.secondary'>ยังไม่มีบันทึกประจำวัน</Typography>
          ) : (
            <TableContainer component={Paper} variant='outlined' sx={{ boxShadow: 'none' }}>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>วันที่</TableCell>
                    <TableCell>อาหาร</TableCell>
                    <TableCell>น้ำหนัก (กก.)</TableCell>
                    <TableCell>น้ำนม</TableCell>
                    <TableCell>อาการ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {records.map(r => (
                    <TableRow key={r.id}>
                      <TableCell>{new Date(r.recordDate).toLocaleDateString('th-TH')}</TableCell>
                      <TableCell>{r.feedAmount || '-'}</TableCell>
                      <TableCell>{r.weightKg != null ? String(r.weightKg) : '-'}</TableCell>
                      <TableCell>{r.milkAmount || '-'}</TableCell>
                      <TableCell sx={{ maxWidth: 200 }}>{r.symptoms ? `${r.symptoms.slice(0, 40)}${r.symptoms.length > 40 ? '...' : ''}` : '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </>
  )
}
