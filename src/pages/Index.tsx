import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Icon from "@/components/ui/icon";

const Index = () => {
  const achievements = [
    { id: 1, title: "Первая победа", desc: "Выиграй первую игру", progress: 100, icon: "Trophy", unlocked: true },
    { id: 2, title: "Скоростной", desc: "Закончи игру за 5 минут", progress: 75, icon: "Zap", unlocked: false },
    { id: 3, title: "Мастер", desc: "Набери 1000 очков", progress: 45, icon: "Crown", unlocked: false },
    { id: 4, title: "Неудержимый", desc: "Выиграй 10 игр подряд", progress: 20, icon: "Target", unlocked: false }
  ];

  const playerStats = {
    level: 12,
    xp: 2840,
    nextLevelXp: 3500,
    gamesPlayed: 47,
    winRate: 68
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-game-navy via-slate-900 to-game-navy">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-game-orange/20 via-game-blue/20 to-game-electric/20 animate-pulse-glow"></div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-game-orange via-game-yellow to-game-blue bg-clip-text text-transparent mb-6">
              GAME ZONE
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Соревнуйся, побеждай и получай награды в захватывающих онлайн играх
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-game-orange to-red-500 hover:from-red-500 hover:to-game-orange text-white px-8 py-4 text-lg font-bold rounded-full shadow-2xl hover:shadow-game-orange/50 transition-all duration-300 animate-scale-in"
            >
              <Icon name="Play" className="mr-2" size={24} />
              НАЧАТЬ ИГРУ
            </Button>
          </div>
        </div>
      </div>

      {/* Player Stats Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-slate-800/50 border-game-blue/30 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
            <CardHeader className="text-center">
              <CardTitle className="text-game-yellow flex items-center justify-center gap-2">
                <Icon name="User" size={24} />
                Уровень {playerStats.level}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300">Опыт</span>
                    <span className="text-game-blue">{playerStats.xp}/{playerStats.nextLevelXp}</span>
                  </div>
                  <Progress 
                    value={(playerStats.xp / playerStats.nextLevelXp) * 100} 
                    className="bg-slate-700"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-game-orange/30 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
            <CardHeader className="text-center">
              <CardTitle className="text-game-orange flex items-center justify-center gap-2">
                <Icon name="Gamepad2" size={24} />
                Игры сыграно
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-bold text-white">{playerStats.gamesPlayed}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-game-electric/30 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
            <CardHeader className="text-center">
              <CardTitle className="text-game-electric flex items-center justify-center gap-2">
                <Icon name="TrendingUp" size={24} />
                Процент побед
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-bold text-white">{playerStats.winRate}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-center text-white mb-8 bg-gradient-to-r from-game-yellow to-game-orange bg-clip-text text-transparent">
            🏆 ДОСТИЖЕНИЯ
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <Card 
                key={achievement.id} 
                className={`bg-slate-800/50 backdrop-blur-sm border transition-all duration-300 hover:scale-105 animate-fade-in ${
                  achievement.unlocked 
                    ? 'border-game-yellow/50 shadow-lg shadow-game-yellow/20' 
                    : 'border-slate-600/30'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="text-center pb-2">
                  <div className={`mx-auto p-3 rounded-full mb-3 ${
                    achievement.unlocked ? 'bg-game-yellow/20' : 'bg-slate-700/50'
                  }`}>
                    <Icon 
                      name={achievement.icon as any} 
                      size={32} 
                      className={achievement.unlocked ? 'text-game-yellow' : 'text-gray-500'}
                    />
                  </div>
                  <CardTitle className={`text-lg ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`}>
                    {achievement.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-gray-300 mb-4">{achievement.desc}</p>
                  <div className="space-y-2">
                    <Progress 
                      value={achievement.progress} 
                      className="bg-slate-700"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">{achievement.progress}%</span>
                      {achievement.unlocked && (
                        <Badge className="bg-game-yellow text-slate-900 text-xs">
                          ПОЛУЧЕНО
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Game Modes Section */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-game-orange/20 to-red-500/20 border-game-orange/30 backdrop-blur-sm hover:scale-105 transition-all duration-300">
            <CardHeader className="text-center">
              <Icon name="Sword" size={48} className="text-game-orange mx-auto mb-4" />
              <CardTitle className="text-white text-2xl">Битва</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-300 mb-6">Сражайся с другими игроками в реальном времени</p>
              <Button className="w-full bg-game-orange hover:bg-red-500 text-white font-bold">
                ИГРАТЬ
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-game-blue/20 to-game-electric/20 border-game-blue/30 backdrop-blur-sm hover:scale-105 transition-all duration-300">
            <CardHeader className="text-center">
              <Icon name="Clock" size={48} className="text-game-blue mx-auto mb-4" />
              <CardTitle className="text-white text-2xl">Турнир</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-300 mb-6">Участвуй в турнирах и выигрывай призы</p>
              <Button className="w-full bg-game-blue hover:bg-game-electric text-white font-bold">
                УЧАСТВОВАТЬ
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-game-yellow/20 to-amber-500/20 border-game-yellow/30 backdrop-blur-sm hover:scale-105 transition-all duration-300">
            <CardHeader className="text-center">
              <Icon name="Users" size={48} className="text-game-yellow mx-auto mb-4" />
              <CardTitle className="text-white text-2xl">Команда</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-300 mb-6">Создай команду и играй с друзьями</p>
              <Button className="w-full bg-game-yellow hover:bg-amber-500 text-slate-900 font-bold">
                СОЗДАТЬ
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;