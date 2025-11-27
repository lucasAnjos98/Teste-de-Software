// Teste de API Completo
// Endpoint: POST /api/books - Cadastro de Livros

import request from 'supertest';
import { app } from '../server';
import { db } from '../src/lib/db';

describe('Teste de API - Cadastro de Livros', () => {
  let authToken: string;
  let testUserId: string;

  beforeAll(async () => {
    // Setup: Criar usuário e obter token de autenticação
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

    testUserId = userResponse.body.id;

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    // Cleanup: Remover usuário de teste
    await db.user.delete({
      where: { id: testUserId }
    });
  });

  describe('POST /api/books', () => {
    describe('Casos de Sucesso', () => {
      test('TC-01: Deve cadastrar livro com dados válidos', async () => {
        // Arrange
        const bookData = {
          title: 'O Senhor dos Anéis',
          author: 'J.R.R. Tolkien',
          description: 'Uma jornada épica pela Terra Média',
          coverImage: 'https://example.com/capa.jpg'
        };

        // Act
        const response = await request(app)
          .post('/api/books')
          .set('Authorization', `Bearer ${authToken}`)
          .send(bookData);

        // Assert
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
          id: expect.any(String),
          title: bookData.title,
          author: bookData.author,
          description: bookData.description,
          coverImage: bookData.coverImage,
          status: 'AVAILABLE',
          ownerId: testUserId,
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        });

        // Verificar se o livro foi salvo no banco
        const savedBook = await db.book.findUnique({
          where: { id: response.body.id }
        });
        expect(savedBook).toBeTruthy();
        expect(savedBook.title).toBe(bookData.title);
      });

      test('TC-02: Deve adicionar 10 pontos ao usuário após cadastro', async () => {
        // Arrange
        const bookData = {
          title: '1984',
          author: 'George Orwell',
          description: 'Distopia clássica'
        };

        // Obter pontos antes do cadastro
        const userBefore = await db.user.findUnique({
          where: { id: testUserId }
        });

        // Act
        const response = await request(app)
          .post('/api/books')
          .set('Authorization', `Bearer ${authToken}`)
          .send(bookData);

        // Assert
        expect(response.status).toBe(201);

        // Verificar pontos após o cadastro
        const userAfter = await db.user.findUnique({
          where: { id: testUserId }
        });

        expect(userAfter.points).toBe(userBefore.points + 10);
      });

      test('TC-03: Deve registrar transação de doação', async () => {
        // Arrange
        const bookData = {
          title: 'Dom Quixote',
          author: 'Miguel de Cervantes'
        };

        // Act
        const response = await request(app)
          .post('/api/books')
          .set('Authorization', `Bearer ${authToken}`)
          .send(bookData);

        // Assert
        expect(response.status).toBe(201);

        // Verificar se a transação foi registrada
        const transaction = await db.transaction.findFirst({
          where: {
            userId: testUserId,
            bookId: response.body.id,
            type: 'DONATION'
          }
        });

        expect(transaction).toBeTruthy();
        expect(transaction.points).toBe(10);
        expect(transaction.description).toContain('Doação: Dom Quixote');
      });
    });

    describe('Casos de Erro - Validação', () => {
      test('TC-04: Deve rejeitar cadastro sem título', async () => {
        // Arrange
        const bookData = {
          author: 'Autor Teste',
          description: 'Descrição teste'
        };

        // Act
        const response = await request(app)
          .post('/api/books')
          .set('Authorization', `Bearer ${authToken}`)
          .send(bookData);

        // Assert
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Título é obrigatório');
      });

      test('TC-05: Deve rejeitar cadastro sem autor', async () => {
        // Arrange
        const bookData = {
          title: 'Livro Teste',
          description: 'Descrição teste'
        };

        // Act
        const response = await request(app)
          .post('/api/books')
          .set('Authorization', `Bearer ${authToken}`)
          .send(bookData);

        // Assert
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Autor é obrigatório');
      });

      test('TC-06: Deve rejeitar título muito longo', async () => {
        // Arrange
        const bookData = {
          title: 'A'.repeat(300), // Título muito longo
          author: 'Autor Teste'
        };

        // Act
        const response = await request(app)
          .post('/api/books')
          .set('Authorization', `Bearer ${authToken}`)
          .send(bookData);

        // Assert
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Título deve ter no máximo 200 caracteres');
      });

      test('TC-07: Deve rejeitar autor muito longo', async () => {
        // Arrange
        const bookData = {
          title: 'Livro Teste',
          author: 'B'.repeat(150) // Autor muito longo
        };

        // Act
        const response = await request(app)
          .post('/api/books')
          .set('Authorization', `Bearer ${authToken}`)
          .send(bookData);

        // Assert
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Autor deve ter no máximo 100 caracteres');
      });
    });

    describe('Casos de Erro - Autenticação', () => {
      test('TC-08: Deve rejeitar cadastro sem token', async () => {
        // Arrange
        const bookData = {
          title: 'Livro Teste',
          author: 'Autor Teste'
        };

        // Act
        const response = await request(app)
          .post('/api/books')
          .send(bookData);

        // Assert
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error', 'Token de autenticação não fornecido');
      });

      test('TC-09: Deve rejeitar cadastro com token inválido', async () => {
        // Arrange
        const bookData = {
          title: 'Livro Teste',
          author: 'Autor Teste'
        };

        // Act
        const response = await request(app)
          .post('/api/books')
          .set('Authorization', 'Bearer token-invalido')
          .send(bookData);

        // Assert
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error', 'Token de autenticação inválido');
      });

      test('TC-10: Deve rejeitar cadastro com token expirado', async () => {
        // Arrange
        const bookData = {
          title: 'Livro Teste',
          author: 'Autor Teste'
        };

        // Act
        const response = await request(app)
          .post('/api/books')
          .set('Authorization', 'Bearer expired-token')
          .send(bookData);

        // Assert
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error', 'Token de autenticação expirado');
      });
    });

    describe('Casos de Erro - Validação de Imagem', () => {
      test('TC-11: Deve aceitar URL de imagem válida', async () => {
        // Arrange
        const bookData = {
          title: 'Livro com Capa',
          author: 'Autor Teste',
          coverImage: 'https://example.com/valid-image.jpg'
        };

        // Act
        const response = await request(app)
          .post('/api/books')
          .set('Authorization', `Bearer ${authToken}`)
          .send(bookData);

        // Assert
        expect(response.status).toBe(201);
        expect(response.body.coverImage).toBe(bookData.coverImage);
      });

      test('TC-12: Deve rejeitar URL de imagem inválida', async () => {
        // Arrange
        const bookData = {
          title: 'Livro com Capa',
          author: 'Autor Teste',
          coverImage: 'url-invalida'
        };

        // Act
        const response = await request(app)
          .post('/api/books')
          .set('Authorization', `Bearer ${authToken}`)
          .send(bookData);

        // Assert
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'URL da imagem inválida');
      });

      test('TC-13: Deve aceitar upload de arquivo de imagem', async () => {
        // Arrange
        const bookData = {
          title: 'Livro com Upload',
          author: 'Autor Teste'
        };

        // Act
        const response = await request(app)
          .post('/api/books')
          .set('Authorization', `Bearer ${authToken}`)
          .field('title', bookData.title)
          .field('author', bookData.author)
          .attach('coverImage', Buffer.from('fake-image-data'), 'test-cover.jpg');

        // Assert
        expect(response.status).toBe(201);
        expect(response.body.coverImage).toContain('test-cover.jpg');
      });
    });

    describe('Testes de Performance', () => {
      test('TC-14: Deve responder em menos de 1 segundo', async () => {
        // Arrange
        const bookData = {
          title: 'Livro Performance Test',
          author: 'Autor Performance'
        };

        // Act
        const startTime = Date.now();
        const response = await request(app)
          .post('/api/books')
          .set('Authorization', `Bearer ${authToken}`)
          .send(bookData);
        const endTime = Date.now();

        // Assert
        expect(response.status).toBe(201);
        expect(endTime - startTime).toBeLessThan(1000); // Menos de 1 segundo
      });

      test('TC-15: Deve handle 100 requisições simultâneas', async () => {
        // Arrange
        const bookData = {
          title: 'Livro Concorrência',
          author: 'Autor Concorrência'
        };

        // Act
        const promises = Array.from({ length: 100 }, (_, i) =>
          request(app)
            .post('/api/books')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
              ...bookData,
              title: `${bookData.title} ${i}` // Título único
            })
        );

        const startTime = Date.now();
        const results = await Promise.allSettled(promises);
        const endTime = Date.now();

        // Assert
        const successful = results.filter(r => r.status === 'fulfilled');
        expect(successful.length).toBeGreaterThan(90); // Pelo menos 90% devem ser bem-sucedidas
        expect(endTime - startTime).toBeLessThan(5000); // Menos de 5 segundos para todas
      });
    });

    describe('Testes de Segurança', () => {
      test('TC-16: Deve prevenir XSS no título', async () => {
        // Arrange
        const xssPayload = '<script>alert("XSS")</script>';
        const bookData = {
          title: xssPayload,
          author: 'Autor Teste'
        };

        // Act
        const response = await request(app)
          .post('/api/books')
          .set('Authorization', `Bearer ${authToken}`)
          .send(bookData);

        // Assert
        expect(response.status).toBe(201);
        expect(response.body.title).not.toContain('<script>');
        expect(response.body.title).toBe(xssPayload); // Deve ser sanitizado
      });

      test('TC-17: Deve prevenir SQL Injection', async () => {
        // Arrange
        const sqlInjectionPayload = "'; DROP TABLE books; --";
        const bookData = {
          title: sqlInjectionPayload,
          author: 'Autor Teste'
        };

        // Act
        const response = await request(app)
          .post('/api/books')
          .set('Authorization', `Bearer ${authToken}`)
          .send(bookData);

        // Assert
        // Não deve causar erro de servidor
        expect(response.status).toBe(400); // Deve falhar na validação
        expect(response.body).toHaveProperty('error');

        // Verificar que a tabela books ainda existe
        const booksCount = await db.book.count();
        expect(booksCount).toBeGreaterThan(0);
      });

      test('TC-18: Deve limitar requisições por IP', async () => {
        // Arrange
        const bookData = {
          title: 'Rate Limit Test',
          author: 'Rate Limit Author'
        };

        // Act - Enviar 100 requisições rapidamente
        const promises = Array.from({ length: 100 }, () =>
          request(app)
            .post('/api/books')
            .set('Authorization', `Bearer ${authToken}`)
            .send(bookData)
        );

        const results = await Promise.allSettled(promises);

        // Assert
        const rejected = results.filter(r => r.status === 'rejected');
        expect(rejected.length).toBeGreaterThan(50); // Rate limiting deve bloquear mais de 50%
      });
    });
  });

  describe('Testes de Integração com Outros Serviços', () => {
    test('TC-19: Deve notificar serviço de notificações', async () => {
      // Mock do serviço de notificações
      const notificationService = {
        sendNotification: jest.fn()
      };

      // Arrange
      const bookData = {
        title: 'Livro com Notificação',
        author: 'Autor Notificação'
      };

      // Act
      const response = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${authToken}`)
        .send(bookData);

      // Assert
      expect(response.status).toBe(201);
      
      // Verificar se a notificação foi enviada
      // (Este teste assume que há integração com serviço de notificações)
      expect(notificationService.sendNotification).toHaveBeenCalledWith({
        userId: testUserId,
        type: 'BOOK_REGISTERED',
        message: 'Seu livro foi cadastrado com sucesso!',
        data: response.body
      });
    });

    test('TC-20: Deve registrar evento de analytics', async () => {
      // Mock do serviço de analytics
      const analyticsService = {
        trackEvent: jest.fn()
      };

      // Arrange
      const bookData = {
        title: 'Livro Analytics',
        author: 'Autor Analytics'
      };

      // Act
      const response = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${authToken}`)
        .send(bookData);

      // Assert
      expect(response.status).toBe(201);
      
      // Verificar se o evento foi registrado
      expect(analyticsService.trackEvent).toHaveBeenCalledWith({
        event: 'book_registered',
        userId: testUserId,
        properties: {
          bookId: response.body.id,
          title: bookData.title,
          author: bookData.author
        }
      });
    });
  });
});

// Helper functions para os testes
function gerarTokenValido(userId: string): string {
  return `valid-token-${userId}`;
}

function gerarTokenExpirado(): string {
  return 'expired-token-12345';
}

function criarImagemTeste(): Buffer {
  return Buffer.from('fake-image-data-for-testing');
}
