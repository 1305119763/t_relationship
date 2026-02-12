import { Router } from 'express'
import { getWorkOrders, createWorkOrder, updateWorkOrder, deleteWorkOrder } from '../controllers/workOrderController'
import { authenticate } from '../middlewares/auth'

const router = Router()

router.use(authenticate)

router.get('/', getWorkOrders)
router.post('/', createWorkOrder)
router.put('/:id', updateWorkOrder)
router.delete('/:id', deleteWorkOrder)

export default router
