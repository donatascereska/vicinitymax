declare global {
  interface Window {
    OCRAD: any;
  }
}

export const detectObject = ({
  settings,
  canvasOriginal,
  contextOriginal,
  contextBW,
  canvasFilled,
  contextFilled,
  canvasPlate,
  contextPlate
}: any) => {
  const {
    canvasW,
    canvasH,
    contrast,
    minContrast,
    maxContrast,
    platePadding,
    detectDelay
  } = settings;

  const opts: any = {
    dotsDiffX: 100,
    dotsDiffY: 50,
    dotsData: [],
    whitePxCnt: 0,
    detectedArr: [],
    inProgress: false,
    activePlates: ['LRS001', 'BBB716', 'JPV483'],
    currentActive: '',
    minWidth: 100,
    minHeight: 22,
    maxWidth: 640,
    maxHeight: 200
  };

  const fill = (x: number, y: number, index: number) => {
    opts.whitePxCnt = 0;
    let queue = [{ x, y }],
      region: any,
      tmpPoint = {
        x: 0,
        y: 0
      };

    let leftX = 0,
      leftYMin = canvasH,
      leftYMax = 0,
      rightX = 0,
      rightYMin = canvasH,
      rightYMax = 0;

    let isMatched = false;

    function moveUp(cb: any) {
      let cnt = 0;

      while (queue.length) {
        const point = queue.pop();

        const image = contextBW.getImageData(point.x, point.y, 1, 1);

        const pixel = image.data;

        if (pixel[0] === 255 && pixel[1] === 255 && pixel[2] === 255) {
          if (point.y > 0) {
            queue.push({ x: point.x, y: point.y - 1 });

            pixel[0] = 255;
            pixel[1] = 0;
            pixel[2] = 0;
            pixel[3] = 255;

            contextBW.putImageData(image, point.x, point.y);

            cnt++;
          }
        } else {
          if (pixel[0] === 0 && pixel[1] === 0 && pixel[2] === 0) {
            point;

            cb(point);

            break;
          }
        }

        if (cnt > 100) {
          break;
        }
      }
    }

    function moveLeft(point: any, cb: any) {
      let cnt = 0;

      tmpPoint = point;

      queue = [{ x: point.x - 1, y: point.y + 1 }];

      while (queue.length) {
        let point = queue.pop();

        const image = contextBW.getImageData(point.x, point.y, 1, 1);

        const pixel = image.data;

        if (pixel[0] === 255 && pixel[1] === 255 && pixel[2] === 255) {
          pixel[0] = 255;
          pixel[1] = 0;
          pixel[2] = 0;
          pixel[3] = 255;

          if (leftYMax < point.y) {
            leftYMax = point.y;
          }
          if (leftYMin > point.y) {
            leftYMin = point.y;
          }

          const diff = Math.abs(tmpPoint.y - point.y);
          //let diffY = initPoint.y - tmpPoint.y

          if (diff > 1) {
            point = tmpPoint;

            leftX = point.x;

            cb({
              dir: 'left',
              x: leftX,
              y: leftYMin,
              yMax: leftYMax,
              yDiff: leftYMax - leftYMin + 5
            });

            //console.log('moveLeft', cnt)

            break;
          } else {
            contextBW.putImageData(image, point.x, point.y);
          }

          if (point.y > 0) {
            queue.push({ x: point.x, y: point.y - 1 });
          }

          if (point.y < settings.canvasH) {
            queue.push({ x: point.x, y: point.y + 1 });
          }

          if (point.x > 0) {
            queue.push({ x: point.x - 1, y: point.y });
          }

          tmpPoint = point;

          if (cnt > 400) {
            break;
          }

          cnt++;
        }
      }
    }

    function moveRight(point: any, cb: any) {
      let cnt = 0;

      tmpPoint = point;

      queue = [{ x: point.x + 1, y: point.y + 1 }];

      while (queue.length) {
        let point = queue.pop();

        const image = contextBW.getImageData(point.x, point.y, 1, 1);

        const pixel = image.data;

        if (pixel[0] === 255 && pixel[1] === 255 && pixel[2] === 255) {
          pixel[0] = 255;
          pixel[1] = 0;
          pixel[2] = 0;
          pixel[3] = 255;

          if (rightYMax < point.y) {
            rightYMax = point.y;
          }

          if (rightYMin > point.y) {
            rightYMin = point.y;
          }

          const diff = Math.abs(tmpPoint.y - point.y);
          //let diffY = Math.abs(initPoint.y - tmpPoint.y)

          if (diff > 1) {
            point = tmpPoint;

            rightX = point.x;

            cb({
              dir: 'right',
              x: rightX,
              y: rightYMin,
              yMax: rightYMax,
              yDiff: rightYMax - rightYMin + 5
            });

            //console.log('moveRight', cnt)

            break;
          } else {
            contextBW.putImageData(image, point.x, point.y);
          }

          if (point.y < settings.canvasH) {
            queue.push({ x: point.x, y: point.y + 1 });
          }

          if (point.x < settings.canvasW) {
            queue.push({ x: point.x + 1, y: point.y });
          }

          if (point.y > 0) {
            queue.push({ x: point.x, y: point.y - 1 });
          }

          tmpPoint = point;

          if (cnt > 400) {
            break;
          }

          cnt++;
        }
      }
    }

    function isCharValid(dChar: any, aChar: any) {
      let isValid = false;

      if (dChar === aChar) {
        isValid = true;
      } else {
        const charSubstObj = {
          B: ['8'],
          8: ['B'],
          C: ['G'],
          G: ['C'],
          D: ['O', '0'],
          O: ['D', '0'],
          0: ['D', '0'],
          7: ['T', '1'],
          T: ['7', '1'],
          1: ['7', '7', 'I'],
          I: ['1'],
          S: ['5'],
          5: ['S'],
          Š: ['S']
        };

        for (const key in charSubstObj) {
          if (key === dChar) {
            for (let i6 = 0; i6 < charSubstObj[key].length; i6++) {
              const charIen = charSubstObj[key][i6];

              if (charIen === aChar) {
                isValid = true;
              }
            }
          }
        }
      }

      return isValid;
    }

    moveUp(function (point: any) {
      moveLeft(point, function (pointTopLeft: any) {
        moveRight(point, function (pointTopRight: any) {
          region = {
            boundaries: [
              {
                x: pointTopLeft.x - platePadding * 2,
                y: pointTopLeft.y - platePadding * 2
              },
              {
                x: pointTopRight.x + platePadding * 2,
                y: pointTopRight.y - platePadding * 2
              },
              {
                x: pointTopRight.x + platePadding * 2,
                y: (function () {
                  if (pointTopLeft.yDiff > pointTopRight.yDiff) {
                    return (
                      pointTopRight.y + pointTopLeft.yDiff + platePadding * 2
                    );
                  } else {
                    return (
                      pointTopRight.y + pointTopRight.yDiff + platePadding * 2
                    );
                  }
                })()
              },
              {
                x: pointTopLeft.x - platePadding * 2,
                y: (function () {
                  if (pointTopLeft.yDiff > pointTopRight.yDiff) {
                    return (
                      pointTopLeft.y + pointTopLeft.yDiff + platePadding * 2
                    );
                  } else {
                    return (
                      pointTopLeft.y + pointTopRight.yDiff + platePadding * 2
                    );
                  }
                })()
              }
            ],
            width:
              pointTopRight.x +
              platePadding * 2 -
              (pointTopLeft.x - platePadding * 2),
            height: (function () {
              let _h = 0;

              if (pointTopLeft.yMax > pointTopRight.yMax) {
                _h = pointTopLeft.yMax - pointTopLeft.y;
              } else {
                _h = pointTopRight.yMax - pointTopRight.y;
              }

              return _h;
            })()
          };

          // eo Region detection

          //

          if (
            opts.minWidth <= region.width &&
            opts.minHeight <= region.height
          ) {
            //console.log(pointTopLeft, pointTopRight);

            let ctx = contextFilled; //s.contextOriginal
            ctx.beginPath();
            ctx.moveTo(
              region.boundaries[0].x - settings.platePadding,
              region.boundaries[0].y - settings.platePadding
            );
            ctx.lineTo(
              region.boundaries[1].x + settings.platePadding,
              region.boundaries[1].y - settings.platePadding
            );
            ctx.lineTo(
              region.boundaries[2].x + settings.platePadding,
              region.boundaries[2].y + settings.platePadding
            );
            ctx.lineTo(
              region.boundaries[3].x - settings.platePadding,
              region.boundaries[3].y + settings.platePadding
            );
            ctx.lineTo(
              region.boundaries[0].x - settings.platePadding,
              region.boundaries[0].y + settings.platePadding
            );
            ctx.fillStyle = 'rgba(125, 125, 125, .5)';
            ctx.fill();

            ctx = contextFilled; //s.contextOriginal
            ctx.beginPath();
            ctx.moveTo(
              region.boundaries[0].x - settings.platePadding,
              region.boundaries[0].y - settings.platePadding
            );
            ctx.lineTo(
              region.boundaries[1].x + settings.platePadding,
              region.boundaries[1].y - settings.platePadding
            );
            ctx.lineTo(
              region.boundaries[2].x + settings.platePadding,
              region.boundaries[2].y + settings.platePadding
            );
            ctx.lineTo(
              region.boundaries[3].x - settings.platePadding,
              region.boundaries[3].y + settings.platePadding
            );
            ctx.lineTo(
              region.boundaries[0].x - settings.platePadding,
              region.boundaries[0].y + settings.platePadding
            );
            ctx.fillStyle = 'rgba(255, 0, 0, .1)';
            ctx.fill();

            canvasPlate.width = region.width;
            canvasPlate.height = region.height;

            contextPlate.drawImage(
              canvasFilled,
              region.boundaries[0].x,
              region.boundaries[0].y,
              region.width,
              region.height,
              0,
              0,
              region.width,
              region.height
            );

            const plateNoRaw = window.OCRAD(canvasPlate);

            const plateNo = plateNoRaw
              .replace(/[^A-Za-z0-9]+/g, '')
              .toUpperCase();

            if (plateNo && plateNo.length >= 3 && plateNo.length <= 8) {
              ctx = contextFilled; //s.contextOriginal
              ctx.beginPath();
              ctx.moveTo(
                region.boundaries[0].x - settings.platePadding,
                region.boundaries[0].y - settings.platePadding
              );
              ctx.lineTo(
                region.boundaries[1].x + settings.platePadding,
                region.boundaries[1].y - settings.platePadding
              );
              ctx.lineTo(
                region.boundaries[2].x + settings.platePadding,
                region.boundaries[2].y + settings.platePadding
              );
              ctx.lineTo(
                region.boundaries[3].x - settings.platePadding,
                region.boundaries[3].y + settings.platePadding
              );
              ctx.lineTo(
                region.boundaries[0].x - settings.platePadding,
                region.boundaries[0].y + settings.platePadding
              );
              ctx.fillStyle = 'rgba(0, 255, 0, .2)';
              ctx.fill();

              opts.detectedArr.push({
                value: plateNo,
                region: region
              });

              //document.getElementById('detected-plate').innerHTML = plateNo; // ? only for dev

              console.log('Detected: ', plateNo, '||', plateNoRaw);

              const displayMatch = (activePlate: any) => {
                ctx = contextFilled; //s.contextOriginal
                ctx.beginPath();
                ctx.moveTo(
                  region.boundaries[0].x - settings.platePadding,
                  region.boundaries[0].y - settings.platePadding
                );
                ctx.lineTo(
                  region.boundaries[1].x + settings.platePadding,
                  region.boundaries[1].y - settings.platePadding
                );
                ctx.lineTo(
                  region.boundaries[2].x + settings.platePadding,
                  region.boundaries[2].y + settings.platePadding
                );
                ctx.lineTo(
                  region.boundaries[3].x - settings.platePadding,
                  region.boundaries[3].y + settings.platePadding
                );
                ctx.lineTo(
                  region.boundaries[0].x - settings.platePadding,
                  region.boundaries[0].y + settings.platePadding
                );
                ctx.fillStyle = 'rgba(0, 255, 0, .3)';
                ctx.fill();

                // document.getElementById('detected-plate').innerHTML =
                opts.currentActive = activePlate;

                console.log(
                  '%c' + activePlate,
                  'color: yellow; font-size: 3rem;'
                );

                isMatched = true;

                // $.post({
                //     url: "/plateDetected"
                // });
              };

              for (let i = 0; i < opts.activePlates.length; ++i) {
                const activePlate = opts.activePlates[i];

                if (activePlate.search(plateNo) > -1) {
                  displayMatch(activePlate);
                  return;
                }
              }

              for (let i2 = 0; i2 < opts.detectedArr.length; ++i2) {
                const detectedPlate = opts.detectedArr[i2].value;

                const detectedPlateLen = detectedPlate.length;

                for (let i3 = 0; i3 < opts.activePlates.length; ++i3) {
                  const activePlate = opts.activePlates[i3];

                  let cnt = 0;

                  for (let i4 = 0; i4 < detectedPlateLen; i4++) {
                    const detectedChar = detectedPlate[i4];

                    const activeChar = activePlate[i4];

                    if (isCharValid(detectedChar, activeChar)) {
                      cnt++;

                      if (cnt === detectedPlateLen) {
                        displayMatch(activePlate);
                      }
                    }
                  }
                }
              }
            } else {
              ctx = contextFilled; //s.contextOriginal
              ctx.beginPath();
              ctx.moveTo(
                region.boundaries[0].x - settings.platePadding,
                region.boundaries[0].y - settings.platePadding
              );
              ctx.lineTo(
                region.boundaries[1].x + settings.platePadding,
                region.boundaries[1].y - settings.platePadding
              );
              ctx.lineTo(
                region.boundaries[2].x + settings.platePadding,
                region.boundaries[2].y + settings.platePadding
              );
              ctx.lineTo(
                region.boundaries[3].x - settings.platePadding,
                region.boundaries[3].y + settings.platePadding
              );
              ctx.lineTo(
                region.boundaries[0].x - settings.platePadding,
                region.boundaries[0].y + settings.platePadding
              );
              ctx.fillStyle = 'rgba(255, 255, 0, .3)';
              ctx.fill();
            }
          }
        });
      });
    });

    setTimeout(
      () => {
        if (isMatched) {
          isMatched = false;
          //document.getElementById('detected-plate').innerHTML = '';
        }

        loopDotMatrix(++index);
      },
      isMatched ? detectDelay * 1000 : 0
    );

    if (index === opts.dotsData.length - 1) {
      setTimeout(() => {}, 0);
    }
  };

  const loopDotMatrix = (index: number) => {
    if (index < opts.dotsData.length) {
      const { x, y } = opts.dotsData[index];
      fill(x, y, index);
    }
  };

  const makeContrast = () => {
    const imgPixels = contextBW.getImageData(0, 0, canvasW, canvasH);

    const buf = new ArrayBuffer(imgPixels.data.length);
    const buf8 = new Uint8ClampedArray(buf);
    const data = new Uint32Array(buf);

    let i4 = 0,
      x = 1,
      y = 1;

    const newContrast =
      Math.floor(Math.random() * (maxContrast - minContrast)) + minContrast;
    opts.dotsDiffX = Math.floor(Math.random() * (60 - 30)) + 30;
    opts.dotsDiffY = Math.floor(Math.random() * (60 - 30)) + 30;

    for (let i = 0; i < data.length; i++) {
      const grey = imgPixels.data[i4];
      const contrast = grey >= settings.contrast ? 255 : 0;
      data[i] = (255 << 24) | (contrast << 16) | (contrast << 8) | contrast;
      if (x % opts.dotsDiffX === 0 && y % opts.dotsDiffY === 0) {
        if (contrast === 255) {
          //data[i] = (255 << 24) | (0 << 16) | (0 << 8) | 255;
          opts.dotsData.push({
            x,
            y
          });
        }
      }

      if (contrast === 255) {
        opts.whitePxCnt++;
      }

      if (x % canvasW === 0) {
        x = 1;
        y = y + 1;
      } else {
        x = x + 1;
      }

      i4 = i4 + 4;
    }

    imgPixels.data.set(buf8);
    contextBW.putImageData(imgPixels, 0, 0);
    //contextFilled.putImageData(imgPixels, 0, 0);

    loopDotMatrix(0);
  };

  makeContrast();
};
