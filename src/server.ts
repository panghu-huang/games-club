import express from 'express'
import path from 'path'
import { renderToString } from 'server-renderer'
import GameScoreApp from './App'

const app = express()
const router = express.Router()
const rootDir = process.cwd()

const staticMiddleware = express.static(
  path.resolve(
    rootDir, 'dist/client'
  ), 
  {
    setHeaders(res, fullPath) {
      if (process.env.NODE_ENV === 'development') {
        return
      }
      console.log(fullPath)
      const extname = path.extname(fullPath)
      console.log(extname)
      if (extname === '.js' || extname === '.css') {
        // 一个月，有 hash 默认不变
        const maxAge = 60 * 60 * 24 * 30
        res.setHeader('Cache-Control', `public, max-age=${maxAge}`)
      }
    }
  }
)
router.get('/public/*', (req, res, next) => {
  req.url = req.url.replace('/public', '')
  staticMiddleware(req, res, next)
})

router.get('*', async (req, res) => {
  const html = await renderToString(req.url, {
    container: '#root',
    App: GameScoreApp as any,
  })

  res.setHeader('Content-Type', 'text/html')
  res.send(html)
  res.end()
})

app.use(router)

app.listen(3000, () => {
  console.log('Application running on http://localhost:3000')
})