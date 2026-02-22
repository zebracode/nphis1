import Link from 'next/link'
import { getTeachingCases } from './actions'
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

export default async function TeachingPage() {
  const cases = await getTeachingCases()

  return (
    <>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <Typography variant='h4'>ห้องเรียนออนไลน์</Typography>
        <Button component={Link} href='/teaching/assign' variant='contained' startIcon={<i className='tabler-user-plus' />}>
          มอบเคสให้นักศึกษา
        </Button>
      </div>

      <Card className='mt-6'>
        <CardContent>
          <Typography variant='h6' className='mb-4'>
            เคสที่มอบแล้ว
          </Typography>
          {cases.length === 0 ? (
            <Typography color='text.secondary'>ยังไม่มีเคสที่มอบให้นักศึกษา</Typography>
          ) : (
            <TableContainer component={Paper} variant='outlined' sx={{ boxShadow: 'none' }}>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>นักศึกษา</TableCell>
                    <TableCell>ฟาร์ม / สัตว์</TableCell>
                    <TableCell>วันที่มอบ</TableCell>
                    <TableCell>สถานะ</TableCell>
                    <TableCell>ต้นทุนจริง</TableCell>
                    <TableCell align='right'>จัดการ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cases.map(c => (
                    <TableRow key={c.id}>
                      <TableCell>{c.student.name}</TableCell>
                      <TableCell>
                        {c.examination?.appointment?.farm?.name || '-'} / {c.examination?.appointment?.animal?.species || '-'}
                      </TableCell>
                      <TableCell>{new Date(c.createdAt).toLocaleDateString('th-TH')}</TableCell>
                      <TableCell>
                        <Chip
                          label={c.status === 'APPROVED' ? 'อนุมัติแล้ว' : 'รออนุมัติ'}
                          size='small'
                          color={c.status === 'APPROVED' ? 'success' : 'default'}
                          variant='outlined'
                        />
                      </TableCell>
                      <TableCell>
                        {c.actualCost != null ? `฿${c.actualCost}` : '-'}
                        {c.costWaivedForTeaching ? ' (ยกเว้นเพื่อการสอน)' : ''}
                      </TableCell>
                      <TableCell align='right'>
                        <Button component={Link} href={`/teaching/cases/${c.id}`} size='small' variant='outlined'>
                          ดู/อนุมัติ
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
    </>
  )
}
