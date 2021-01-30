const express = require('express');
const cors = require('cors');
const { uuid, isUuid } = require('uuidv4');

const app = express();
app.use(cors({
  origin: 'http://localhost:4200'
}));
app.use(express.json());

/**
 * middleware que loga o metodo utilizado e a rota, para cada requisição feita,
 * o middleware ele intercepta a requisicao e pode altera-la e OU travalá. 
 */
function logRequests(request, response, next) {
  const { method, url } = request;
  const logLabel = `[${method.toUpperCase()}] ${url}`;
  console.time(logLabel);
  next();
  console.timeEnd(logLabel);
}

function validateProjectId(request, response, next) {
  const { id } = request.params;

  // Quando um middleware da um return de um response, ele nem precisa chamar o next,
  // pois aqui eu já estou travando totalmente a operacao e o usuário recebeu esse erro.
  if(!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid project ID.' });
  }
  // se for um id válido eu deixo o fluxo seguir e dou um next.
  return next();
}
//usando o middleware de logs customizado.
app.use(logRequests);
//aqui eu digo que para esse rota, usar esse middleware, e se eu quiser posso adicionar mais de um.
app.use('/projects/:id', validateProjectId);

let projects = [];

app.get('/projects', logRequests, (request, response) => {
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