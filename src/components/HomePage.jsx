import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { BookOpen, MessageCircle, Code, Users } from 'lucide-react'

function HomePage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-6">
          <BookOpen className="h-12 w-12 text-primary" />
          <h1 className="text-4xl font-bold text-foreground">StasikHub</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Добро пожаловать в StasikHub — платформу для изучения и решения задач по программированию
        </p>
      </div>

      {/* About Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5 text-primary" />
              Что такое StasikHub?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              StasikHub — это образовательная платформа, созданная для помощи в изучении алгоритмов и структур данных. 
              Здесь собраны задачи различной сложности с подробными объяснениями и примерами решений на Python.
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Цели проекта
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Наша цель — сделать изучение программирования более доступным и интересным. 
              Мы предоставляем структурированные материалы, которые помогают развивать навыки решения задач 
              и понимание алгоритмического мышления.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle>Возможности платформы</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Структурированные задачи</h3>
              <p className="text-sm text-muted-foreground">
                Задачи организованы по типам и сложности для удобного изучения
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Примеры решений</h3>
              <p className="text-sm text-muted-foreground">
                Подробные объяснения и готовые решения на Python
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Поддержка</h3>
              <p className="text-sm text-muted-foreground">
                Быстрая помощь и обратная связь через Telegram
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Getting Started */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle>Как начать?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Выберите интересующую вас категорию задач в боковом меню и начните изучение. 
            Каждая задача содержит подробное описание, примеры входных и выходных данных, 
            а также готовое решение с объяснениями.
          </p>
          {/* <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => window.open('https://t.me/macronx', '_blank')}
            >
              <MessageCircle className="h-4 w-4" />
              Написать в Telegram
            </Button>
          </div> */}
        </CardContent>
      </Card>

      {/* Support Section */}
      <Card className="border-primary/20 bg-primary/5 card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <MessageCircle className="h-5 w-5" />
            Нужна помощь?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Если у вас возникли вопросы, вы нашли ошибку или хотите предложить улучшение, 
            не стесняйтесь обращаться к нам в Telegram. Мы всегда рады помочь!
          </p>
          <Button 
            className="flex items-center gap-2"
            onClick={() => window.open('https://t.me/macronx', '_blank')}
          >
              <svg 
                  className="h-4 w-4 text-[#229ED9]" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.5 3.37-.52.36-.99.54-1.41.53-.46-.01-1.35-.26-2.01-.48-.81-.27-1.46-.42-1.4-.88.03-.24.37-.48 1.03-.74 4.03-1.75 6.72-2.91 8.07-3.48 3.85-1.63 4.64-1.92 5.17-1.93.11 0 .37.03.54.18.14.12.18.28.2.45-.02.14-.02.3-.03.44z"/>
            </svg>
            Связаться с @macronx
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default HomePage
