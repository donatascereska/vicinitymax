import { Slider as MantineSlider } from '@mantine/core';

const Slider = ({ label = null, ...otherProps }: any) => (
  <MantineSlider size={2} label={label} {...otherProps} />
);

export default Slider;
