import { Router } from 'express'
import { 
  getTemplates, 
  createTemplate, 
  getRequests, 
  createRequest, 
  approveRequest, 
  rejectRequest 
} from '../controllers/approvalController'
import { authenticate } from '../middlewares/auth'

const router = Router()

router.use(authenticate)

// Templates
router.get('/templates', getTemplates)
router.post('/templates', createTemplate)

// Requests
router.get('/requests', getRequests)
router.post('/requests', createRequest)
router.post('/requests/:id/approve', approveRequest)
router.post('/requests/:id/reject', rejectRequest)

export default router
