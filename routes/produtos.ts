import { PrismaClient } from "@prisma/client"
import { Router } from "express"
import { Request, Response } from "express-serve-static-core"
import multer from "multer"
import { ParsedQs } from "qs"

const upload = multer({ storage: multer.memoryStorage() })
const prisma = new PrismaClient()
const router = Router()


router.get("/", async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany({
      include: {
        tipo: true,
        marca: true,
        fotos: true
      }
    })
    res.status(200).json(produtos)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.post("/", upload.single('codigoFoto'), async (req, res) => {
  const { nome, preco, cor, tamanho, descricao, destaque, deleted, quantidade, tipoId, marcaId, fotoDescricao, fotos } = req.body
  const codigo = req.file?.buffer.toString("base64")

  let destaqueBoolean: boolean = true

  if (destaque === 'true') {
    destaqueBoolean = true;
  } else if (destaque === 'false') {
    destaqueBoolean = false;
  }

  if (!nome || !preco || !cor || !tamanho || !marcaId || !descricao || !quantidade || !tipoId) {
    res.status(400).json({ "erro": "Informe todos os dados corretamente" })
    return
  }

  if (fotos) {
    try {
      const produto = await prisma.produto.create({
        data: {
          nome,
          preco,
          cor,
          tamanho,
          descricao,
          destaque,
          deleted,
          quantidade,
          marcaId,
          tipoId,
          fotos: {
            create: fotos.map((fotos: { descricao: any; codigoFoto: any }) => ({
              descricao: fotos.descricao,
              codigoFoto: fotos.codigoFoto,
            }))
          }
        }
      })
      res.status(201).json(produto)
    } catch (error) {
      console.log(error)
      res.status(400).json(error)
    }
  } else {

    try {
      // if(!codigo){
      //   res.status(400).json({ "erro": "Foto codigo" })
      //   return
      // }
      const produto = await prisma.produto.create({
        data: {
          nome,
          preco,
          cor,
          tamanho,
          descricao,
          destaque: destaqueBoolean,
          deleted,
          quantidade: Number(quantidade),
          marcaId: Number(marcaId),
          tipoId: Number(tipoId),
          fotos: {
            create: [{
              descricao: fotoDescricao,
              codigoFoto: codigo as string
            }]
          }
        }
      })
      res.status(201).json(produto)
    } catch (error) {
      console.log(error)
      res.status(400).json(error)
    }
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
  const { nome, preco, cor, tamanho, descricao, destaque, deleted, quantidade, tipoId, fotos, marcaId } = req.body

  if (!nome || !preco || !cor || !tamanho || !marcaId || !descricao || !quantidade || !tipoId) {
    res.status(400).json({ "erro": "Informe todos os dados corretamente" })
    return
  }

  try {
    const carro = await prisma.produto.update({
      where: { id: Number(id) },
      data: { nome, preco, cor, tamanho, descricao, destaque, deleted, quantidade, tipoId, fotos, marcaId }
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
          tipo: true,
          marca: true
        },
        where: {
          OR: [
            { nome: { contains: termo } },
            { tipo: { nome: termo } },
            { cor: { contains: termo } },
            { marca: { nome: { contains: termo } } },
            { tipo: { nome: { contains: termo } } }

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
            { preco: { lte: termoNumero } },

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
      where: { id: Number(id) },
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