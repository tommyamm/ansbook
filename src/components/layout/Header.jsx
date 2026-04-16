import { Button } from '@/components/ui/button.jsx'
import { BookOpen, Menu, Sun, Moon, Sparkles } from 'lucide-react'

const TelegramIcon = () => (
    <svg className="h-4 w-4 text-[#229ED9]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.5 3.37-.52.36-.99.54-1.41.53-.46-.01-1.35-.26-2.01-.48-.81-.27-1.46-.42-1.4-.88.03-.24.37-.48 1.03-.74 4.03-1.75 6.72-2.91 8.07-3.48 3.85-1.63 4.64-1.92 5.17-1.93.11 0 .37.03.54.18.14.12.18.28.2.45-.02.14-.02.3-.03.44z" />
    </svg>
)

const Header = ({ sidebarOpen, darkMode, particleEnabled, onToggleSidebar, onToggleDarkMode, onToggleParticles, onLogoClick }) => (
    <header className="border-b bg-card p-4 relative">
        <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onToggleSidebar}>
                <Menu className="h-4 w-4" />
            </Button>

            <BookOpen className="h-6 w-6 text-primary" />

            <div className="flex-1">
                <h1
                    className="text-2xl font-bold text-foreground cursor-pointer hover:text-primary transition-colors"
                    onClick={onLogoClick}
                >
                    StasikHub
                </h1>
            </div>

            <div className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-2 transition-all duration-300 ${sidebarOpen ? 'left-[calc(40%+10rem)] -translate-x-1/2' : 'left-1/2 -translate-x-1/2'}`}>
                <Button
                    variant={particleEnabled ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={onToggleParticles}
                    title="Переключить частицы"
                >
                    <Sparkles className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex items-center gap-2 ml-auto">
                <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => window.open('https://t.me/stdoq', '_blank')}
                >
                    <TelegramIcon />
                    @stdoq
                </Button>
            </div>

            <Button variant="ghost" size="sm" onClick={onToggleDarkMode}>
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
        </div>
    </header>
)

export default Header