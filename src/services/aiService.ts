import { Stone } from '@/types/game';

interface AIMoveResult {
  x: number;
  y: number;
  evaluation?: string;
}

// 定义棋盘大小
const BOARD_SIZE = 19;

// 根据 AI 等级获取 AI 的强度参数
const getAIStrength = (level: number): number => {
  // 1-9段，每段增加 10% 的准确率
  return 0.5 + (level * 0.05);
};

// 计算某个点的影响力
const calculateInfluence = (x: number, y: number, stones: Stone[]): number => {
  let influence = 0;
  
  // 检查周围8个方向
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];
  
  for (const [dx, dy] of directions) {
    const newX = x + dx;
    const newY = y + dy;
    
    if (newX >= 0 && newX < BOARD_SIZE && newY >= 0 && newY < BOARD_SIZE) {
      const stone = stones.find(s => s.x === newX && s.y === newY);
      if (stone) {
        influence += stone.color === 'white' ? 1 : -1;
      }
    }
  }
  
  return influence;
};

// 评估某个点的战略价值
const evaluatePosition = (x: number, y: number, stones: Stone[]): number => {
  let score = 0;
  
  // 天元和星位点加分
  const starPoints = [[3, 3], [3, 9], [3, 15], [9, 3], [9, 9], [9, 15], [15, 3], [15, 9], [15, 15]];
  if (starPoints.some(([sx, sy]) => sx === x && sy === y)) {
    score += 3;
  }
  
  // 边角位置减分
  if (x === 0 || x === BOARD_SIZE - 1 || y === 0 || y === BOARD_SIZE - 1) {
    score -= 2;
  }
  
  // 计算周围的影响力
  score += calculateInfluence(x, y, stones);
  
  return score;
};

// 获取所有可能的合法着点
const getValidMoves = (stones: Stone[]): { x: number; y: number; score: number }[] => {
  console.log('开始计算所有可能的落子位置');
  console.log('当前棋盘状态:', stones);
  
  const moves: { x: number; y: number; score: number }[] = [];
  
  for (let x = 0; x < BOARD_SIZE; x++) {
    for (let y = 0; y < BOARD_SIZE; y++) {
      if (!stones.some(s => s.x === x && s.y === y)) {
        const score = evaluatePosition(x, y, stones);
        moves.push({ x, y, score });
      }
    }
  }
  
  const sortedMoves = moves.sort((a, b) => b.score - a.score);
  console.log('找到的有效落子数量:', sortedMoves.length);
  console.log('前5个最佳落子位置:', sortedMoves.slice(0, 5));
  
  return sortedMoves;
};

// 计算最佳着点
export const calculateAIMove = async (
  stones: Stone[],
  aiLevel: number
): Promise<AIMoveResult | null> => {
  console.log('AI 开始计算落子位置');
  console.log('AI 等级:', aiLevel);
  console.log('当前棋盘状态:', stones);
  
  const validMoves = getValidMoves(stones);
  console.log('有效落子数量:', validMoves.length);
  
  if (validMoves.length === 0) {
    console.log('没有有效的落子位置');
    return null;
  }

  const strength = getAIStrength(aiLevel);
  console.log('AI 强度:', strength);
  
  // 根据 AI 等级选择不同范围的最佳着点
  // 确保至少有 3 个选项，但不超过有效着点的数量
  const numTopMoves = Math.max(3, Math.min(
    validMoves.length,
    Math.ceil(validMoves.length * (1 - strength))
  ));
  
  const topMoves = validMoves.slice(0, numTopMoves);
  console.log('候选落子数量:', topMoves.length);
  console.log('候选落子位置:', topMoves);
  
  // 从顶级着点中随机选择一个
  const selectedMove = topMoves[Math.floor(Math.random() * topMoves.length)];
  console.log('最终选择的落子位置:', selectedMove);
  
  let evaluation = '';
  if (selectedMove.score > 5) {
    evaluation = '这是一个强势的进攻点';
  } else if (selectedMove.score > 2) {
    evaluation = '这是一个均衡的布局点';
  } else {
    evaluation = '这是一个稳健的防守点';
  }
  
  const result = {
    x: selectedMove.x,
    y: selectedMove.y,
    evaluation
  };
  
  console.log('AI 返回结果:', result);
  return result;
};

// 分析对局
export const analyzeGame = (stones: Stone[]): string => {
  const evaluation = evaluatePosition(stones.length, stones.length, stones);
  
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