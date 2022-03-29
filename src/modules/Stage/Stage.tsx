import { useRef, useState, useEffect } from 'react';
import { StageProps } from './typings';
import { detectObject } from '../../helpers/utils';
import useStyles from './Stage.style';

function Stage({ settings, controls }: StageProps) {
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
  const [isCameraReady, setIsCameraReady] = useState<boolean>(false);
  const [timer, setTimer] = useState<any>();
  const video = videoRef.current;
  const canvasOriginal = canvasOriginalRef.current;
  const canvasBW = canvasBWRef.current;
  const canvasFilled = canvasFilledRef.current;
  const canvasPlate = canvasPlateRef.current;
  const { videoW, videoH } = settings;

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
              setIsCameraReady(true);
            });
            video.srcObject = mediaStream;
          }
        });
    }
  };

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
      // detectObject({
      //   video,
      //   settings,
      //   controls,
      //   canvasBW,
      //   canvasOriginal,
      //   contextOriginal,
      //   contextBW,
      //   canvasFilled,
      //   contextFilled,
      //   canvasPlate,
      //   contextPlate
      // });
    }
  };

  const start = () => {
    const timer = setInterval(processFrame, 0);
    setTimer(timer);
  };

  const stop = () => {
    clearInterval(timer);
    setTimer(null);
  };

  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  useEffect(() => {
    if (isCameraReady) {
      start();
    }
  }, [isCameraReady]);

  useEffect(() => {
    stop();
    start();
  }, [controls.contrast]);

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
