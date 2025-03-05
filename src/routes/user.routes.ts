import express, { Router } from 'express'
const router: Router = express.Router()
import checkUser from '~/middlewares/check-users.middlewares'
router.get('/', checkUser, (req, res) => {
  res.json({ message: 'Hello World!' })
})
router.get('/list', (req, res) => {
  res.json([
    {
      id: 1,
      name: 'Alice'
    },
    {
      id: 2,
      name: 'Bob'
    }
  ])
})
export default router
