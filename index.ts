import express from 'express'
import cors from 'cors'


import marcasRoutes from './routes/marcas'
import marcasTipo from './routes/tipos'
import produtosRoutes from './routes/produtos'
import fotosRoutes from './routes/fotos'
import teste from './routes/teste'

const app = express()
const port = 3004
const path = require('path');

app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use("/marcas", marcasRoutes)
app.use("/tipos", marcasTipo)
app.use("/produtos", produtosRoutes)
app.use("/fotos", fotosRoutes)
app.use("/teste", teste)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'image.jpg'));
})

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`)
})