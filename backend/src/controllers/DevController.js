const axios = require('axios')
const  Dev = require('../models/Dev')
const parseStringAsArray = require('../utils/parseStirngAsArray')
const { findConnections, sendMenssage } = require('../webSocket')

// Index: mostrar lista
// Show: mostrar único
// Store: criar
// Update: modificar
// Destroy: deletar

module.exports = {

    async index ( request, response ) {
        const devs = await Dev.find()

        return response.json(devs)
    },

    async store (request, response) {

        const { github_username, techs, latitude, longitude } = request.body

        let dev = await Dev.findOne({ github_username })

        if (!dev){

            const apiresponse = await axios.get(`https://api.github.com/users/${github_username}`)

            const {name = login, avatar_url, bio} = apiresponse.data
    
            const techsArray = parseStringAsArray(techs)

            const location = {
                type: 'Point',
                coordinates: [ longitude, latitude ]
            }

            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
            })

            const sendSocketMenssageTo = findConnections(
                { latitude, longitude },
                techsArray,
            )

            sendMenssage(sendSocketMenssageTo, 'new-dev', dev)
        }

        return response.json(dev)
    },

    async update (request, response) {

        const { github_username, name, avatar_url, bio, techs, latitude, longitude } = request.body

        let dev = await Dev.findOne({ github_username })

        if (dev) {
            
            const techsArray = parseStringAsArray(techs)

            const location = {
                type: 'Point',
                coordinates: [ longitude, latitude ]
            }

            await Dev.updateOne({github_username}, {
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
            })

            dev = await Dev.findOne({ github_username })

            return response.json({ mensage: `User ${github_username} updated!!!`, dev })
        } else {
            
            return response.json({ mensage: `User ${github_username} not found.` })
        }

        
    },

    async destroy (request, response) {

        const { github_username }= request.body

        let dev = await Dev.findOne({ github_username })

        if(dev) {

            await Dev.deleteOne({ github_username })
            
            return response.json({ mensage: `${github_username}, deleted.` })
        } else {

            return response.json({ mensage: `User ${github_username} not found.` })
        }
    }
}