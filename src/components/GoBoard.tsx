import { Stage, Layer, Rect, Circle, Line } from 'react-konva';
import { useState, useEffect } from 'react';

interface GoBoardProps {
  size?: number;
  onPlaceStone?: (x: number, y: number) => void;
  currentPlayer?: 'black' | 'white';
  stones?: Array<{ x: number; y: number; color: 'black' | 'white' }>;
}

export const GoBoard: React.FC<GoBoardProps> = ({
  size = 19,
  onPlaceStone,
  currentPlayer = 'black',
  stones = []
}) => {
  const [boardSize, setBoardSize] = useState(600);
  const cellSize = boardSize / (size + 1);
  const padding = cellSize;

  useEffect(() => {
    const updateSize = () => {
      const minSize = Math.min(window.innerWidth - 40, window.innerHeight - 40, 600);
      setBoardSize(minSize);
    };

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleClick = (e: any) => {
    if (!onPlaceStone) return;

    const stage = e.target.getStage();
    const pointerPos = stage.getPointerPosition();
    
    const x = Math.round((pointerPos.x - padding) / cellSize);
    const y = Math.round((pointerPos.y - padding) / cellSize);

    if (x >= 0 && x < size && y >= 0 && y < size) {
      onPlaceStone(x, y);
    }
  };

  const drawBoard = () => {
    const lines = [];
    
    // 画横线
    for (let i = 0; i < size; i++) {
      lines.push(
        <Line
          key={`h${i}`}
          points={[
            padding,
            padding + i * cellSize,
            boardSize - padding,
            padding + i * cellSize,
          ]}
          stroke="#000"
          strokeWidth={1}
        />
      );
    }

    // 画竖线
    for (let i = 0; i < size; i++) {
      lines.push(
        <Line
          key={`v${i}`}
          points={[
            padding + i * cellSize,
            padding,
            padding + i * cellSize,
            boardSize - padding,
          ]}
          stroke="#000"
          strokeWidth={1}
        />
      );
    }

    return lines;
  };

  const drawStars = () => {
    const stars = [];
    const starPoints = size === 19 ? [3, 9, 15] : [3, size - 4];

    for (const i of starPoints) {
      for (const j of starPoints) {
        stars.push(
          <Circle
            key={`star-${i}-${j}`}
            x={padding + i * cellSize}
            y={padding + j * cellSize}
            radius={3}
            fill="#000"
          />
        );
      }
    }

    return stars;
  };

  return (
    <Stage width={boardSize} height={boardSize} onClick={handleClick}>
      <Layer>
        {/* 棋盘背景 */}
        <Rect
          x={0}
          y={0}
          width={boardSize}
          height={boardSize}
          fill="#DEB887"
        />
        
        {/* 棋盘线 */}
        {drawBoard()}
        
        {/* 星位 */}
        {drawStars()}
        
        {/* 棋子 */}
        {stones.map((stone, i) => (
          <Circle
            key={`stone-${stone.x}-${stone.y}`}
            x={padding + stone.x * cellSize}
            y={padding + stone.y * cellSize}
            radius={cellSize * 0.45}
            fill={stone.color}
            shadowBlur={2}
            shadowColor="rgba(0, 0, 0, 0.5)"
            shadowOffset={{ x: 2, y: 2 }}
          />
        ))}
      </Layer>
    </Stage>
  );
}; 