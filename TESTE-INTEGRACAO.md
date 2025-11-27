// Exemplo de Teste de Integração de Componentes
// API + Database + Frontend Integration

import request from 'supertest';
import { app } from '../server';
import { db } from '../src/lib/db';

// Mock do banco para teste
jest.mock('../src/lib/db', () => ({
  db: {
    book: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    borrowing: {
      create: jest.fn(),
    },
    transaction: {
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

describe('Teste de Integração - API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/borrow - Processamento Completo de Empréstimo', () => {
    test('Deve processar empréstimo com sucesso - fluxo completo', async () => {
      // Arrange - Dados completos do cenário
      const bookId = 'book-123';
      const borrowerId = 'user-456';
      const lenderId = 'user-789';

      // Mock do livro disponível
      const mockBook = {
        id: bookId,
        title: 'O Senhor dos Anéis',
        author: 'J.R.R. Tolkien',
        status: 'AVAILABLE',
        ownerId: lenderId,
      };

      // Mock do usuário com pontos suficientes
      const mockBorrower = {
        id: borrowerId,
        name: 'Maria Silva',
        email: 'maria@test.com',
        points: 15, // Suficiente para empréstimo
      };

      // Mock do empréstimo criado
      const mockBorrowing = {
        id: 'borrow-999',
        bookId,
        borrowerId,
        lenderId,
        status: 'ACTIVE',
        borrowedAt: new Date(),
      };

      // Mock da transação de pontos
      const mockTransaction = {
        id: 'trans-888',
        type: 'BORROWING',
        points: -5,
        userId: borrowerId,
        bookId,
        description: 'Empréstimo: O Senhor dos Anéis',
      };

      // Configurar os mocks
      (db.book.findUnique as jest.Mock).mockResolvedValue(mockBook);
      (db.user.findUnique as jest.Mock).mockResolvedValue(mockBorrower);
      
      // Mock da transação do banco
      (db.$transaction as jest.Mock).mockImplementation(async (callback) => {
        return callback({
          borrowing: { create: jest.fn().mockResolvedValue(mockBorrowing) },
          book: { update: jest.fn() },
          user: { update: jest.fn() },
          transaction: { create: jest.fn().mockResolvedValue(mockTransaction) },
        });
      });

      // Act - Chamada à API
      const response = await request(app)
        .post('/api/borrow')
        .send({
          bookId,
          borrowerId,
        });

      // Assert - Validação da resposta HTTP
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id', mockBorrowing.id);
      expect(response.body).toHaveProperty('status', 'ACTIVE');

      // Assert - Validação das chamadas ao banco
      expect(db.book.findUnique).toHaveBeenCalledWith({
        where: { id: bookId },
        include: { owner: true }
      });

      expect(db.user.findUnique).toHaveBeenCalledWith({
        where: { id: borrowerId }
      });

      expect(db.$transaction).toHaveBeenCalled();

      // Assert - Validação das operações dentro da transação
      const mockTx = (db.$transaction as jest.Mock).mock.calls[0][0];
      
      expect(mockTx.borrowing.create).toHaveBeenCalledWith({
        data: {
          bookId,
          borrowerId,
          lenderId,
          status: 'ACTIVE',
        }
      });

      expect(mockTx.book.update).toHaveBeenCalledWith({
        where: { id: bookId },
        data: { status: 'BORROWED' }
      });

      expect(mockTx.user.update).toHaveBeenCalledWith({
        where: { id: borrowerId },
        data: { points: { decrement: 5 } }
      });

      expect(mockTx.transaction.create).toHaveBeenCalledWith({
        data: {
          type: 'BORROWING',
          points: -5,
          userId: borrowerId,
          bookId,
          description: 'Empréstimo: O Senhor dos Anéis',
        }
      });
    });

    test('Deve rejeitar empréstimo com saldo insuficiente - fluxo completo', async () => {
      // Arrange
      const bookId = 'book-123';
      const borrowerId = 'user-456';

      const mockBook = {
        id: bookId,
        title: '1984',
        author: 'George Orwell',
        status: 'AVAILABLE',
        ownerId: 'user-789',
      };

      // Mock do usuário com pontos insuficientes
      const mockBorrower = {
        id: borrowerId,
        name: 'João Silva',
        email: 'joao@test.com',
        points: 3, // Insuficiente (mínimo = 5)
      };

      (db.book.findUnique as jest.Mock).mockResolvedValue(mockBook);
      (db.user.findUnique as jest.Mock).mockResolvedValue(mockBorrower);

      // Act
      const response = await request(app)
        .post('/api/borrow')
        .send({
          bookId,
          borrowerId,
        });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Pontos insuficientes. Você precisa de pelo menos 5 pontos.');

      // Assert - Não deve executar transação
      expect(db.$transaction).not.toHaveBeenCalled();
    });

    test('Deve rejeitar empréstimo de próprio livro', async () => {
      // Arrange
      const bookId = 'book-123';
      const borrowerId = 'user-456'; // Mesmo dono do livro

      const mockBook = {
        id: bookId,
        title: 'Dom Quixote',
        author: 'Miguel de Cervantes',
        status: 'AVAILABLE',
        ownerId: borrowerId, // Mesmo ID
      };

      const mockBorrower = {
        id: borrowerId,
        name: 'Pedro Costa',
        email: 'pedro@test.com',
        points: 20,
      };

      (db.book.findUnique as jest.Mock).mockResolvedValue(mockBook);
      (db.user.findUnique as jest.Mock).mockResolvedValue(mockBorrower);

      // Act
      const response = await request(app)
        .post('/api/borrow')
        .send({
          bookId,
          borrowerId,
        });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Você não pode pegar seu próprio livro emprestado.');

      expect(db.$transaction).not.toHaveBeenCalled();
    });
  });

  describe('GET /api/books - Busca e Filtros', () => {
    test('Deve retornar livros disponíveis com busca', async () => {
      // Arrange
      const mockBooks = [
        {
          id: 'book-1',
          title: 'O Senhor dos Anéis',
          author: 'J.R.R. Tolkien',
          status: 'AVAILABLE',
          owner: {
            id: 'user-1',
            name: 'João Silva',
            avatar: null,
            averageRating: 4.5,
          },
        },
        {
          id: 'book-2',
          title: 'A Guerra dos Tronos',
          author: 'George R.R. Martin',
          status: 'AVAILABLE',
          owner: {
            id: 'user-2',
            name: 'Maria Santos',
            avatar: null,
            averageRating: 4.8,
          },
        },
      ];

      (db.book.findMany as jest.Mock).mockResolvedValue(mockBooks);

      // Act
      const response = await request(app)
        .get('/api/books')
        .query({ 
          search: 'Senhor',
          status: 'AVAILABLE' 
        });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].title).toBe('O Senhor dos Anéis');
      expect(response.body[0].owner.name).toBe('João Silva');

      // Assert - Validação da query do banco
      expect(db.book.findMany).toHaveBeenCalledWith({
        where: {
          AND: [
            { status: 'AVAILABLE' },
            {
              OR: [
                { title: { contains: 'Senhor', mode: 'insensitive' } },
                { author: { contains: 'Senhor', mode: 'insensitive' } }
              ]
            }
          ]
        },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              avatar: true,
              averageRating: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    });

    test('Deve retornar array vazio para busca sem resultados', async () => {
      // Arrange
      (db.book.findMany as jest.Mock).mockResolvedValue([]);

      // Act
      const response = await request(app)
        .get('/api/books')
        .query({ search: 'LivroInexistente' });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('Testes de Concorrência', () => {
    test('Deve handle múltiplas requisições simultâneas', async () => {
      // Arrange
      const bookId = 'book-popular';
      const borrowers = ['user-1', 'user-2', 'user-3'];

      const mockBook = {
        id: bookId,
        title: 'Livro Popular',
        status: 'AVAILABLE',
        ownerId: 'owner-1',
      };

      // Mock para simular concorrência
      let callCount = 0;
      (db.$transaction as jest.Mock).mockImplementation(async (callback) => {
        callCount++;
        // Simula que apenas a primeira transação succeeds
        if (callCount === 1) {
          return callback({
            borrowing: { create: jest.fn().mockResolvedValue({ id: 'borrow-1' }) },
            book: { update: jest.fn() },
            user: { update: jest.fn() },
            transaction: { create: jest.fn() },
          });
        } else {
          throw new Error('Livro não está mais disponível');
        }
      });

      (db.book.findUnique as jest.Mock).mockResolvedValue(mockBook);
      (db.user.findUnique as jest.Mock).mockResolvedValue({ points: 20 });

      // Act - Requisições simultâneas
      const promises = borrowers.map(borrowerId =>
        request(app)
          .post('/api/borrow')
          .send({ bookId, borrowerId })
      );

      const results = await Promise.allSettled(promises);

      // Assert
      expect(results[0].status).toBe('fulfilled');
      expect(results[1].status).toBe('rejected');
      expect(results[2].status).toBe('rejected');

      // Primeira requisição deve ser bem-sucedida
      expect(results[0].value.status).toBe(201);
      
      // Demais devem ser rejeitadas
      expect(results[1].reason.response.status).toBe(400);
      expect(results[2].reason.response.status).toBe(400);
    });
  });
});

// Funções auxiliares para os testes
function criarUsuarioComPontos(pontos: number) {
  return {
    id: `user-${Math.random()}`,
    name: 'Usuário Teste',
    email: 'test@example.com',
    points,
  };
}

function criarLivroDisponivel(ownerId: string) {
  return {
    id: `book-${Math.random()}`,
    title: 'Livro Teste',
    author: 'Autor Teste',
    status: 'AVAILABLE',
    ownerId,
  };
}
