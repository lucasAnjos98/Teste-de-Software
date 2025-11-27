'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Star, MessageSquare, User, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

interface UserToRate {
  id: string
  name: string
  avatar?: string
  averageRating: number
  totalRatings: number
  bookTitle: string
  bookAuthor: string
  borrowingId: string
}

export default function RateUser() {
  const router = useRouter()
  const [usersToRate, setUsersToRate] = useState<UserToRate[]>([])
  const [selectedUser, setSelectedUser] = useState<UserToRate | null>(null)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    // Mock data para demonstração
    const mockUsers: UserToRate[] = [
      {
        id: '2',
        name: 'Maria Santos',
        avatar: undefined,
        averageRating: 4.8,
        totalRatings: 15,
        bookTitle: '1984',
        bookAuthor: 'George Orwell',
        borrowingId: '1'
      },
      {
        id: '3',
        name: 'João Silva',
        avatar: undefined,
        averageRating: 4.2,
        totalRatings: 8,
        bookTitle: 'O Pequeno Príncipe',
        bookAuthor: 'Antoine de Saint-Exupéry',
        borrowingId: '2'
      }
    ]

    setUsersToRate(mockUsers)
  }, [])

  const handleRateUser = async () => {
    if (!selectedUser || rating === 0) {
      alert('Por favor, selecione uma avaliação de 1 a 5 estrelas.')
      return
    }

    setIsSubmitting(true)

    try {
      // Simulação de envio para API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setShowSuccess(true)
      setTimeout(() => {
        router.push('/profile')
      }, 3000)
    } catch (error) {
      console.error('Erro ao avaliar usuário:', error)
      alert('Ocorreu um erro ao enviar sua avaliação. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = (rating: number, interactive: boolean = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-6 w-6 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => interactive && setRating(star)}
          />
        ))}
      </div>
    )
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Avaliação Enviada!</h2>
            <p className="text-gray-600 mb-4">
              Sua avaliação para {selectedUser?.name} foi registrada com sucesso.
            </p>
            <p className="text-sm text-gray-500">Redirecionando para seu perfil...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">BookShare</h1>
            </div>
            
            <Button variant="ghost" size="sm" onClick={() => router.push('/profile')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header da Página */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Avaliar Usuários
            </h2>
            <p className="text-lg text-gray-600">
              Avalie as pessoas com quem você realizou trocas de livros
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Lista de Usuários para Avaliar */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Usuários para Avaliar</CardTitle>
                  <CardDescription>
                    Pessoas com quem você realizou empréstimos recentes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {usersToRate.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => setSelectedUser(user)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedUser?.id === user.id
                            ? 'border-green-500 bg-green-50'
                            : 'hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <h4 className="font-medium">{user.name}</h4>
                            <p className="text-sm text-gray-600 mb-2">
                              {user.bookTitle} - {user.bookAuthor}
                            </p>
                            
                            <div className="flex items-center gap-2">
                              {renderStars(user.averageRating)}
                              <span className="text-sm text-gray-500">
                                ({user.totalRatings} avaliações)
                              </span>
                            </div>
                          </div>
                          
                          {selectedUser?.id === user.id && (
                            <Badge className="bg-green-600 text-white">
                              Selecionado
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {usersToRate.length === 0 && (
                      <div className="text-center py-8">
                        <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">
                          Nenhum usuário para avaliar no momento
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Formulário de Avaliação */}
            <div>
              {selectedUser ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Avaliar {selectedUser.name}</CardTitle>
                    <CardDescription>
                      Sua avaliação ajuda a construir uma comunidade mais confiável
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Informações do Usuário */}
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={selectedUser.avatar} />
                        <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{selectedUser.name}</h4>
                        <p className="text-sm text-gray-600">
                          {selectedUser.bookTitle} - {selectedUser.bookAuthor}
                        </p>
                      </div>
                    </div>

                    {/* Seleção de Estrelas */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sua Avaliação *
                      </label>
                      <div className="flex items-center gap-2">
                        {renderStars(rating, true)}
                        <span className="text-sm text-gray-500">
                          {rating === 0 ? 'Clique para avaliar' : `${rating} estrela${rating > 1 ? 's' : ''}`}
                        </span>
                      </div>
                    </div>

                    {/* Comentário */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comentário (opcional)
                      </label>
                      <Textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Compartilhe sua experiência com esta pessoa..."
                        rows={4}
                      />
                    </div>

                    {/* Dicas de Avaliação */}
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h5 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Dicas para uma boa avaliação
                      </h5>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Seja honesto e objetivo em sua avaliação</li>
                        <li>• Comente sobre a comunicação e pontualidade</li>
                        <li>• Mencione o estado do livro recebido</li>
                        <li>• Avalie a experiência geral da troca</li>
                      </ul>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex gap-4 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedUser(null)
                          setRating(0)
                          setComment('')
                        }}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleRateUser}
                        disabled={isSubmitting || rating === 0}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        {isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="text-center">
                    <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Selecione um usuário para avaliar
                    </h3>
                    <p className="text-gray-500">
                      Escolha um usuário da lista para começar sua avaliação
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}