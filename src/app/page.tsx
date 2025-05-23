'use client';

import { GoBoard } from '@/components/GoBoard';
import { useGameStore } from '@/store/gameStore';
import { useState } from 'react';

export default function Home() {
  const {
    stones,
    currentPlayer,
    capturedBlack,
    capturedWhite,
    aiLevel,
    isGameOver,
    winner,
    placeStone,
    pass,
    resign,
    undo,
    reset,
    setAiLevel,
  } = useGameStore();

  const [showSettings, setShowSettings] = useState(false);

  const rankLevels = [
    '初段',
    '二段',
    '三段',
    '四段',
    '五段',
    '六段',
    '七段',
    '八段',
    '九段',
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 左侧信息面板 */}
          <div className="w-full md:w-64 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-bold mb-4">对局信息</h2>
              <div className="space-y-2">
                <p>当前选手：{currentPlayer === 'black' ? '黑棋' : '白棋'}</p>
                <p>黑棋提子：{capturedBlack}</p>
                <p>白棋提子：{capturedWhite}</p>
                <p>AI等级：{rankLevels[aiLevel - 1]}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-bold mb-4">操作</h2>
              <div className="space-y-2">
                <button
                  onClick={() => pass()}
                  className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
                >
                  虚手
                </button>
                <button
                  onClick={() => resign()}
                  className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
                >
                  认输
                </button>
                <button
                  onClick={() => undo()}
                  className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
                >
                  悔棋
                </button>
                <button
                  onClick={() => reset()}
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                  重新开始
                </button>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
                >
                  设置
                </button>
              </div>
            </div>

            {showSettings && (
              <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-xl font-bold mb-4">AI等级设置</h2>
                <div className="space-y-2">
                  {rankLevels.map((rank, index) => (
                    <button
                      key={rank}
                      onClick={() => setAiLevel(index + 1)}
                      className={`w-full py-2 rounded ${
                        aiLevel === index + 1
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      {rank}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 棋盘 */}
          <div className="flex-1 bg-white rounded-lg shadow-md p-4">
            <GoBoard
              stones={stones}
              onPlaceStone={placeStone}
              currentPlayer={currentPlayer}
            />
          </div>
        </div>

        {/* 游戏结束提示 */}
        {isGameOver && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 max-w-md">
              <h2 className="text-2xl font-bold mb-4">游戏结束</h2>
              <p className="text-xl mb-4">
                {winner === 'black' ? '黑棋' : '白棋'}胜利！
              </p>
              <button
                onClick={() => reset()}
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                开始新游戏
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
