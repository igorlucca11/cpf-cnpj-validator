# Validador de CPF/CNPJ

Projeto completo com:
- Frontend: Vite + React + Tabler
- Backend: Node.js + Express (em desenvolvimento)
- Dockerização
- Testes automatizados

## ⚠️ Status Atual
**Apenas o Frontend está disponível para uso no momento**. O Backend está em desenvolvimento e será integrado em breve.

## Como executar

### Pré-requisitos
- Docker e Docker Compose instalados
- Acesso ao terminal

### Comandos Principais

| Comando       | Descrição                                                                 |
|---------------|---------------------------------------------------------------------------|
| `make dev`    | Inicia frontend e backend em modo desenvolvimento                        |
| `make frontend`| Inicia apenas o frontend (recomendado no momento)                       |
| `make down`   | Para todos os containers em execução                                    |

> **Nota**: Os comandos `make backend` e `make prod` estarão disponíveis quando o backend for concluído.

### 🔧 Configuração

Você pode customizar a porta do frontend:

```bash
make FRONTEND_PORT=5000 frontend
```

### 📌 Exemplo Básico

1. Iniciar apenas o frontend (recomendado):
```bash
make frontend
```

2. Acessar:
- Frontend: http://localhost:5173

3. Parar serviços:
```bash
make down
```

## Próximas Atualizações
- Integração completa com backend
- Validação real de CPF/CNPJ
- API funcional
- Comandos `make backend` e `make prod` habilitados