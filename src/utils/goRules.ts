import { Stone } from '@/types/game';

interface Point {
  x: number;
  y: number;
}

export class GoRules {
  static readonly BOARD_SIZE = 19;

  // 获取一个点的所有相邻点
  static getAdjacent(point: Point): Point[] {
    const { x, y } = point;
    return [
      { x: x - 1, y: y },
      { x: x + 1, y: y },
      { x: x, y: y - 1 },
      { x: x, y: y + 1 }
    ].filter(
      p =>
        p.x >= 0 && p.x < this.BOARD_SIZE && p.y >= 0 && p.y < this.BOARD_SIZE
    );
  }

  // 获取一个棋子组的气
  static getLiberties(
    stones: Stone[],
    group: Point[],
    color: 'black' | 'white'
  ): Point[] {
    const liberties = new Set<string>();
    const groupStrings = new Set(group.map(p => `${p.x},${p.y}`));

    group.forEach(stone => {
      this.getAdjacent(stone).forEach(point => {
        const pointStr = `${point.x},${point.y}`;
        if (!groupStrings.has(pointStr) && !stones.some(s => s.x === point.x && s.y === point.y)) {
          liberties.add(pointStr);
        }
      });
    });

    return Array.from(liberties).map(str => {
      const [x, y] = str.split(',').map(Number);
      return { x, y };
    });
  }

  // 获取一个点所在的整个棋子组
  static getGroup(
    stones: Stone[],
    point: Point,
    color: 'black' | 'white'
  ): Point[] {
    const group = new Set<string>();
    const queue: Point[] = [point];

    while (queue.length > 0) {
      const current = queue.pop()!;
      const currentStr = `${current.x},${current.y}`;

      if (group.has(currentStr)) continue;
      group.add(currentStr);

      this.getAdjacent(current).forEach(adj => {
        const stone = stones.find(s => s.x === adj.x && s.y === adj.y);
        if (stone && stone.color === color) {
          queue.push(adj);
        }
      });
    }

    return Array.from(group).map(str => {
      const [x, y] = str.split(',').map(Number);
      return { x, y };
    });
  }

  // 检查是否为合法着点
  static isValidMove(stones: Stone[], point: Point, color: 'black' | 'white'): boolean {
    // 检查是否已有棋子
    if (stones.some(s => s.x === point.x && s.y === point.y)) {
      return false;
    }

    // 模拟落子
    const newStones = [...stones, { ...point, color }];

    // 检查自杀规则
    const group = this.getGroup(newStones, point, color);
    if (this.getLiberties(newStones, group, color).length === 0) {
      // 如果能吃掉对方的棋子则不算自杀
      const capturedStones = this.getCapturedStones(newStones, point, color);
      if (capturedStones.length === 0) {
        return false;
      }
    }

    // TODO: 实现打劫规则检查

    return true;
  }

  // 获取被吃掉的棋子
  static getCapturedStones(
    stones: Stone[],
    lastMove: Point,
    color: 'black' | 'white'
  ): Point[] {
    const oppositeColor = color === 'black' ? 'white' : 'black';
    const captured: Point[] = [];

    this.getAdjacent(lastMove).forEach(adj => {
      const stone = stones.find(s => s.x === adj.x && s.y === adj.y);
      if (stone && stone.color === oppositeColor) {
        const group = this.getGroup(stones, adj, oppositeColor);
        if (this.getLiberties(stones, group, oppositeColor).length === 0) {
          captured.push(...group);
        }
      }
    });

    return captured;
  }

  // 计算领地
  static calculateTerritory(stones: Stone[]): {
    black: Point[];
    white: Point[];
    neutral: Point[];
  } {
    const territory = {
      black: [] as Point[],
      white: [] as Point[],
      neutral: [] as Point[]
    };

    // TODO: 实现领地计算算法

    return territory;
  }

  // 判断游戏是否结束
  static isGameOver(stones: Stone[]): boolean {
    // TODO: 实现更复杂的终局判断
    return false;
  }

  // 计算最终得分
  static calculateScore(stones: Stone[]): {
    black: number;
    white: number;
  } {
    const territory = this.calculateTerritory(stones);
    const blackStones = stones.filter(s => s.color === 'black').length;
    const whiteStones = stones.filter(s => s.color === 'white').length;

    return {
      black: blackStones + territory.black.length,
      white: whiteStones + territory.white.length + 6.5 // 贴目
    };
  }
} 