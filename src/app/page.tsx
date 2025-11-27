'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Book, Plus, User, Star, MessageCircle, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface BookData {
  id: string
  title: string
  author: string
  description?: string
  coverImage?: string
  status: string
  owner: {
    id: string
    name: string
    avatar?: string
    averageRating: number
  }
}

export default function Home() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [books, setBooks] = useState<BookData[]>([])
  const [userPoints, setUserPoints] = useState(0)
  const [loading, setLoading] = useState(false)

  // Mock data para demonstração
  useEffect(() => {
    const mockBooks: BookData[] = [
      {
        id: '1',
        title: 'O Senhor dos Anéis',
        author: 'J.R.R. Tolkien',
        description: 'Uma jornada épica pela Terra Média',
        status: 'AVAILABLE',
        owner: {
          id: '2',
          name: 'João Silva',
          averageRating: 4.5
        }
      },
      {
        id: '2',
        title: '1984',
        author: 'George Orwell',
        description: 'Distopia clássica sobre vigilância e controle',
        status: 'AVAILABLE',
        owner: {
          id: '3',
          name: 'Maria Santos',
          averageRating: 4.8
        }
      },
      {
        id: '3',
        title: 'Dom Quixote',
        author: 'Miguel de Cervantes',
        description: 'As aventuras do cavaleiro da triste figura',
        status: 'BORROWED',
        owner: {
          id: '4',
          name: 'Pedro Costa',
          averageRating: 4.2
        }
      }
    ]
    setBooks(mockBooks)
    setUserPoints(25)
  }, [])

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleBorrowBook = (bookId: string) => {
    if (userPoints < 5) {
      alert('Você precisa de pelo menos 5 pontos para pegar um livro emprestado!')
      return
    }
    
    // Aqui faria a chamada à API para solicitar empréstimo
    alert('Solicitação de empréstimo enviada! Você poderá combinar a entrega através das mensagens.')
  }

  const navigateTo = (path: string) => {
    router.push(path)
  }

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
              {/* Pontos do Usuário */}
              <div className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full">
                <Award className="h-5 w-5 text-orange-600" />
                <span className="font-semibold text-orange-800">{userPoints} pontos</span>
              </div>
              
              {/* Menu de Navegação */}
              <nav className="hidden md:flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => navigateTo('/add-book')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Livro
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigateTo('/profile')}>
                  <User className="h-4 w-4 mr-2" />
                  Meu Perfil
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigateTo('/messages')}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Mensagens
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigateTo('/rate')}>
                  <Star className="h-4 w-4 mr-2" />
                  Avaliar
                </Button>
              </nav>

              {/* Menu Mobile */}
              <div className="md:hidden">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Compartilhe livros, ganhe pontos!
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Doe livros e ganhe +10 pontos • Pegue emprestado por -5 pontos
          </p>

          {/* Barra de Busca */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por nome do livro ou autor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg border-2 border-green-200 focus:border-green-400 rounded-full"
            />
          </div>

          {/* Ações Rápidas Mobile */}
          <div className="grid grid-cols-2 gap-4 mt-8 md:hidden">
            <Button 
              onClick={() => navigateTo('/add-book')}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar Livro
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigateTo('/profile')}
            >
              <User className="h-4 w-4 mr-2" />
              Meu Perfil
            </Button>
          </div>
        </section>

        {/* Estatísticas */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-700">156</div>
              <div className="text-sm text-green-600">Livros Disponíveis</div>
            </CardContent>
          </Card>
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-700">89</div>
              <div className="text-sm text-orange-600">Usuários Ativos</div>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-700">234</div>
              <div className="text-sm text-blue-600">Empréstimos Concluídos</div>
            </CardContent>
          </Card>
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-700">4.6</div>
              <div className="text-sm text-purple-600">Avaliação Média</div>
            </CardContent>
          </Card>
        </section>

        {/* Lista de Livros */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Livros Disponíveis</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigateTo('/add-book')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Livro
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                      <CardDescription className="text-sm">por {book.author}</CardDescription>
                    </div>
                    <Badge 
                      variant={book.status === 'AVAILABLE' ? 'default' : 'secondary'}
                      className={book.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                    >
                      {book.status === 'AVAILABLE' ? 'Disponível' : 'Indisponível'}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {book.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{book.description}</p>
                  )}
                  
                  {/* Informações do Dono */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={book.owner.avatar} />
                        <AvatarFallback>{book.owner.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">{book.owner.name}</div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-gray-500">{book.owner.averageRating}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ação de Empréstimo */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-orange-600">
                      -5 pontos
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => handleBorrowBook(book.id)}
                      disabled={book.status !== 'AVAILABLE' || userPoints < 5}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {book.status === 'AVAILABLE' ? 'Pegar Emprestado' : 'Indisponível'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredBooks.length === 0 && (
            <div className="text-center py-12">
              <Book className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Nenhum livro encontrado para "{searchTerm}"</p>
              <Button 
                className="mt-4 bg-green-600 hover:bg-green-700"
                onClick={() => navigateTo('/add-book')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Primeiro Livro
              </Button>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 BookShare. Compartilhando conhecimento, um livro de cada vez.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}