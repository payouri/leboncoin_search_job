const fastify = require('fastify')
const search = require('./search')
// const { readFile } = require('fs/promises')
const path = require('path')
const fastifyStatic = require('fastify-static')



const server = fastify({
    // logger: true
})

// const HTMLIndex = readFile('/public/index.html')

// server.get('/build/search.json', async (req, res) => {

// })

server.register(fastifyStatic, {
    root: path.join(__dirname, '../build/')
})


server.get('*', async (req, res) => {
    await res.sendFile(path.join(__dirname, '../build/index.html'))
})

// console.log(process.env)

const main = async () => {
    const request = async () => {
        try {
            await search();
        } catch (err) {
            console.log('search failed retrying in 30 minutes')
            setTimeout(request, 30 * 60 * 1000)
        }
    }
    request()
    await server.listen(process.env.PORT || 3000, '0.0.0.0')
    console.log(`server listening on port ${server.server.address().port}`)
}

main()