import { useRef, useState, useEffect } from 'react';
import { useInterval } from '@mantine/hooks';
import { StageProps } from './typings';
import { detectObject } from '../../helpers/utils';
import useStyles from './Stage.style';

function Stage({ settings }: StageProps) {
  const { classes } = useStyles();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasOriginalRef = useRef<HTMLCanvasElement>(null);
  const canvasBWRef = useRef<HTMLCanvasElement>(null);
  const canvasFilledRef = useRef<HTMLCanvasElement>(null);
  const canvasPlateRef = useRef<HTMLCanvasElement>(null);
  const [contextOriginal, setContextOriginal] =
    useState<CanvasRenderingContext2D | null>(null);
  const [contextBW, setContextBW] = useState<CanvasRenderingContext2D | null>(
    null
  );
  const [contextFilled, setContextFilled] =
    useState<CanvasRenderingContext2D | null>(null);
  const [contextPlate, setContextPlate] =
    useState<CanvasRenderingContext2D | null>(null);
  const video = videoRef.current;
  const canvasOriginal = canvasOriginalRef.current;
  const canvasBW = canvasBWRef.current;
  const canvasFilled = canvasFilledRef.current;
  const canvasPlate = canvasPlateRef.current;

  const { canvasW, canvasH, videoW, videoH } = settings;

  const processFrame = () => {
    if (
      video &&
      canvasOriginal &&
      contextOriginal &&
      canvasBW &&
      contextBW &&
      canvasFilled &&
      contextFilled
    ) {
      canvasOriginal.width = canvasW;
      canvasOriginal.height = canvasH;
      canvasBW.width = canvasW;
      canvasBW.height = canvasH;
      canvasFilled.width = canvasW;
      canvasFilled.height = canvasH;
      const diffW = (videoW - canvasW) / 2;
      const diffH = (videoH - canvasH) / 2;
      contextOriginal.drawImage(
        video,
        diffW,
        diffH,
        canvasW,
        canvasH,
        0,
        0,
        canvasW,
        canvasH
      );
      contextBW.filter = `blur(${blur}px) grayscale(100%)`;
      contextBW.drawImage(
        video,
        diffW,
        diffH,
        canvasW,
        canvasH,
        0,
        0,
        canvasW,
        canvasH
      );

      contextFilled.drawImage(
        video,
        diffW,
        diffH,
        canvasW,
        canvasH,
        0,
        0,
        canvasW,
        canvasH
      );

      detectObject({
        settings,
        canvasOriginal,
        contextOriginal,
        contextBW,
        canvasFilled,
        contextFilled,
        canvasPlate,
        contextPlate
      });
    }
  };

  const interval = useInterval(processFrame, 0);

  const openCamera = () => {
    if ('mediaDevices' in navigator) {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            width: videoW,
            height: videoH
          },
          audio: false
        })
        .then((mediaStream) => {
          if (video) {
            video.addEventListener('loadeddata', () => {
              video.play();
              interval.start();
            });
            video.srcObject = mediaStream;
          }
        });
    }
  };

  useEffect(() => {
    interval.stop();
    console.log('STOP');
    setTimeout(() => {
      console.log('PLAY');
      interval.start();
    }, 3000);
  }, [settings]);

  useEffect(() => {
    if (!interval.active) {
      //interval.start();
    }
  }, [interval.active]);

  useEffect(() => {
    if (canvasOriginal && canvasBW && canvasFilled && canvasPlate) {
      const ctxOriginal = canvasOriginal.getContext('2d');
      setContextOriginal(ctxOriginal);
      const ctxBW = canvasBW.getContext('2d');
      setContextBW(ctxBW);
      const ctxFilled = canvasFilled.getContext('2d');
      setContextFilled(ctxFilled);
      const ctxPlate = canvasPlate.getContext('2d');
      setContextPlate(ctxPlate);
    }
  }, [canvasOriginal, canvasBW, canvasFilled, canvasPlate]);

  useEffect(() => {
    if (contextOriginal && contextBW && contextFilled && contextPlate) {
      openCamera();
    }
  }, [contextOriginal, contextBW, contextFilled, contextPlate]);

  return (
    <div className={classes.container}>
      <video ref={videoRef} className={classes.video} />
      <canvas
        ref={canvasOriginalRef}
        id="canvas-original"
        className={classes.canvasOriginal}
      />
      <canvas ref={canvasBWRef} id="canvas-BW" className={classes.canvasBW} />
      <canvas
        ref={canvasFilledRef}
        id="canvas-filled"
        className={classes.canvasFilled}
        style={{ width: canvasW, height: canvasH }}
      />
      <canvas
        ref={canvasPlateRef}
        id="canvas-plate"
        className={classes.canvasPlate}
      />
    </div>
  );
}

export default Stage;
