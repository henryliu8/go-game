import { create } from 'zustand';

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
  
  // 动作
  placeStone: (x: number, y: number) => void;
  pass: () => void;
  resign: () => void;
  undo: () => void;
  reset: () => void;
  setAiLevel: (level: number) => void;
}

const isValidMove = (stones: Stone[], x: number, y: number): boolean => {
  // 检查是否已有棋子
  if (stones.some(stone => stone.x === x && stone.y === y)) {
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

  placeStone: (x: number, y: number) => {
    const { stones, currentPlayer, history } = get();
    
    if (!isValidMove(stones, x, y)) {
      return;
    }

    const newStone = { x, y, color: currentPlayer };
    const captures = calculateCaptures(stones, x, y, currentPlayer);
    
    set(state => ({
      stones: [...state.stones.filter(s => !captures.includes(s)), newStone],
      currentPlayer: state.currentPlayer === 'black' ? 'white' : 'black',
      capturedBlack: state.capturedBlack + (currentPlayer === 'white' ? captures.filter(s => s.color === 'black').length : 0),
      capturedWhite: state.capturedWhite + (currentPlayer === 'black' ? captures.filter(s => s.color === 'white').length : 0),
      history: [...state.history, newStone],
    }));
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