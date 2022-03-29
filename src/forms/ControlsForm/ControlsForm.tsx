import { useEffect } from 'react';
import { InputWrapper, Group, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import Slider from '../../components/Slider/Slider';
import { SettingsFormProps } from './typings';
import { SettingsFormValuesProps } from '../../helpers/typings';

const ControlsForm = ({ initialValues, onSubmit }: SettingsFormProps) => {
  const {
    getInputProps,
    reset,
    values,
    values: {
      contrast,
      minContrast,
      maxContrast,
      blur,
      platePadding,
      detectDelay
    }
  } = useForm<SettingsFormValuesProps>({ initialValues });

  useEffect(() => {
    onSubmit(values);
  }, [values]);

  return (
    <form>
      <InputWrapper label="Contrast" description={contrast || '0'}>
        <Slider min={0} max={200} {...getInputProps('contrast')} />
      </InputWrapper>
      <InputWrapper label="Min contrast" description={minContrast || '0'}>
        <Slider min={0} max={200} {...getInputProps('minContrast')} />
      </InputWrapper>
      <InputWrapper label="Max contrast" description={maxContrast || '0'}>
        <Slider min={0} max={200} {...getInputProps('maxContrast')} />
      </InputWrapper>
      <InputWrapper label="Blur" description={blur || '0'}>
        <Slider min={0} max={3} {...getInputProps('blur')} />
      </InputWrapper>
      <InputWrapper label="Plate padding" description={platePadding || '0'}>
        <Slider min={0} max={10} {...getInputProps('platePadding')} />
      </InputWrapper>
      <InputWrapper label="Detect delay (s)" description={detectDelay || '0'}>
        <Slider min={0} max={5} {...getInputProps('detectDelay')} />
      </InputWrapper>
      <Group position="center" mt="xl">
        <Button compact variant="default" onClick={reset}>
          Reset
        </Button>
      </Group>
    </form>
  );
};

export default ControlsForm;
