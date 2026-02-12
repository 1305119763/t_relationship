import { Router } from 'express'
import { getCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer, createFollowUp, getCustomerFollowUps } from '../controllers/customerController'
import { authenticate } from '../middlewares/auth'

const router = Router()

router.use(authenticate)

router.get('/', getCustomers)
router.get('/:id', getCustomer)
router.post('/', createCustomer)
router.put('/:id', updateCustomer)
router.delete('/:id', deleteCustomer)

// Follow-up routes
router.post('/follow-ups', createFollowUp)
router.get('/:id/follow-ups', getCustomerFollowUps)

export default router
