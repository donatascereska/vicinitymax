import { createStyles } from '@mantine/core';

export default createStyles(() => ({
  container: {
    position: 'relative',
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
  canvasPlate: {
    position: 'absolute',
    top: '5rem',
    right: '5rem'
  }
}));
