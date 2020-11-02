const express = require('express');
const { uuid } = require('uuidv4');

const app = express();

app.use(express.json());

let projects = [];

app.get('/projects', (request, response) => {
  const { title } = request.query;
  const results = title
    ? projects.filter(project => project.title.includes(title))
    : projects;
  return response.json(results);
});

app.post('/projects', (request, response) => {
  const { title, owner } = request.body;
  const project = { id: uuid(), title, owner };
  projects.push(project);
  return response.json(project);
});

app.put('/projects/:id', (request, response) => {
  const { id } = request.params;
  const { title, owner } = request.body;
  const projectIndex = projects.findIndex(project => project.id === id);
  if (projectIndex < 0) { return response.status(400).json({ error: 'Projeto não encontrado.' }); }
  const project = { id, title, owner };
  projects[projectIndex] = project;
  return response.json({ message: 'Projeto atualizado com sucesso!' });
});

app.delete('/projects/:id', (request, response) => {
  const { id } = request.params;
  const projectIndex = projects.findIndex(project => project.id === id);
  if (projectIndex < 0) { return response.status(400).json({ error: 'Projeto não encontrado.' }); }
  projects.splice(projectIndex, 1);
  return response.json({ message: 'Projeto deletado com sucesso!' });
});

const PORT = 3000;
app.listen(PORT, 'localhost', () => {
  console.log(`🚀 SERVIDOR INITIALIZED AT http://localhost:${PORT}`);
});