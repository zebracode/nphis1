import Link from 'next/link'
import { getAppointmentsForExamination, getExaminations } from './actions'
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

export default async function ExaminationsPage() {
  const [appointments, examinations] = await Promise.all([
    getAppointmentsForExamination(),
    getExaminations()
  ])
  const appointmentsWithoutExam = appointments.filter(a => !a.examination)

  return (
    <>
      <Typography variant='h4'>การตรวจรักษา</Typography>

      <Card className='mt-6'>
        <CardContent>
          <Typography variant='h6' className='mb-4'>
            นัดที่รอเปิดเคส
          </Typography>
          {appointmentsWithoutExam.length === 0 ? (
            <Typography color='text.secondary'>ไม่มีนัดที่รอเปิดเคส</Typography>
          ) : (
            <TableContainer component={Paper} variant='outlined' sx={{ boxShadow: 'none' }}>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>วันที่นัด</TableCell>
                    <TableCell>ฟาร์ม</TableCell>
                    <TableCell>สัตว์</TableCell>
                    <TableCell>ประเภทนัด</TableCell>
                    <TableCell align='right'>จัดการ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appointmentsWithoutExam.map(a => (
                    <TableRow key={a.id}>
                      <TableCell>{new Date(a.appointmentDate).toLocaleDateString('th-TH')}</TableCell>
                      <TableCell>{a.farm.name}</TableCell>
                      <TableCell>{a.animal ? `${a.animal.species} ${a.animal.name || ''}`.trim() : '-'}</TableCell>
                      <TableCell>{a.type === 'URGENT' ? 'ฉุกเฉิน' : 'ปกติ'}</TableCell>
                      <TableCell align='right'>
                        <Button component={Link} href={`/examinations/new?appointmentId=${a.id}`} size='small' variant='contained'>
                          เปิดเคส
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <Card className='mt-6'>
        <CardContent>
          <Typography variant='h6' className='mb-4'>
            รายการตรวจแล้ว
          </Typography>
          {examinations.length === 0 ? (
            <Typography color='text.secondary'>ยังไม่มีรายการตรวจ</Typography>
          ) : (
            <TableContainer component={Paper} variant='outlined' sx={{ boxShadow: 'none' }}>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>วันที่ตรวจ</TableCell>
                    <TableCell>ฟาร์ม / สัตว์</TableCell>
                    <TableCell>คลินิก</TableCell>
                    <TableCell>สถานะ</TableCell>
                    <TableCell align='right'>จัดการ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {examinations.map(e => (
                    <TableRow key={e.id}>
                      <TableCell>{new Date(e.examDate).toLocaleDateString('th-TH')}</TableCell>
                      <TableCell>
                        {e.appointment?.farm?.name || '-'} / {e.appointment?.animal ? `${e.appointment.animal.species}` : '-'}
                      </TableCell>
                      <TableCell>{e.clinicType === 'HORSE' ? 'ม้า' : e.clinicType === 'OTHER' ? 'อื่นๆ' : 'ปศุสัตว์'}</TableCell>
                      <TableCell>
                        <Chip label={e.status === 'APPROVED' ? 'อนุมัติแล้ว' : e.status === 'PENDING_APPROVAL' ? 'รออนุมัติ' : 'แบบร่าง'} size='small' variant='outlined' />
                      </TableCell>
                      <TableCell align='right'>
                        <Button component={Link} href={`/examinations/${e.id}`} size='small' variant='outlined'>
                          ดู
                        </Button>
                        {!e.teachingCase && (
                          <Button component={Link} href={`/teaching/assign?examinationId=${e.id}`} size='small' variant='outlined' className='ms-2'>
                            มอบนักศึกษา
                          </Button>
                        )}
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
