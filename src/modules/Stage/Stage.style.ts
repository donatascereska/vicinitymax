import { createStyles } from '@mantine/core';

export default createStyles(() => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    height: '100%',
    backgroundColor: '#000'
  },
  video: { display: 'none' },
  canvasOriginal: { display: 'none' },
  canvasBW: {},
  canvasFilled: {},
  canvasPlate: { display: 'none' }
}));
