import { useEffect, useState, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import Player from './elements/Player/Player';

function App() {
  const stageRef = useRef();
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    window.addEventListener('resize', () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    });
  }, []);

  return (
    <Stage ref={stageRef} width={dimensions.width} height={dimensions.height}>
      <Layer>
        <Player stageRef={stageRef} width={450} height={450} />
      </Layer>
    </Stage>
  );
}

export default App;
