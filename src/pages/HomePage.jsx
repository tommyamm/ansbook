import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { BookOpen, Code, Users, MessageCircle } from 'lucide-react'

const HomePage = () => {
    const navigate = useNavigate()

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3 mb-6">
                    <BookOpen className="h-12 w-12 text-primary" />
                    <h1
                        className="text-4xl font-bold text-foreground cursor-pointer hover:text-primary transition-colors"
                        onClick={() => navigate('/')}
                    >
                        StasikHub
                    </h1>
                </div>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Добро пожаловать в StasikHub — здесь можно посмотреть шаблон решения задач из ЕГЭ по информатике.
                </p>
            </div>

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
                            StasikHub — небольшой сайтик, созданный для помощи в подготовке к ЕГЭ по информатике.
                            Здесь вы найдете задачи, сгруппированные по типам, с решениями на Python.
                        </p>
                    </CardContent>
                </Card>

                <Card className="card-hover">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            Зачем оно надо
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground leading-relaxed">
                            Например, в школе или дома вы решили освежить знания, но подзабыли способ решения - этот сайт 
                            поможет вам :)
                        </p>
                    </CardContent>
                </Card>
            </div>

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
                                Задачи организованы по типам для удобного просмотра
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
                                Помощь и обратная связь через Telegram
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="card-hover">
                <CardHeader>
                    <CardTitle>Нужна помощь?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                        Если у вас возникли вопросы, вы нашли ошибку или хотите предложить улучшение,
                        не стесняйтесь обращаться в Telegram. Постараюсь помочь. Отвечу в течение дня.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Button
                            variant="outline"
                            className="flex items-center gap-2"
                            onClick={() => window.open('https://t.me/stdoq', '_blank')}
                        >
                            <MessageCircle className="h-4 w-4" />
                            Написать в Telegram
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default HomePage