import { Router } from 'express'
import { getSalesFunnel, getSalesTrend, getCustomerStats } from '../controllers/reportController'
import { authenticate } from '../middlewares/auth'

const router = Router()

router.use(authenticate)

router.get('/funnel', getSalesFunnel)
router.get('/trend', getSalesTrend)
router.get('/customer-stats', getCustomerStats)

export default router
