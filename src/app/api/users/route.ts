import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('id')

    if (!userId) {
      return NextResponse.json(
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      )
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        books: {
          orderBy: { createdAt: 'desc' }
        },
        borrowings: {
          where: { status: 'ACTIVE' },
          include: {
            book: true
          }
        },
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 50,
          include: {
            book: {
              select: {
                title: true,
                author: true
              }
            }
          }
        },
        _count: {
          select: {
            books: true,
            borrowings: true,
            givenRatings: true,
            receivedRatings: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar usuário' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nome, email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se email já existe
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 400 }
      )
    }

    // Criar usuário (em produção, criptografar a senha)
    const user = await db.user.create({
      data: {
        name,
        email,
        password, // Em produção: await bcrypt.hash(password, 10)
        points: 0,
        averageRating: 0,
        totalRatings: 0
      }
    })

    // Remover senha do retorno
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    return NextResponse.json(
      { error: 'Erro ao criar usuário' },
      { status: 500 }
    )
  }
}