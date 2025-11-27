'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Book, Upload, ArrowLeft, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function AddBook() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    coverImage: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Simulação de upload - na implementação real, faria upload para um serviço
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          coverImage: reader.result as string
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.author) {
      alert('Por favor, preencha o título e o autor do livro.')
      return
    }

    setIsSubmitting(true)

    try {
      // Simulação de envio para API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setShowSuccess(true)
      setTimeout(() => {
        router.push('/')
      }, 3000)
    } catch (error) {
      console.error('Erro ao cadastrar livro:', error)
      alert('Ocorreu um erro ao cadastrar o livro. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Livro Cadastrado!</h2>
            <p className="text-gray-600 mb-4">
              Seu livro foi adicionado com sucesso e você ganhou +10 pontos!
            </p>
            <p className="text-sm text-gray-500">Redirecionando para a página principal...</p>
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
              <Book className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">BookShare</h1>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push('/')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header da Página */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Cadastrar Novo Livro
            </h2>
            <p className="text-lg text-gray-600">
              Compartilhe seu livro com a comunidade e ganhe +10 pontos!
            </p>
          </div>

          {/* Alerta de Pontos */}
          <Alert className="mb-6 border-green-200 bg-green-50">
            <Book className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Ao cadastrar este livro, você receberá <strong>10 pontos</strong> em sua conta.
            </AlertDescription>
          </Alert>

          {/* Formulário */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Livro</CardTitle>
              <CardDescription>
                Preencha os dados básicos do livro que deseja compartilhar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Upload da Capa */}
                <div className="space-y-2">
                  <Label htmlFor="coverImage">Foto da Capa</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                      {formData.coverImage ? (
                        <img 
                          src={formData.coverImage} 
                          alt="Capa do livro" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-center">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <span className="text-xs text-gray-500">Capa</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <Input
                        type="file"
                        id="coverImage"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 5MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Título */}
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Livro *</Label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="Ex: O Senhor dos Anéis"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Autor */}
                <div className="space-y-2">
                  <Label htmlFor="author">Autor *</Label>
                  <Input
                    id="author"
                    name="author"
                    type="text"
                    placeholder="Ex: J.R.R. Tolkien"
                    value={formData.author}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Descrição */}
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Faça uma breve descrição do livro, gênero, estado de conservação, etc."
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                  />
                  <p className="text-xs text-gray-500">
                    Descrição opcional, mas ajuda outras pessoas a conhecerem melhor o livro.
                  </p>
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/')}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {isSubmitting ? 'Cadastrando...' : 'Cadastrar Livro'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Informações Adicionais */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Dicas para um bom cadastro</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>Fotos nítidas da capa ajudam a identificar o livro facilmente</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>Seja específico na descrição: gênero, edição, estado de conservação</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>Livros bem descritos são mais procurados pela comunidade</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>Você poderá editar ou remover o livro a qualquer momento</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}