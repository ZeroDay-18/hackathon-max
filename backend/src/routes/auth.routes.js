import { Router } from 'express'
import { maxAuth } from '../controllers/auth.controller.js'

const router = Router()

router.post('/max-miniapp', maxAuth)

export default router