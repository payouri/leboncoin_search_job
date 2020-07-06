const fastify = require('fastify')
const search = require('./search')
// const { readFile } = require('fs/promises')
const path = require('path')
const fastifyStatic = require('fastify-static')



const server = fastify({
    // logger: true
})

// const HTMLIndex = readFile('/public/index.html')

server.register(fastifyStatic, {
    root: path.join(__dirname, '../build/')
})

server.get('*', async (req, res) => {
    console.log(path.join(__dirname, '../build/index.html'))
    await res.sendFile(path.join(__dirname, '../build/index.html'))
})

console.log(process.env)

const main = async () => {
    await search();

    await server.listen(process.env.PORT || 3000)
    
    console.log(`server listening on port ${server.server.address().port}`)
}

main()