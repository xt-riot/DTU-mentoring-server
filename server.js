const http = require('http')
const fs = require('fs/promises')

const tokens = {
    thanos: '6719b600-d193-11ee-9b7b-f9f1064b3430',
    avengers: '7dbb830-d193-11ee-9b7b-f9f1064b3430'
}

const avengersArray = [
    'Iron Man',
    'Captain America',
    'Thor',
    'Hulk',
    'Black Widow',
    'Hawkeye',
    'Scarlet Witch',
    'Vision',
    'Black Panther',
    'Spider-Man'
]

const server = http.createServer(async (req, res) => {
    if (req.method === 'OPTIONS') {
        res.writeHead(200, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Max-Age": "86400"
        })
        return res.end()
    }

    // Set CORS headers for regular requests
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST");
    res.setHeader("Access-Control-Allow-Headers", "*");

    if (!req.url || !req.headers.host) {
        res.writeHead(400)
        return res.end('Bad Request')
    }

    const page = new URL(req.url, `http://${req.headers.host}`).pathname
    const params = new URLSearchParams(req.url.split('?')[1])

    if (page === '/form.html') {
        const file = await fs.readFile('form.html')
        res.writeHead(200, { "Content-type": "text/html", "access-control-allow-origin": "*" })
        res.write(file)
        res.end()
        return
    }

    if (page === '/main.js') {
        const file = await fs.readFile('main.js')
        res.writeHead(200, { "Content-type": "application/javascript", "access-control-allow-origin": "*" })
        res.write(file)
        res.end()
        return
    }

    if (page === '/favicon.ico') {
        res.writeHead(200)
        res.end()
        return
    }
    if (page === '/login') {
        if (req.method !== 'POST') {
            res.writeHead(405)
            res.end('Method Not Allowed')
            return
        }

        let body = ''
        req.on('data', chunk => {
            body += chunk.toString()
        })
        req.on('end', () => {
            const data = JSON.parse(body)
            if (data.username === 'thanos' && data.password === 'thanos') {
                res.writeHead(200, { "Content-type": "application/json", "access-control-allow-origin": "*", "set-cookie": `token=${tokens.thanos}` })
                res.write(JSON.stringify({ role: 'Thanos' }))
                res.end()
                return
            } else if (data.username === 'avengers' && data.password === 'avengers') {
                res.writeHead(200, { "Content-type": "application/json", "access-control-allow-origin": "*", "set-cookie": `token=${tokens.avengers}` })
                res.write(JSON.stringify({ role: 'Avengers' }))
                res.end()
                return
            }
            res.writeHead(401)
            res.end('Unauthorized')
            return
        })
    }

    if (page === '/whosAvenger') {
        if (req.method !== 'GET') {
            res.writeHead(405)
            return res.end('Method Not Allowed')
        }
        if (req.headers.cookie == `token=${tokens.thanos}`) {
            res.writeHead(200, { "Content-type": "application/json" })
            console.log('thanos', req.headers.cookie);
            return res.end(JSON.stringify({ avengers: avengersArray.slice(0, 5) }))
        }

        if (req.headers.cookie = `token=${tokens.avengers}`) {
            console.log('avengers', req.headers.cookie);
            res.writeHead(200, { "Content-type": "application/json" })
            return res.end(JSON.stringify({ avengers: avengersArray }))
        }
        res.writeHead(401)
        return res.end('Unauthorized')
    }

    if (page === '/getPositions') {
        if (req.method !== 'GET') {
            res.writeHead(405)
            return res.end('Method Not Allowed')
        }
        if (req.headers.cookie === `token=${tokens.avengers}`) {
            res.writeHead(200, { "Content-type": "application/json" })
            return res.end(JSON.stringify({
                username: ['X', 'Y'],
                email: ['X', 'Y'],
                password: ['X', 'Y'],
                userNameLabel: ['X', 'Y'],
                emailLabel: ['X', 'Y'],
                passwordLabel: ['X', 'Y'],
                submitButton: ['X', 'Y']
            }))
        }

        if (req.headers.cookie === `token=${tokens.thanos}`) {
            res.writeHead(200, { "Content-type": "application/json" })
            return res.end(JSON.stringify({
                username: ['X', 'Y'],
                email: ['X', 'Y'],
                password: ['X', 'Y'],
                userNameLabel: ['X', 'Y'],
                emailLabel: ['X', 'Y'],
                passwordLabel: ['X', 'Y'],
                submitButton: ['X', 'Y']
            }))
        
        }
        res.writeHead(401)
        return res.end('Unauthorized')
    }
})

server.listen(3000, () => {
    console.log('Server is running on port 3000')
})