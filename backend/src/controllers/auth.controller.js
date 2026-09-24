import { validateMaxInitData } from '../services/max-auth.service.js'

export async function maxAuth(req, res, next) {
  try {
    const { initData } = req.body

    const data = validateMaxInitData(
      initData,
      process.env.MAX_BOT_TOKEN,
    )

    res.json({
      success: true,
      data,
    })
  } catch (error) {
    next(error)
  }
}