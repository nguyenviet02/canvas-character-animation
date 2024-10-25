import { useCallback, useEffect, useState } from 'react';
import { Image } from 'react-konva';
import Konva from 'konva';
import minotaurIdleBlinking from '/Minotaur_Idle_Blinking.png';
import minotaurIdleBlinkingLeft from '/Minotaur_Idle_Blinking_Left.png';
import minotaurRunning from '/Minotaur_Running.png';
import minotaurRunningLeft from '/Minotaur_Running_Left.png';
import minotaurSlashing from '/Minotaur_Slashing.png';
import minotaurSlashingLeft from '/Minotaur_Slashing_Left.png';
import minotaurJumpLoop from '/Minotaur_Jump_Loop.png';
import useImage from 'use-image';

const Player = ({ stageRef, position = { x: 0, y: 0 }, velocity = { x: 20, y: 0 }, width = 100, height = 100, ...props }) => {
  const gravity = 0.5;
  const actionsEnum = {
    left: {
      idle: 'IDLE',
      running: 'RUNNING',
      attacking: 'ATTACKING',
      jumping: 'JUMPING',
    },
    right: {
      idle: 'IDLE',
      running: 'RUNNING',
      attacking: 'ATTACKING',
      jumping: 'JUMPING',
    },
  };

  const [minotaurIdleBlinkingImage] = useImage(minotaurIdleBlinking);
  const [minotaurRunningImage] = useImage(minotaurRunning);
  const [minotaurIdleBlinkingLeftImage] = useImage(minotaurIdleBlinkingLeft);
  const [minotaurRunningLeftImage] = useImage(minotaurRunningLeft);
  const [minotaurSlashingImage] = useImage(minotaurSlashing);
  const [minotaurSlashingLeftImage] = useImage(minotaurSlashingLeft);
  const [minotaurJumpLoopImage] = useImage(minotaurJumpLoop);

  const [positionState, setPositionState] = useState(position);
  console.log('☠️ ~ Player ~ positionState:', positionState);
  const [velocityState, setVelocityState] = useState(velocity);
  const [actionImage, setActionImage] = useState(minotaurIdleBlinkingImage);
  const [frames, setFrames] = useState(0);
  const [numberOfFrames, setNumberOfFrames] = useState(18);
  const [currentAction, setCurrentAction] = useState('idle');
  console.log('☠️ ~ Player ~ currentAction:', currentAction);
  const [currentDirection, setCurrentDirection] = useState('right');

  const moveForward = useCallback(() => {
    if (currentAction !== actionsEnum?.right?.running) {
      setCurrentAction(actionsEnum?.right?.running);
      setCurrentDirection('right');
      setNumberOfFrames(12);
      setActionImage(minotaurRunningImage);
    }
    setPositionState((prev) => ({ x: prev.x + velocity.x, y: prev.y }));
  }, [actionsEnum?.right?.running, currentAction, minotaurRunningImage, velocity.x]);

  const moveBackward = useCallback(() => {
    if (currentAction !== actionsEnum?.left?.running) {
      setCurrentAction(actionsEnum?.left?.running);
      setCurrentDirection('left');
      setNumberOfFrames(12);
      setActionImage(minotaurRunningLeftImage);
    }
    setPositionState((prev) => ({ x: prev.x - velocity.x, y: prev.y }));
  }, [actionsEnum?.left?.running, currentAction, minotaurRunningLeftImage, velocity.x]);

  const moveUp = useCallback(() => {
    setCurrentAction(actionsEnum?.right?.jumping);
    setActionImage(minotaurJumpLoopImage);
    setNumberOfFrames(6);
    const jump = 20;
    setVelocityState((prev) => ({ x: prev.x, y: prev.y - jump }));
  }, [actionsEnum?.right?.jumping, minotaurJumpLoopImage]);

  const moveDown = useCallback(() => {
    setPositionState((prev) => ({ x: prev.x, y: prev.y + velocity.y }));
  }, [velocity.y]);

  const makeAnimation = useCallback(() => {
    if (!stageRef?.current?.getLayers?.()?.[0]) {
      return;
    }
    const animation = new Konva.Animation((frame) => {
      if (!frame) {
        return;
      }
      const newFrame = Math.floor(frame.time / 60) % numberOfFrames;
      setFrames(newFrame);
    }, stageRef?.current?.getLayers?.()?.[0]);
    animation?.start();
  }, [numberOfFrames, stageRef]);

  useEffect(() => {
    makeAnimation();
  }, [makeAnimation]);

  useEffect(() => {
    if (minotaurIdleBlinkingImage) {
      setActionImage(minotaurIdleBlinkingImage);
      setNumberOfFrames(18);
    }
  }, [minotaurIdleBlinkingImage]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'ArrowRight') moveForward();
      if (e.key === 'ArrowLeft') moveBackward();
      if (e.key === 'ArrowUp') moveUp();
      if (e.key === 'ArrowDown') moveDown();
    };

    const onKeyUp = () => {
      if (currentAction === actionsEnum?.right?.jumping) {
        return;
      }
      if (currentDirection === 'right') {
        setCurrentAction(actionsEnum?.right?.idle);
        setActionImage(minotaurIdleBlinkingImage);
        setNumberOfFrames(18);
      } else {
        setCurrentAction(actionsEnum?.left?.idle);
        setActionImage(minotaurIdleBlinkingLeftImage);
        setNumberOfFrames(18);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [
    moveForward,
    moveBackward,
    moveUp,
    moveDown,
    minotaurIdleBlinkingImage,
    currentDirection,
    actionsEnum?.right?.idle,
    actionsEnum?.left?.idle,
    minotaurIdleBlinkingLeftImage,
    currentAction,
    actionsEnum?.right?.jumping,
  ]);

  useEffect(() => {
    const slash = () => {
      if (currentDirection === 'right') {
        setActionImage(minotaurSlashingImage);
      } else {
        setActionImage(minotaurSlashingLeftImage);
      }
      setNumberOfFrames(12);
    };
    window.addEventListener('click', slash);
    return () => {
      window.removeEventListener('click', slash);
    };
  }, [currentDirection, minotaurSlashingImage, minotaurSlashingLeftImage]);

  useEffect(() => {
    if (actionImage !== minotaurSlashingImage && actionImage !== minotaurSlashingLeftImage) {
      return;
    }
    const timeout = setTimeout(() => {
      if (currentDirection === 'right') {
        setActionImage(minotaurIdleBlinkingImage);
      } else {
        setActionImage(minotaurIdleBlinkingLeftImage);
      }
      setNumberOfFrames(18);
    }, 400);
    return () => {
      clearTimeout(timeout);
    };
  }, [actionImage, currentDirection, minotaurIdleBlinkingImage, minotaurIdleBlinkingLeftImage, minotaurSlashingImage, minotaurSlashingLeftImage]);

  useEffect(() => {
    const gravityInterval = setInterval(() => {
      if (positionState.y + gravity + velocityState?.y <= 500) {
        setVelocityState((prev) => ({ x: prev.x, y: prev.y + gravity }));
        setPositionState((prev) => ({ x: prev.x, y: prev.y + velocityState.y }));
      } else {
        setVelocityState((prev) => ({ x: prev.x, y: 0 }));
        if (currentAction === actionsEnum?.right?.jumping) {
          setCurrentAction(actionsEnum?.right?.idle);
          setActionImage(minotaurIdleBlinkingImage);
          setNumberOfFrames(18);
        }
      }
    }, 1000 / 60);
    return () => {
      clearInterval(gravityInterval);
    };
  }, [actionsEnum?.right?.idle, actionsEnum?.right?.jumping, currentAction, gravity, minotaurIdleBlinkingImage, positionState.y, velocityState.y]);

  return (
    <Image
      x={positionState?.x}
      y={positionState?.y}
      width={width}
      height={height}
      crop={{
        width: 900,
        height: 900,
        x: 900 * frames,
        y: 0,
      }}
      offset={{
        x: 100,
        y: 100,
      }}
      image={actionImage}
      {...props}
    />
  );
};

export default Player;
