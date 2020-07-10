const lebonCoinAPI = require('./leboncoin-api')
const { readFile, writeFile, stat } = require('fs').promises
const { Search } = lebonCoinAPI
const path = require('path') 
const makeRequest = async () => {
    try {
        const s = await new Search()
            .setPage(1)
            .setQuery('renove OR neuf NOT studio OR terrasse OR balcon NOT local NOT colocation')
            // .setFilter(leboncoin.FILTERS.PARTICULIER)
            .setCategory('locations')
            .setRegion('herault')
            .setLocation([{
                zipcode: '34000'
            }])
            .setSort({
                sort_by: 'date',
                sort_order: 'desc'
            })
            .addSearchExtra('price', { max: 750 }) // will add a range of price
            .addSearchExtra('square', { min: 30 }); // will add enums for Meublé and Non meublé

        return await s.run()
    } catch (err) {
        console.warn(err)
    }
}

const saveRequest = async ({ results }) => {
    const filePath =  path.join(__dirname, 'build/search.json')
    const safePath =  path.join(__dirname, 'public/search.json')
    try {
        await stat(filePath)
    } catch (err) {
        await writeFile(filePath, JSON.stringify([]), {
            encoding: 'utf-8'
        })
    }

    try {
        await stat(safePath)
    } catch (err) {
        await writeFile(safePath, JSON.stringify([]), {
            encoding: 'utf-8'
        })
    }

    try {
        let currentContent = JSON.parse(await readFile(filePath, { encoding: 'utf-8' }))
        let currentSafeContent = JSON.parse(await readFile(safePath, { encoding: 'utf-8' }))

        results = results.filter(r => !currentContent.find(c => c.link === r.link))
        const safeResults = results.filter(r => !currentSafeContent.find(c => c.link === r.link))
        // console.log(results)
        console.log(`found ${results.length} new offers`)
        currentContent = [...results, ...currentContent]
        currentSafeContent = [...safeResults, ...currentSafeContent]

        await writeFile(filePath, JSON.stringify(currentContent), {
            encoding: 'utf-8'
        })

        await writeFile(safePath, JSON.stringify(currentSafeContent), {
            encoding: 'utf-8'
        })
    } catch (err) {
        console.warn(err)
    }

    // console.log(currentContent)

}

const main = async () => {

    await saveRequest(await makeRequest())
    console.log('places to live offers refreshed:' + (new Date).toUTCString())

    setInterval(async _ => {
        await saveRequest(await makeRequest())
        console.log('places to live offers refreshed:' + (new Date).toUTCString())
    }, 30 * 60 * 1000)

}

module.exports = main