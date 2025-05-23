export interface Stone {
  x: number;
  y: number;
  color: 'black' | 'white';
}

export interface GameState {
  stones: Stone[];
  currentPlayer: 'black' | 'white';
  capturedBlack: number;
  capturedWhite: number;
  history: Stone[];
  aiLevel: number;
  isGameOver: boolean;
  winner: 'black' | 'white' | null;
}

export interface GameResult {
  winner: 'black' | 'white';
  score: number;
  reason: string;
  analysis: string;
}

export interface AIConfig {
  level: number;
  strength: number;
  style: 'aggressive' | 'balanced' | 'defensive';
} 