// Exemplo de Teste Unitário com Mock
// Sistema de Pontuação - Validação de Doação

import { db } from '@/lib/db';

// Mock do Prisma
jest.mock('@/lib/db', () => ({
  db: {
    user: {
      update: jest.fn(),
    },
    transaction: {
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

describe('Teste Unitário - Sistema de Pontuação', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Processar Doação de Livro', () => {
    test('Deve adicionar 10 pontos e registrar transação', async () => {
      // Arrange
      const userId = 'user-123';
      const bookId = 'book-456';
      const pontosAtuais = 25;
      const pontosEsperados = 35;

      // Mock do retorno do banco
      (db.user.update as jest.Mock).mockResolvedValue({
        id: userId,
        points: pontosEsperados,
      });

      (db.transaction.create as jest.Mock).mockResolvedValue({
        id: 'trans-789',
        type: 'DONATION',
        points: 10,
        userId,
        bookId,
      });

      (db.$transaction as jest.Mock).mockImplementation(async (callback) => {
        return callback({
          user: { update: db.user.update },
          transaction: { create: db.transaction.create },
        });
      });

      // Act
      const resultado = await processarDoacao(userId, bookId);

      // Assert
      expect(resultado.sucesso).toBe(true);
      expect(resultado.novosPontos).toBe(pontosEsperados);
      expect(resultado.pontosAdicionados).toBe(10);

      // Verifica se o banco foi chamado corretamente
      expect(db.$transaction).toHaveBeenCalled();
      expect(db.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { points: { increment: 10 } }
      });
      expect(db.transaction.create).toHaveBeenCalledWith({
        data: {
          type: 'DONATION',
          points: 10,
          userId,
          bookId,
          description: `Doação: Livro ${bookId}`
        }
      });
    });

    test('Deve reverter transação em caso de erro no banco', async () => {
      // Arrange
      const userId = 'user-123';
      const bookId = 'book-456';
      const erroBanco = new Error('Erro de conexão');

      (db.$transaction as jest.Mock).mockRejectedValue(erroBanco);

      // Act & Assert
      await expect(processarDoacao(userId, bookId)).rejects.toThrow('Erro de conexão');
      
      // Verifica que nenhum dado foi persistido parcialmente
      expect(db.user.update).not.toHaveBeenCalled();
      expect(db.transaction.create).not.toHaveBeenCalled();
    });

    test('Deve validar parâmetros de entrada', async () => {
      // Arrange
      const userId = '';
      const bookId = 'book-456';

      // Act & Assert
      await expect(processarDoacao(userId, bookId)).rejects.toThrow('ID do usuário inválido');
      
      await expect(processarDoacao('user-123', '')).rejects.toThrow('ID do livro inválido');
    });
  });

  describe('Testes de Casos Limite', () => {
    test('Deve funcionar com valores extremos de pontos', async () => {
      // Arrange
      const userId = 'user-123';
      const bookId = 'book-456';
      
      // Mock para usuário com pontos extremos
      const casosExtremos = [
        { pontosAtuais: 0, esperado: 10 },
        { pontosAtuais: 999999, esperado: 1000009 },
        { pontosAtuais: -100, esperado: -90 }, // Edge case
      ];

      for (const caso of casosExtremos) {
        // Arrange
        (db.user.update as jest.Mock).mockResolvedValue({
          id: userId,
          points: caso.esperado,
        });

        // Act
        const resultado = await processarDoacao(userId, bookId);

        // Assert
        expect(resultado.sucesso).toBe(true);
        expect(resultado.novosPontos).toBe(caso.esperado);
      }
    });
  });
});

// Função que está sendo testada
async function processarDoacao(userId: string, bookId: string): Promise<{
  sucesso: boolean;
  novosPontos: number;
  pontosAdicionados: number;
}> {
  // Validação de entrada
  if (!userId || userId.trim() === '') {
    throw new Error('ID do usuário inválido');
  }
  if (!bookId || bookId.trim() === '') {
    throw new Error('ID do livro inválido');
  }

  try {
    const resultado = await db.$transaction(async (tx) => {
      // Atualizar pontos do usuário
      const usuarioAtualizado = await tx.user.update({
        where: { id: userId },
        data: { points: { increment: 10 } }
      });

      // Registrar transação
      await tx.transaction.create({
        data: {
          type: 'DONATION',
          points: 10,
          userId,
          bookId,
          description: `Doação: Livro ${bookId}`
        }
      });

      return usuarioAtualizado;
    });

    return {
      sucesso: true,
      novosPontos: resultado.points,
      pontosAdicionados: 10
    };

  } catch (error) {
    throw error; // Propaga o erro para ser tratado pelo chamador
  }
}