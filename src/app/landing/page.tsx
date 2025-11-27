'use client'

import { useRouter } from 'next/navigation'
import { Book, Star, Users, MessageCircle, ArrowRight, CheckCircle, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Landing() {
  const router = useRouter()

  const features = [
    {
      icon: <Book className="h-8 w-8 text-green-600" />,
      title: 'Compartilhe Livros',
      description: 'Doe seus livros e ganhe 10 pontos para cada cadastro'
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: 'Comunidade Ativa',
      description: 'Conecte-se com outros amantes de literatura'
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-purple-600" />,
      title: 'Converse Diretamente',
      description: 'Combine entregas e trocas através do chat integrado'
    },
    {
      icon: <Star className="h-8 w-8 text-orange-600" />,
      title: 'Sistema de Avaliação',
      description: 'Construa sua reputação e avalie outras pessoas'
    }
  ]

  const stats = [
    { number: '156+', label: 'Livros Disponíveis' },
    { number: '89+', label: 'Usuários Ativos' },
    { number: '234+', label: 'Empréstimos Concluídos' },
    { number: '4.6', label: 'Avaliação Média' }
  ]

  const howItWorks = [
    {
      step: '1',
      title: 'Cadastre-se',
      description: 'Crie sua conta gratuitamente e comece a compartilhar'
    },
    {
      step: '2',
      title: 'Adicione Livros',
      description: 'Cadastre os livros que quer compartilhar e ganhe pontos'
    },
    {
      step: '3',
      title: 'Peça Emprestado',
      description: 'Use seus pontos para pegar livros de outros usuários'
    },
    {
      step: '4',
      title: 'Combine a Entrega',
      description: 'Converse com o dono e combine como receber o livro'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-orange-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Book className="h-12 w-12 text-green-600" />
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900">BookShare</h1>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
              Compartilhe livros, ganhe pontos, construa comunidade
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Transforme seus livros parados em oportunidades de leitura. 
              Doe livros e ganhe +10 pontos, pegue emprestado por -5 pontos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => router.push('/auth')}
                className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3"
              >
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => router.push('/')}
                className="text-lg px-8 py-3"
              >
                Explorar Livros
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Como o BookShare Funciona
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Uma plataforma simples e intuitiva para compartilhamento de livros
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Passo a Passo
            </h2>
            <p className="text-lg text-gray-600">
              Comece a compartilhar livros em 4 passos simples
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">{step.step}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-orange-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Benefícios do Sistema de Pontos
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <h3 className="text-xl font-semibold mb-2">Recompensa Instantânea</h3>
                  <p className="text-green-100">
                    Ganhe 10 pontos imediatamente ao cadastrar cada livro
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <h3 className="text-xl font-semibold mb-2">Acesso Acessível</h3>
                  <p className="text-green-100">
                    Pegue livros emprestados por apenas 5 pontos
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <h3 className="text-xl font-semibold mb-2">Equilíbrio Perfeito</h3>
                  <p className="text-green-100">
                    Sistema balanceado que incentiva doação e empréstimo
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <h3 className="text-xl font-semibold mb-2">Comunidade Confiable</h3>
                  <p className="text-green-100">
                    Avaliações garantem trocas seguras e confiáveis
                  </p>
                </div>
              </div>
            </div>

            <Button 
              size="lg"
              onClick={() => router.push('/auth')}
              className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-3"
            >
              <Award className="mr-2 h-5 w-5" />
              Junte-se à Comunidade
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Pronto para Transformar Sua Biblioteca?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Junte-se a centenas de leitores que já estão compartilhando conhecimento 
              e construindo uma comunidade mais conectada.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => router.push('/auth')}
                className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3"
              >
                Criar Conta Gratuita
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => router.push('/')}
                className="text-lg px-8 py-3"
              >
                Ver Livros Disponíveis
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Book className="h-8 w-8 text-green-400" />
              <h3 className="text-2xl font-bold">BookShare</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Compartilhando conhecimento, um livro de cada vez.
            </p>
            <p className="text-gray-500 text-sm">
              &copy; 2024 BookShare. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}