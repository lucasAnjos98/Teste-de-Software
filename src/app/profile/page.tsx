'use client'

import { useState, useEffect } from 'react'
import { User, Book, Star, Award, TrendingUp, Calendar, MessageCircle, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'

interface UserProfile {
  id: string
  name: string
  email: string
  points: number
  avatar?: string
  bio?: string
  averageRating: number
  totalRatings: number
  createdAt: string
}

interface BookItem {
  id: string
  title: string
  author: string
  coverImage?: string
  status: string
  createdAt: string
}

interface Transaction {
  id: string
  type: string
  points: number
  description: string
  createdAt: string
  book?: {
    title: string
    author: string
  }
}

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [myBooks, setMyBooks] = useState<BookItem[]>([])
  const [borrowedBooks, setBorrowedBooks] = useState<BookItem[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    // Mock data para demonstração
    const mockUser: UserProfile = {
      id: '1',
      name: 'Ana Oliveira',
      email: 'ana@exemplo.com',
      points: 45,
      bio: 'Amante de literatura e compartilhamento de conhecimento.',
      averageRating: 4.7,
      totalRatings: 12,
      createdAt: '2024-01-15'
    }

    const mockMyBooks: BookItem[] = [
      {
        id: '1',
        title: 'O Pequeno Príncipe',
        author: 'Antoine de Saint-Exupéry',
        status: 'AVAILABLE',
        createdAt: '2024-02-10'
      },
      {
        id: '2',
        title: 'Cem Anos de Solidão',
        author: 'Gabriel García Márquez',
        status: 'BORROWED',
        createdAt: '2024-01-20'
      }
    ]

    const mockBorrowedBooks: BookItem[] = [
      {
        id: '3',
        title: '1984',
        author: 'George Orwell',
        status: 'ACTIVE',
        createdAt: '2024-02-15'
      }
    ]

    const mockTransactions: Transaction[] = [
      {
        id: '1',
        type: 'DONATION',
        points: 10,
        description: 'Doação: O Pequeno Príncipe',
        createdAt: '2024-02-10',
        book: {
          title: 'O Pequeno Príncipe',
          author: 'Antoine de Saint-Exupéry'
        }
      },
      {
        id: '2',
        type: 'BORROWING',
        points: -5,
        description: 'Empréstimo: 1984',
        createdAt: '2024-02-15',
        book: {
          title: '1984',
          author: 'George Orwell'
        }
      },
      {
        id: '3',
        type: 'DONATION',
        points: 10,
        description: 'Doação: Cem Anos de Solidão',
        createdAt: '2024-01-20',
        book: {
          title: 'Cem Anos de Solidão',
          author: 'Gabriel García Márquez'
        }
      }
    ]

    setUser(mockUser)
    setMyBooks(mockMyBooks)
    setBorrowedBooks(mockBorrowedBooks)
    setTransactions(mockTransactions)
  }, [])

  const getNextLevel = (points: number) => {
    if (points < 50) return { level: 'Iniciante', next: 50, color: 'bg-green-500' }
    if (points < 100) return { level: 'Colaborador', next: 100, color: 'bg-blue-500' }
    if (points < 200) return { level: 'Dedicado', next: 200, color: 'bg-purple-500' }
    return { level: 'Mestre', next: 500, color: 'bg-orange-500' }
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
  }

  const levelInfo = getNextLevel(user.points)
  const progressPercentage = (user.points / levelInfo.next) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Book className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">BookShare</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Book className="h-4 w-4 mr-2" />
                Explorar Livros
              </Button>
              <Button variant="ghost" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                Mensagens
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Perfil Header */}
        <section className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="text-2xl">{user.name[0]}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h2>
              <p className="text-gray-600 mb-4">{user.bio}</p>
              
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-orange-600" />
                  <span className="font-semibold text-orange-800">{user.points} pontos</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{user.averageRating.toFixed(1)}</span>
                  <span className="text-gray-500">({user.totalRatings} avaliações)</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>Membro desde {new Date(user.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>
            
            <Button variant="outline" className="self-start">
              Editar Perfil
            </Button>
          </div>

          {/* Barra de Progresso de Nível */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Nível: {levelInfo.level}</span>
              <span className="text-sm text-gray-500">{user.points}/{levelInfo.next} pontos</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </section>

        {/* Estatísticas */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-700">{myBooks.length}</div>
              <div className="text-sm text-green-600">Livros Doados</div>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-700">{borrowedBooks.length}</div>
              <div className="text-sm text-blue-600">Livros Emprestados</div>
            </CardContent>
          </Card>
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-700">{user.points}</div>
              <div className="text-sm text-orange-600">Pontos Atuais</div>
            </CardContent>
          </Card>
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-700">{user.averageRating.toFixed(1)}</div>
              <div className="text-sm text-purple-600">Avaliação Média</div>
            </CardContent>
          </Card>
        </section>

        {/* Tabs de Conteúdo */}
        <Tabs defaultValue="books" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="books">Meus Livros</TabsTrigger>
            <TabsTrigger value="borrowed">Emprestados</TabsTrigger>
            <TabsTrigger value="transactions">Histórico</TabsTrigger>
          </TabsList>

          {/* Meus Livros */}
          <TabsContent value="books">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  Meus Livros Cadastrados
                </CardTitle>
                <CardDescription>
                  Livros que você disponibilizou para a comunidade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myBooks.map((book) => (
                    <div key={book.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{book.title}</h4>
                        <p className="text-sm text-gray-600">{book.author}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Cadastrado em {new Date(book.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={book.status === 'AVAILABLE' ? 'default' : 'secondary'}
                          className={book.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
                        >
                          {book.status === 'AVAILABLE' ? 'Disponível' : 'Emprestado'}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {myBooks.length === 0 && (
                    <div className="text-center py-8">
                      <Book className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Você ainda não cadastrou nenhum livro</p>
                      <Button className="mt-4 bg-green-600 hover:bg-green-700">
                        Cadastrar Primeiro Livro
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Livros Emprestados */}
          <TabsContent value="borrowed">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Livros que Peguei Emprestado
                </CardTitle>
                <CardDescription>
                  Livros que você está lendo atualmente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {borrowedBooks.map((book) => (
                    <div key={book.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{book.title}</h4>
                        <p className="text-sm text-gray-600">{book.author}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Pegue em {new Date(book.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          Em leitura
                        </Badge>
                        <Button variant="outline" size="sm">
                          Devolver
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {borrowedBooks.length === 0 && (
                    <div className="text-center py-8">
                      <Book className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Você não pegou nenhum livro emprestado ainda</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Histórico de Transações */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Histórico de Pontos
                </CardTitle>
                <CardDescription>
                  Suas transações de pontos na plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{transaction.description}</h4>
                        {transaction.book && (
                          <p className="text-sm text-gray-600">{transaction.book.title}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(transaction.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold text-lg ${
                          transaction.points > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.points > 0 ? '+' : ''}{transaction.points}
                        </div>
                        <div className="text-xs text-gray-500">
                          {transaction.type === 'DONATION' ? 'Doação' : 'Empréstimo'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}