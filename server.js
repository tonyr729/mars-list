const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.static('public'));

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Mars List';

app.get('/api/v1/items', (request, response) => {
  database('items').select()
    .then(items => {
      response.status(200).json(items);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/items', (request, response) => {
  const item = request.body;
  const itemParams = Object.keys(item)
  const requiredParams = ['name', 'isPacked']

  if (itemParams.length === requiredParams.length && itemParams.every((param,i) => param === requiredParams[i])) {
    database('items').insert(item, 'id')
      .then(itemID => {
        response.status(201).json({ id: itemID[0] })
      })
      .catch(error => {
        response.status(500).json({ error });;
      });
  } else {
    return response
      .status(422)
      .send({ error: `Expected format: { name: <String>, isPacked: <Boolean> }. You're missing a required property.` });
  }  
});

app.patch('/api/v1/items/:id', (request, response) => {
  const { item } = request.body
  const { id } = request.params
  database('items').where('id', id).update(item, 'id')
    .then(itemId => {
      response.status(202).json({ id: itemId[0] })
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

app.delete('/api/v1/items/:id', (request, response) => {
  const { id } = request.params
  database('items').where('id', id).del()
    .then(() => {
      response.sendStatus(204)
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;