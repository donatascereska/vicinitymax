import { useState } from 'react';
import { AppShell, Navbar, Header, Title, MultiSelect } from '@mantine/core';
import SettingsForm from './forms/SettingsForm/SettingsForm';
import Stage from './modules/Stage/Stage';
import { SettingsProps, SettingsFormValuesProps } from './helpers/typings';
import './App.css';

const App = () => {
  const [settings, setSettings] = useState<SettingsProps>({
    canvasW: 1280,
    canvasH: 400,
    videoW: 1280,
    videoH: 720
  });

  const hanbdleSubmit = (values: SettingsFormValuesProps) => {
    setSettings({
      ...settings,
      ...values
    });
  };
  const [data, setData] = useState(['React', 'Angular', 'Svelte', 'Vue']);
  return (
    <AppShell
      padding={0}
      navbar={
        <Navbar width={{ base: 300 }} p="xs">
          <SettingsForm onSubmit={hanbdleSubmit} />
          <MultiSelect
            label="Creatable MultiSelect"
            data={data}
            placeholder="Select items"
            searchable
            creatable
            getCreateLabel={(query) => `+ Create ${query}`}
            onCreate={(query) => setData((current) => [...current, query])}
          />
        </Navbar>
      }
      header={
        <Header height={60} p="xs">
          <Title order={2}>
            VicinityMAX - automatic licence plate recognition (ALPR) for low
            resource systems
          </Title>
        </Header>
      }
    >
      <Stage settings={settings} />
    </AppShell>
  );
};

export default App;
