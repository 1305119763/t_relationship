import { Router } from 'express'
import { getWorkReports, createWorkReport, updateWorkReport, deleteWorkReport } from '../controllers/workReportController'
import { authenticate } from '../middlewares/auth'

const router = Router()

router.use(authenticate)

router.get('/', getWorkReports)
router.post('/', createWorkReport)
router.put('/:id', updateWorkReport)
router.delete('/:id', deleteWorkReport)

export default router
