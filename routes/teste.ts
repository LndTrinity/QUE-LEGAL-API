import { PrismaClient } from "@prisma/client"
import { Router } from "express"
import multer from "multer"

const upload = multer({ storage: multer.memoryStorage() })

// const prisma = new PrismaClient()
const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'stdout',
      level: 'error',
    },
    {
      emit: 'stdout',
      level: 'info',
    },
    {
      emit: 'stdout',
      level: 'warn',
    },
  ],
})

prisma.$on('query', (e) => {
  console.log('Query: ' + e.query)
  console.log('Params: ' + e.params)
  console.log('Duration: ' + e.duration + 'ms')
})

const router = Router()

router.get("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const fotos = await prisma.foto.findUnique({
      where: { id: Number(id) }
    })
    console.log(fotos?.codigoFoto)
    res.status(200).json(fotos)
  } catch (error) {
    res.status(400).json(error)
  }
})
export default router
