const { Router } = require('express')
const DevController = require ('./controllers/DevController')
const SearchController = require ('./controllers/SearchController')


const routes = Router()

// Métodos HTTP:
// GET: obter
// PUT: alterar
// POST: criar
// DELETE: deletar

// Tipos de parametros:
// Query Params: request.query (Filtros, paginação, ordenação ...)
// Route Params: request.params (Identificar um recurso na alteração ou remoção)
// Body: request.body (Dados para criação ou alteração de um registro)

// MongoDB (banco de dados não relacional)

routes.get('/devs', DevController.index)
routes.post('/devs' , DevController.store)

routes.get('/search', SearchController.index)

routes.put('/update', DevController.update)

routes.delete('/delete', DevController.destroy)

module.exports = routes