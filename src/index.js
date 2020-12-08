const express = require('express')
const app = express()
const port = 3000

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => {
  res.send(`
<script type="text/javascript" >
const display = (log) => {
  const textArea = document.getElementById("log")
  textArea.innerHTML = ""
  const rollText = log.map(({ name, rolled, die }) => document.createTextNode(\`\$\{name\} rolled \$\{die\} for \$\{rolled\}.\n\`))
  rollText.forEach((textNode) => {
    textArea.appendChild(textNode)
    textArea.appendChild( document.createElement("br"))
  })
}

const getName = () => document.getElementById("name").value

const roll = (n) => {
  const name = getName()
  const request = new Request('/roll', {
    method: 'POST',
    body: JSON.stringify({ die: n, name }),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  })

  fetch(request)
    .then(response => {
      if (response.status === 200) {
        return response.json()
      } else {
        throw new Error('Something went wrong on api server!')
      }
    })
    .then(({ log }) => {
      display(log)
    }).catch(error => {
      console.log(error)
    })
}

const poll = () => {
  const request = new Request('/poll', {
    method: 'GET',
  })

  fetch(request)
    .then(response => {
      if (response.status === 200) {
        return response.json()
      } else {
        throw new Error('Something went wrong on api server!')
      }
    })
    .then(({ log }) => {
      display(log)
    }).catch(error => {
      console.log(error)
    })
}

const clearLog = () => {
  const request = new Request('/clearLog', {
    method: 'POST',
  })

  fetch(request)
    .then(response => {
      if (response.status === 200) {
        return response.json()
      } else {
        throw new Error('Something went wrong on api server!')
      }
    })
    .then(({ log }) => {
      display(log)
    }).catch(error => {
      console.log(error)
    })
}

poll()
setInterval(poll, 1000)

</script>
<div>  <label for="name">Enter your name:</label> </div>
<div>
   <input id="name" type=text />
   <input type="button" value="Roll D20" onClick='roll("d20")' id='roller' />
   <input type="button" value="Roll D8" onClick='roll("d8")' id='roller' />
   <input type="button" value="Roll D6" onClick='roll("d6")' id='roller' />
   <input type="button" value="Clear Log" onClick='clearLog();poll()' id='roller' />
   <div id="log" />
</div>`)
})

let rollLog = []

app.post('/roll', (req, res) => {
  const { body: { die, name } } = req
  const rolled = roll(die)
  const time = getTime()
  rollLog.push({ name, rolled, die })
  res.send({result: rolled, log: rollLog})
})

app.get('/poll', (req, res) => {
  res.send({log: rollLog})
})

app.post('/clearLog', (req, res) => {
clearLog()
})

const roll = (n) => {
  [rolls, outOf] = n.split('d')
  console.log(rolls)
  return Math.floor(Math.random() * Math.floor(parseInt(outOf))) + 1
}

const clearLog = () => {
  rollLog = [];
}

const getTime = () => {
  const dateNow = new Date()
  return dateNow.getHours() + ":" + dateNow.getMinutes()
}


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
