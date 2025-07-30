import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

interface Player {
  x: number;
  y: number;
  health: number;
  score: number;
  angle: number;
}

interface Bullet {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  playerId: string;
}

interface Enemy {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  health: number;
}

const SpaceGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameOver'>('menu');
  const [player, setPlayer] = useState<Player>({ x: 400, y: 300, health: 100, score: 0, angle: 0 });
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [level, setLevel] = useState(1);

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const PLAYER_SIZE = 20;
  const BULLET_SIZE = 4;
  const ENEMY_SIZE = 15;

  // Управление клавишами
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => new Set(prev).add(e.code));
      if (e.code === 'Space') {
        e.preventDefault();
        shootBullet();
      }
      if (e.code === 'Escape') {
        setGameState(prev => prev === 'playing' ? 'paused' : 'playing');
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => {
        const newKeys = new Set(prev);
        newKeys.delete(e.code);
        return newKeys;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Стрельба
  const shootBullet = useCallback(() => {
    if (gameState !== 'playing') return;
    
    const newBullet: Bullet = {
      id: Date.now().toString(),
      x: player.x,
      y: player.y,
      vx: Math.cos(player.angle) * 8,
      vy: Math.sin(player.angle) * 8,
      playerId: 'player1'
    };
    
    setBullets(prev => [...prev, newBullet]);
  }, [player, gameState]);

  // Создание врагов
  const spawnEnemy = useCallback(() => {
    const side = Math.floor(Math.random() * 4);
    let x, y, vx, vy;
    
    switch (side) {
      case 0: // сверху
        x = Math.random() * CANVAS_WIDTH;
        y = -ENEMY_SIZE;
        vx = (Math.random() - 0.5) * 2;
        vy = Math.random() * 2 + 1;
        break;
      case 1: // справа
        x = CANVAS_WIDTH + ENEMY_SIZE;
        y = Math.random() * CANVAS_HEIGHT;
        vx = -(Math.random() * 2 + 1);
        vy = (Math.random() - 0.5) * 2;
        break;
      case 2: // снизу
        x = Math.random() * CANVAS_WIDTH;
        y = CANVAS_HEIGHT + ENEMY_SIZE;
        vx = (Math.random() - 0.5) * 2;
        vy = -(Math.random() * 2 + 1);
        break;
      default: // слева
        x = -ENEMY_SIZE;
        y = Math.random() * CANVAS_HEIGHT;
        vx = Math.random() * 2 + 1;
        vy = (Math.random() - 0.5) * 2;
    }

    const newEnemy: Enemy = {
      id: Date.now().toString() + Math.random(),
      x, y, vx, vy,
      health: level
    };
    
    setEnemies(prev => [...prev, newEnemy]);
  }, [level]);

  // Игровой цикл
  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') return;

    // Движение игрока
    setPlayer(prev => {
      let newX = prev.x;
      let newY = prev.y;
      let newAngle = prev.angle;

      if (keys.has('KeyW') || keys.has('ArrowUp')) {
        newX += Math.cos(newAngle) * 5;
        newY += Math.sin(newAngle) * 5;
      }
      if (keys.has('KeyS') || keys.has('ArrowDown')) {
        newX -= Math.cos(newAngle) * 3;
        newY -= Math.sin(newAngle) * 3;
      }
      if (keys.has('KeyA') || keys.has('ArrowLeft')) {
        newAngle -= 0.1;
      }
      if (keys.has('KeyD') || keys.has('ArrowRight')) {
        newAngle += 0.1;
      }

      // Ограничения по границам
      newX = Math.max(PLAYER_SIZE, Math.min(CANVAS_WIDTH - PLAYER_SIZE, newX));
      newY = Math.max(PLAYER_SIZE, Math.min(CANVAS_HEIGHT - PLAYER_SIZE, newY));

      return { ...prev, x: newX, y: newY, angle: newAngle };
    });

    // Движение пуль
    setBullets(prev => prev
      .map(bullet => ({
        ...bullet,
        x: bullet.x + bullet.vx,
        y: bullet.y + bullet.vy
      }))
      .filter(bullet => 
        bullet.x > -10 && bullet.x < CANVAS_WIDTH + 10 &&
        bullet.y > -10 && bullet.y < CANVAS_HEIGHT + 10
      )
    );

    // Движение врагов
    setEnemies(prev => prev
      .map(enemy => ({
        ...enemy,
        x: enemy.x + enemy.vx,
        y: enemy.y + enemy.vy
      }))
      .filter(enemy => 
        enemy.x > -50 && enemy.x < CANVAS_WIDTH + 50 &&
        enemy.y > -50 && enemy.y < CANVAS_HEIGHT + 50
      )
    );

    // Столкновения пуль с врагами
    setBullets(prevBullets => {
      const remainingBullets: Bullet[] = [];
      
      setEnemies(prevEnemies => {
        const remainingEnemies: Enemy[] = [];
        
        prevEnemies.forEach(enemy => {
          let enemyHit = false;
          
          prevBullets.forEach(bullet => {
            const dx = bullet.x - enemy.x;
            const dy = bullet.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < BULLET_SIZE + ENEMY_SIZE && !enemyHit) {
              enemyHit = true;
              setPlayer(prev => ({ ...prev, score: prev.score + 10 }));
            } else if (!enemyHit) {
              remainingBullets.push(bullet);
            }
          });
          
          if (!enemyHit) {
            remainingEnemies.push(enemy);
          }
        });
        
        return remainingEnemies;
      });
      
      return remainingBullets;
    });

    // Столкновения игрока с врагами
    setEnemies(prevEnemies => {
      const remainingEnemies: Enemy[] = [];
      
      prevEnemies.forEach(enemy => {
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < PLAYER_SIZE + ENEMY_SIZE) {
          setPlayer(prev => ({ ...prev, health: prev.health - 10 }));
        } else {
          remainingEnemies.push(enemy);
        }
      });
      
      return remainingEnemies;
    });

    // Создание новых врагов
    if (Math.random() < 0.02 + level * 0.005) {
      spawnEnemy();
    }

  }, [gameState, keys, player.x, player.y, level, spawnEnemy]);

  // Проверка окончания игры
  useEffect(() => {
    if (player.health <= 0) {
      setGameState('gameOver');
    }
  }, [player.health]);

  // Рендеринг
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      // Очистка экрана
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Звезды (фон)
      ctx.fillStyle = 'white';
      for (let i = 0; i < 100; i++) {
        const x = (i * 73) % CANVAS_WIDTH;
        const y = (i * 61) % CANVAS_HEIGHT;
        ctx.fillRect(x, y, 1, 1);
      }

      if (gameState === 'playing' || gameState === 'paused') {
        // Игрок
        ctx.save();
        ctx.translate(player.x, player.y);
        ctx.rotate(player.angle);
        ctx.fillStyle = '#00ff88';
        ctx.beginPath();
        ctx.moveTo(PLAYER_SIZE, 0);
        ctx.lineTo(-PLAYER_SIZE/2, -PLAYER_SIZE/2);
        ctx.lineTo(-PLAYER_SIZE/3, 0);
        ctx.lineTo(-PLAYER_SIZE/2, PLAYER_SIZE/2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Пули
        ctx.fillStyle = '#ffff00';
        bullets.forEach(bullet => {
          ctx.beginPath();
          ctx.arc(bullet.x, bullet.y, BULLET_SIZE, 0, Math.PI * 2);
          ctx.fill();
        });

        // Враги
        ctx.fillStyle = '#ff4444';
        enemies.forEach(enemy => {
          ctx.beginPath();
          ctx.arc(enemy.x, enemy.y, ENEMY_SIZE, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      if (gameState === 'paused') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = 'white';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('ПАУЗА', CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
      }
    };

    render();
  }, [player, bullets, enemies, gameState]);

  // Главный игровой цикл
  useEffect(() => {
    if (gameState === 'playing') {
      const loop = () => {
        gameLoop();
        animationRef.current = requestAnimationFrame(loop);
      };
      animationRef.current = requestAnimationFrame(loop);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, gameLoop]);

  const startGame = () => {
    setGameState('playing');
    setPlayer({ x: 400, y: 300, health: 100, score: 0, angle: 0 });
    setBullets([]);
    setEnemies([]);
    setLevel(1);
  };

  const pauseGame = () => {
    setGameState(prev => prev === 'playing' ? 'paused' : 'playing');
  };

  const backToMenu = () => {
    setGameState('menu');
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="border-2 border-game-blue rounded-lg bg-gray-900"
          style={{ imageRendering: 'pixelated' }}
        />
        
        {/* Игрové меню */}
        {gameState === 'menu' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-lg">
            <Card className="bg-slate-800/90 border-game-orange/50 p-8 text-center">
              <CardContent className="space-y-6">
                <h2 className="text-4xl font-bold text-game-orange mb-4">КОСМИЧЕСКИЕ БИТВЫ</h2>
                <div className="text-gray-300 space-y-2 text-left">
                  <p>🚀 WASD или стрелки - движение</p>
                  <p>🔫 ПРОБЕЛ - стрельба</p>
                  <p>⏸️ ESC - пауза</p>
                </div>
                <Button onClick={startGame} size="lg" className="bg-game-orange hover:bg-red-500 text-white px-8 py-4">
                  <Icon name="Play" className="mr-2" />
                  НАЧАТЬ ИГРУ
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {gameState === 'gameOver' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-lg">
            <Card className="bg-slate-800/90 border-red-500/50 p-8 text-center">
              <CardContent className="space-y-6">
                <h2 className="text-4xl font-bold text-red-500 mb-4">ИГРА ОКОНЧЕНА</h2>
                <div className="text-white space-y-2">
                  <p className="text-2xl">Счет: <span className="text-game-yellow">{player.score}</span></p>
                  <p className="text-lg">Уровень: {level}</p>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button onClick={startGame} className="bg-game-orange hover:bg-red-500 text-white">
                    <Icon name="RotateCcw" className="mr-2" />
                    ЗАНОВО
                  </Button>
                  <Button onClick={backToMenu} variant="outline" className="border-gray-500 text-gray-300 hover:bg-slate-700">
                    <Icon name="Home" className="mr-2" />
                    МЕНЮ
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* HUD */}
      {(gameState === 'playing' || gameState === 'paused') && (
        <div className="flex justify-between items-center w-full max-w-4xl mt-4 px-4">
          <div className="flex gap-6 text-white">
            <div className="flex items-center gap-2">
              <Icon name="Heart" className="text-red-500" />
              <span className="text-xl font-bold">{player.health}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Target" className="text-game-yellow" />
              <span className="text-xl font-bold">{player.score}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Trophy" className="text-game-blue" />
              <span className="text-xl font-bold">Ур. {level}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={pauseGame} variant="outline" size="sm" className="border-gray-500 text-gray-300">
              <Icon name={gameState === 'paused' ? 'Play' : 'Pause'} size={16} />
            </Button>
            <Button onClick={backToMenu} variant="outline" size="sm" className="border-gray-500 text-gray-300">
              <Icon name="Home" size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpaceGame;