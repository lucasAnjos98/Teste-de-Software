import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const status = searchParams.get('status')

    const books = await db.book.findMany({
      where: {
        AND: [
          status ? { status: status as any } : {},
          search ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { author: { contains: search, mode: 'insensitive' } }
            ]
          } : {}
        ]
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            avatar: true,
            averageRating: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(books)
  } catch (error) {
    console.error('Erro ao buscar livros:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar livros' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, author, description, coverImage, ownerId } = body

    if (!title || !author || !ownerId) {
      return NextResponse.json(
        { error: 'Título, autor e ID do dono são obrigatórios' },
        { status: 400 }
      )
    }

    // Criar livro
    const book = await db.book.create({
      data: {
        title,
        author,
        description,
        coverImage,
        ownerId,
        status: 'AVAILABLE'
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            avatar: true,
            averageRating: true
          }
        }
      }
    })

    // Adicionar 10 pontos ao usuário pela doação
    await db.user.update({
      where: { id: ownerId },
      data: {
        points: {
          increment: 10
        }
      }
    })

    // Registrar transação
    await db.transaction.create({
      data: {
        type: 'DONATION',
        points: 10,
        userId: ownerId,
        bookId: book.id,
        description: `Doação: ${title}`
      }
    })

    return NextResponse.json(book, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar livro:', error)
    return NextResponse.json(
      { error: 'Erro ao criar livro' },
      { status: 500 }
    )
  }
}