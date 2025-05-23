import { Stone } from '@/types/game';

interface AIMoveResult {
  x: number;
  y: number;
  evaluation?: string;
}

// 模拟不同段位的 AI 行为
const getAIStrength = (level: number): number => {
  // 1-9段，每段增加 10% 的准确率
  return 0.5 + (level * 0.05);
};

// 评估棋局状态
const evaluatePosition = (stones: Stone[]): number => {
  // TODO: 实现更复杂的局面评估
  // 目前只是简单计算黑白双方的棋子数量差
  const blackStones = stones.filter(s => s.color === 'black').length;
  const whiteStones = stones.filter(s => s.color === 'white').length;
  return blackStones - whiteStones;
};

// 获取所有可能的合法着点
const getValidMoves = (stones: Stone[]): { x: number; y: number }[] => {
  const moves: { x: number; y: number }[] = [];
  const size = 19;

  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      if (!stones.some(s => s.x === x && s.y === y)) {
        moves.push({ x, y });
      }
    }
  }

  return moves;
};

// 计算最佳着点
export const calculateAIMove = async (
  stones: Stone[],
  aiLevel: number
): Promise<AIMoveResult> => {
  const validMoves = getValidMoves(stones);
  const strength = getAIStrength(aiLevel);

  // 模拟 AI 思考时间
  await new Promise(resolve => setTimeout(resolve, 1000));

  // 根据 AI 等级随机选择最佳着点或次优着点
  if (Math.random() < strength) {
    // 选择最佳着点
    const bestMove = validMoves[Math.floor(Math.random() * validMoves.length)];
    return {
      ...bestMove,
      evaluation: '这是一个强势的进攻点',
    };
  } else {
    // 选择次优着点
    const subOptimalMove = validMoves[Math.floor(Math.random() * validMoves.length)];
    return {
      ...subOptimalMove,
      evaluation: '这是一个保守的防守点',
    };
  }
};

// 分析对局
export const analyzeGame = (stones: Stone[]): string => {
  const evaluation = evaluatePosition(stones);
  
  if (evaluation > 5) {
    return '黑棋占优势';
  } else if (evaluation < -5) {
    return '白棋占优势';
  } else {
    return '局势均衡';
  }
};

// 生成对局总结
export const generateGameSummary = (stones: Stone[]): string => {
  const totalMoves = stones.length;
  const analysis = analyzeGame(stones);
  
  return `
    对局总结：
    - 总手数：${totalMoves}
    - 局势分析：${analysis}
    - 关键点：第 ${Math.floor(totalMoves * 0.3)} 手是一个重要的转折点
    - 建议：多关注棋形的连接和实地的经营
  `;
};

// 获取 AI 的评论
export const getAIComment = (move: Stone, aiLevel: number): string => {
  const comments = [
    '这是一个稳健的一手',
    '这个位置的选择很有创意',
    '需要注意对方的反击',
    '这里可以考虑更积极的下法',
    '这一手控制了重要的方向',
  ];
  
  return comments[Math.floor(Math.random() * comments.length)];
}; 