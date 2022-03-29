import { ReactElement, useState } from 'react';
import { AppShell, Navbar, Header, Title } from '@mantine/core';
import ControlsForm from './forms/ControlsForm/ControlsForm';
import Stage from './modules/Stage/Stage';
import { ControlsProps, SettingsFormValuesProps } from './helpers/typings';
import {
  STAGE_SETTINGS,
  CONTROLS_FORM_INITIAL_VALUES
} from './helpers/constants';
import './App.css';

const App = () => {
  const settings = STAGE_SETTINGS;
  const initialValues = CONTROLS_FORM_INITIAL_VALUES;
  const [controls, setControls] = useState<ControlsProps>(initialValues);

  const handleSubmit = (values: SettingsFormValuesProps) => {
    setControls({
      ...controls,
      ...values
    });
  };

  const renderNavbar = (): ReactElement => (
    <Navbar width={{ base: 300 }} p="xs">
      <ControlsForm initialValues={initialValues} onSubmit={handleSubmit} />
    </Navbar>
  );

  const renderHeader = (): ReactElement => (
    <Header height={60} p="xs">
      <Title order={2}>
        VicinityMAX - automatic licence plate recognition (ALPR) for low
        resource systems
      </Title>
    </Header>
  );

  return (
    <AppShell padding={0} navbar={renderNavbar()} header={renderHeader()}>
      <Stage settings={settings} controls={controls} />
    </AppShell>
  );
};

export default App;
