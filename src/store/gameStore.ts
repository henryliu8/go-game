import { create } from 'zustand';
import { calculateAIMove } from '@/services/aiService';

interface Stone {
  x: number;
  y: number;
  color: 'black' | 'white';
}

interface GameState {
  stones: Stone[];
  currentPlayer: 'black' | 'white';
  capturedBlack: number;
  capturedWhite: number;
  history: Stone[];
  aiLevel: number;
  isGameOver: boolean;
  winner: 'black' | 'white' | null;
  isAIThinking: boolean;
  
  // 动作
  placeStone: (x: number, y: number, isAIMove?: boolean) => void;
  pass: () => void;
  resign: () => void;
  undo: () => void;
  reset: () => void;
  setAiLevel: (level: number) => void;
}

const isValidMove = (stones: Stone[], x: number, y: number): boolean => {
  // 检查是否已有棋子
  if (stones.some(stone => stone.x === x && stone.y === y)) {
    console.log('位置已被占用');
    return false;
  }
  
  // TODO: 实现完整的围棋规则检查
  // 1. 气的计算
  // 2. 打劫规则
  // 3. 自杀规则
  
  return true;
};

const calculateCaptures = (stones: Stone[], x: number, y: number, color: 'black' | 'white'): Stone[] => {
  // TODO: 实现吃子规则
  return [];
};

export const useGameStore = create<GameState>((set, get) => ({
  stones: [],
  currentPlayer: 'black',
  capturedBlack: 0,
  capturedWhite: 0,
  history: [],
  aiLevel: 1,
  isGameOver: false,
  winner: null,
  isAIThinking: false,

  placeStone: (x: number, y: number, isAIMove = false) => {
    const { stones, currentPlayer, aiLevel, isAIThinking, isGameOver } = get();
    
    console.log('尝试落子:', { x, y, currentPlayer, isAIMove, isAIThinking, aiLevel });
    
    // 如果游戏已结束，不允许落子
    if (isGameOver) {
      console.log('游戏已结束');
      return;
    }
    
    // 如果 AI 正在思考，且不是 AI 的落子，不允许落子
    if (isAIThinking && !isAIMove) {
      console.log('AI 正在思考中，不允许人类落子');
      return;
    }

    // 如果不是 AI 的落子，且当前是白棋回合，不允许落子
    if (!isAIMove && currentPlayer === 'white') {
      console.log('现在是白棋(AI)回合');
      return;
    }

    // 检查是否是有效的落子
    if (!isValidMove(stones, x, y)) {
      console.log('无效的落子位置');
      return;
    }

    console.log('落子有效，准备更新状态');
    
    const newStone = { x, y, color: currentPlayer };
    console.log('新落子:', newStone);
    
    const captures = calculateCaptures(stones, x, y, currentPlayer);
    console.log('被吃的棋子:', captures);
    
    // 更新棋盘状态
    set(state => {
      console.log('更新前的状态:', state);
      const newState: Partial<GameState> = {
        stones: [...state.stones.filter(s => !captures.includes(s)), newStone],
        currentPlayer: state.currentPlayer === 'black' ? 'white' : 'black',
        capturedBlack: state.capturedBlack + (currentPlayer === 'white' ? captures.filter(s => s.color === 'black').length : 0),
        capturedWhite: state.capturedWhite + (currentPlayer === 'black' ? captures.filter(s => s.color === 'white').length : 0),
        history: [...state.history, newStone],
        isGameOver: state.isGameOver,
        winner: state.winner,
        aiLevel: state.aiLevel,
        isAIThinking: isAIMove ? false : state.isAIThinking // 如果是 AI 落子，结束思考状态
      };
      console.log('更新后的状态:', newState);
      return newState;
    });

    // 只有当是人类下的黑子时，才触发 AI 的白棋落子
    if (!isAIMove && currentPlayer === 'black') {
      console.log('触发 AI 思考');
      console.log('设置 isAIThinking = true');
      
      // 保存当前的 AI 等级，避免闭包问题
      const currentAILevel = aiLevel;
      
      // 设置 AI 思考状态
      set(state => ({
        ...state,
        isAIThinking: true
      }));
      
      // 使用 setTimeout 来模拟 AI 思考时间，让体验更真实
      setTimeout(async () => {
        try {
          // 获取最新的棋盘状态
          const { stones: currentStones } = get();
          
          console.log('AI 开始计算:', {
            stones: currentStones,
            aiLevel: currentAILevel,
            isAIThinking: get().isAIThinking
          });
          
          // 计算 AI 落子
          const aiMove = await calculateAIMove(currentStones, currentAILevel);
          console.log('AI 计算结果:', aiMove);
          
          // 检查是否仍在思考（避免用户可能已经重置游戏）
          if (get().isAIThinking) {
            if (aiMove) {
              console.log('AI 准备落子:', aiMove);
              // 直接调用 placeStone 函数
              get().placeStone(aiMove.x, aiMove.y, true);
            } else {
              console.log('AI 没有找到合适的落子位置');
              set(state => ({ ...state, isAIThinking: false }));
            }
          } else {
            console.log('AI 思考已被取消');
          }
        } catch (error) {
          console.error('AI 落子计算失败:', error);
          set(state => ({ ...state, isAIThinking: false }));
        }
      }, 1000);
    }
  },

  pass: () => {
    set(state => ({
      currentPlayer: state.currentPlayer === 'black' ? 'white' : 'black',
    }));
  },

  resign: () => {
    const { currentPlayer } = get();
    set({
      isGameOver: true,
      winner: currentPlayer === 'black' ? 'white' : 'black',
    });
  },

  undo: () => {
    set(state => {
      const newHistory = [...state.history];
      newHistory.pop();
      return {
        stones: newHistory,
        history: newHistory,
        currentPlayer: state.currentPlayer === 'black' ? 'white' : 'black',
      };
    });
  },

  reset: () => {
    set({
      stones: [],
      currentPlayer: 'black',
      capturedBlack: 0,
      capturedWhite: 0,
      history: [],
      isGameOver: false,
      winner: null,
    });
  },

  setAiLevel: (level: number) => {
    set({ aiLevel: level });
  },
})); 