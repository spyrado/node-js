const express = require('express');

const app = express();

app.use(express.json());

const projects = [];

app.get('/projects', (request, response) => {
  const { title, owner } = request.query;
  console.log(title);
  console.log(owner);
  return response.json(projects);
});

app.post('/projects', (request, response) => {
  const { title, owner } = request.body;
  console.log(title);
  console.log(owner);
  return response.json('criado com sucesso');
});

app.put('/projects/:id', (request, response) => {
  const { id } = request.params;
  console.log(id);
  return response.json('Atualizado com sucesso');
});

app.delete('/projects/:id', (request, response) => {
  return response.json([]);
});

const PORT = 3333;
app.listen(PORT, 'localhost', () => {
  console.log(`🚀 SERVIDOR INITIALIZED AT http://localhost:${PORT}`)
});