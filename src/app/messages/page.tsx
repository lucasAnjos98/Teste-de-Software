'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Send, Book, User, Clock, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface Message {
  id: string
  content: string
  senderId: string
  receiverId: string
  isRead: boolean
  createdAt: string
  sender: {
    name: string
    avatar?: string
  }
}

interface Conversation {
  id: string
  bookTitle: string
  bookAuthor: string
  otherUser: {
    id: string
    name: string
    avatar?: string
  }
  lastMessage?: {
    content: string
    createdAt: string
    isRead: boolean
  }
  unreadCount: number
}

export default function Messages() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Mock data para demonstração
    const mockConversations: Conversation[] = [
      {
        id: '1',
        bookTitle: '1984',
        bookAuthor: 'George Orwell',
        otherUser: {
          id: '2',
          name: 'Maria Santos',
          avatar: undefined
        },
        lastMessage: {
          content: 'Oi! O livro ainda está disponível?',
          createdAt: '2024-02-20T14:30:00Z',
          isRead: false
        },
        unreadCount: 2
      },
      {
        id: '2',
        bookTitle: 'O Pequeno Príncipe',
        bookAuthor: 'Antoine de Saint-Exupéry',
        otherUser: {
          id: '3',
          name: 'João Silva',
          avatar: undefined
        },
        lastMessage: {
          content: 'Perfeito! Podemos combinar a entrega para amanhã?',
          createdAt: '2024-02-19T10:15:00Z',
          isRead: true
        },
        unreadCount: 0
      }
    ]

    const mockMessages: Message[] = [
      {
        id: '1',
        content: 'Olá! Vi que você tem o livro 1984 disponível.',
        senderId: '2',
        receiverId: '1',
        isRead: true,
        createdAt: '2024-02-20T14:00:00Z',
        sender: {
          name: 'Maria Santos'
        }
      },
      {
        id: '2',
        content: 'Oi! Sim, está disponível. Você tem interesse?',
        senderId: '1',
        receiverId: '2',
        isRead: true,
        createdAt: '2024-02-20T14:15:00Z',
        sender: {
          name: 'Eu'
        }
      },
      {
        id: '3',
        content: 'Oi! O livro ainda está disponível?',
        senderId: '2',
        receiverId: '1',
        isRead: false,
        createdAt: '2024-02-20T14:30:00Z',
        sender: {
          name: 'Maria Santos'
        }
      }
    ]

    setConversations(mockConversations)
    setMessages(mockMessages)
  }, [])

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    // Aqui carregaria as mensagens da conversa selecionada
    setMessages(messages.filter(msg => 
      msg.senderId === conversation.otherUser.id || 
      msg.receiverId === conversation.otherUser.id
    ))
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: '1', // ID do usuário atual
      receiverId: selectedConversation.otherUser.id,
      isRead: false,
      createdAt: new Date().toISOString(),
      sender: {
        name: 'Eu'
      }
    }

    setMessages([...messages, message])
    setNewMessage('')
    
    // Aqui faria a chamada à API para enviar a mensagem
    console.log('Enviando mensagem:', message)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) return 'Agora'
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h`
    if (diffInHours < 48) return 'Ontem'
    return date.toLocaleDateString('pt-BR')
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
            
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Mensagens</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista de Conversas */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Conversas</CardTitle>
                  <CardDescription>
                    Suas conversas sobre empréstimos de livros
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-0">
                    {conversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() => handleSelectConversation(conversation)}
                        className={`p-4 cursor-pointer hover:bg-gray-50 border-b last:border-b-0 ${
                          selectedConversation?.id === conversation.id ? 'bg-green-50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={conversation.otherUser.avatar} />
                            <AvatarFallback>{conversation.otherUser.name[0]}</AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium truncate">{conversation.otherUser.name}</h4>
                              {conversation.unreadCount > 0 && (
                                <Badge className="bg-green-600 text-white text-xs">
                                  {conversation.unreadCount}
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-1">
                              {conversation.bookTitle} - {conversation.bookAuthor}
                            </p>
                            
                            {conversation.lastMessage && (
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-500 truncate">
                                  {conversation.lastMessage.content}
                                </p>
                                <span className="text-xs text-gray-400 ml-2">
                                  {formatTime(conversation.lastMessage.createdAt)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {conversations.length === 0 && (
                      <div className="p-8 text-center">
                        <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Nenhuma conversa ainda</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Área de Chat */}
            <div className="lg:col-span-2">
              {selectedConversation ? (
                <Card className="h-[600px] flex flex-col">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={selectedConversation.otherUser.avatar} />
                        <AvatarFallback>{selectedConversation.otherUser.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{selectedConversation.otherUser.name}</CardTitle>
                        <CardDescription>
                          {selectedConversation.bookTitle} - {selectedConversation.bookAuthor}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <Separator />
                  
                  {/* Mensagens */}
                  <CardContent className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.senderId === '1' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              message.senderId === '1'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <div className={`flex items-center gap-1 mt-1 text-xs ${
                              message.senderId === '1' ? 'text-green-100' : 'text-gray-500'
                            }`}>
                              <Clock className="h-3 w-3" />
                              {formatTime(message.createdAt)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  
                  <Separator />
                  
                  {/* Input de Mensagem */}
                  <div className="p-4">
                    <div className="flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Digite sua mensagem..."
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button 
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="h-[600px] flex items-center justify-center">
                  <CardContent className="text-center">
                    <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Selecione uma conversa
                    </h3>
                    <p className="text-gray-500">
                      Escolha uma conversa da lista para começar a trocar mensagens
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