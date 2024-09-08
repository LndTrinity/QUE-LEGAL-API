import { PrismaClient } from "@prisma/client"
import { Router } from "express"

const prisma = new PrismaClient()
const router = Router()

router.get("/", async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany({
      include: {
        tipo: true
      }
    })
    res.status(200).json(produtos)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.post("/", async (req, res) => {
  const { nome, preco, cor, tamanho, marca, descricao, destaque, deleted, quantidade,tipoId,fotos } = req.body

  if (!nome || !preco|| !cor|| !tamanho|| !marca|| !descricao|| !destaque|| !deleted|| !quantidade ||!tipoId ||!fotos) {
    res.status(400).json({ "erro": "Informe todos os dados corretamente" })
    return
  }

  try {
    const produto = await prisma.produto.create({
      data: { nome, preco, cor, tamanho, marca, descricao, destaque, deleted, quantidade,tipoId,fotos }
    })
    res.status(201).json(produto)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.delete("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const produto = await prisma.produto.delete({
      where: { id: Number(id) }
    })
    res.status(200).json(produto)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.put("/:id", async (req, res) => {
  const { id } = req.params
  const { nome, preco, cor, tamanho, marca, descricao, destaque, deleted, quantidade,tipoId,fotos } = req.body

  if (!nome || !preco|| !cor|| !tamanho|| !marca|| !descricao|| !destaque|| !deleted|| !quantidade ||!tipoId ||!fotos) {
    res.status(400).json({ "erro": "Informe todos os dados corretamente" })
    return
  }

  try {
    const carro = await prisma.produto.update({
      where: { id: Number(id) },
      data: { nome, preco, cor, tamanho, marca, descricao, destaque, deleted, quantidade,tipoId,fotos }
    })
    res.status(200).json(carro)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.get("/pesquisa/:termo", async (req, res) => {
  const { termo } = req.params

  // tenta converter o termo em número
  const termoNumero = Number(termo)

  // se a conversão gerou um NaN (Not a Number)
  if (isNaN(termoNumero)) {
    try {
      const produto = await prisma.produto.findMany({
        include: {
          tipo: true
        },
        where: {
          OR: [
            { nome: { contains: termo }},
            { tipo: { nome: termo }},
            { cor: { contains: termo }},
            { marca: { contains: termo }}
          ]
        }
      })
      res.status(200).json(produto)
    } catch (error) {
      res.status(400).json(error)
    }
  } else {
    try {
      const produtos = await prisma.produto.findMany({
        include: {
          tipo: true
        },
        where: {
          OR: [
            { preco: { lte: termoNumero }},
            
          ]
        }
      })
      res.status(200).json(produtos)
    } catch (error) {
      res.status(400).json(error)
    }
  }
})

router.get("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const produtos = await prisma.produto.findUnique({
      where: { id: Number(id)},
      include: {
        tipo: true
      }
    })
    res.status(200).json(produtos)
  } catch (error) {
    res.status(400).json(error)
  }
})

export default router