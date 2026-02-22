import Link from 'next/link'
import { getAppointments } from './actions'
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
import Chip from '@mui/material/Chip'

export default async function AppointmentsPage() {
  const appointments = await getAppointments()

  const statusLabel: Record<string, string> = {
    PENDING: 'รอตรวจ',
    CONFIRMED: 'ยืนยันแล้ว',
    COMPLETED: 'เสร็จแล้ว'
  }
  const typeLabel: Record<string, string> = {
    NORMAL: 'ปกติ',
    URGENT: 'ฉุกเฉิน'
  }

  return (
    <>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <Typography variant='h4'>นัดของฉัน</Typography>
        <Button
          component={Link}
          href='/portal/appointments/new'
          variant='contained'
          startIcon={<i className='tabler-plus' />}
        >
          ขอนัดตรวจ
        </Button>
      </div>
      <Card className='mt-6'>
        <CardContent>
          {appointments.length === 0 ? (
            <Typography color='text.secondary' className='py-8 text-center'>
              ยังไม่มีนัดหมาย
            </Typography>
          ) : (
            <TableContainer component={Paper} variant='outlined' sx={{ boxShadow: 'none' }}>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>วันที่นัด</TableCell>
                    <TableCell>ฟาร์ม</TableCell>
                    <TableCell>สัตว์</TableCell>
                    <TableCell>ประเภท</TableCell>
                    <TableCell>สถานะ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appointments.map(a => (
                    <TableRow key={a.id}>
                      <TableCell>{new Date(a.appointmentDate).toLocaleDateString('th-TH')}</TableCell>
                      <TableCell>{a.farm.name}</TableCell>
                      <TableCell>{a.animal ? `${a.animal.species} ${a.animal.name || ''}`.trim() : '-'}</TableCell>
                      <TableCell>{typeLabel[a.type]}</TableCell>
                      <TableCell>
                        <Chip label={statusLabel[a.status]} size='small' variant='outlined' />
                      </TableCell>
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
