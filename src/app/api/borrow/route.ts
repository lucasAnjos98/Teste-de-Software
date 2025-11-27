import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bookId, borrowerId } = body

    if (!bookId || !borrowerId) {
      return NextResponse.json(
        { error: 'ID do livro e ID do empréstimo são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar livro e usuário
    const book = await db.book.findUnique({
      where: { id: bookId },
      include: { owner: true }
    })

    if (!book) {
      return NextResponse.json(
        { error: 'Livro não encontrado' },
        { status: 404 }
      )
    }

    if (book.status !== 'AVAILABLE') {
      return NextResponse.json(
        { error: 'Livro não está disponível para empréstimo' },
        { status: 400 }
      )
    }

    const borrower = await db.user.findUnique({
      where: { id: borrowerId }
    })

    if (!borrower) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se o usuário tem pontos suficientes
    if (borrower.points < 5) {
      return NextResponse.json(
        { error: 'Pontos insuficientes. Você precisa de pelo menos 5 pontos.' },
        { status: 400 }
      )
    }

    // Verificar se o usuário não está tentando pegar seu próprio livro
    if (book.ownerId === borrowerId) {
      return NextResponse.json(
        { error: 'Você não pode pegar seu próprio livro emprestado' },
        { status: 400 }
      )
    }

    // Iniciar transação de banco de dados
    const result = await db.$transaction(async (tx) => {
      // Criar empréstimo
      const borrowing = await tx.borrowing.create({
        data: {
          bookId,
          borrowerId,
          lenderId: book.ownerId,
          status: 'ACTIVE'
        },
        include: {
          book: true,
          borrower: true,
          lender: true
        }
      })

      // Atualizar status do livro
      await tx.book.update({
        where: { id: bookId },
        data: { status: 'BORROWED' }
      })

      // Debitar 5 pontos do empréstimo
      await tx.user.update({
        where: { id: borrowerId },
        data: {
          points: {
            decrement: 5
          }
        }
      })

      // Registrar transação de pontos
      await tx.transaction.create({
        data: {
          type: 'BORROWING',
          points: -5,
          userId: borrowerId,
          bookId,
          description: `Empréstimo: ${book.title}`
        }
      })

      return borrowing
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Erro ao processar empréstimo:', error)
    return NextResponse.json(
      { error: 'Erro ao processar empréstimo' },
      { status: 500 }
    )
  }
}