import { SettingsFormValuesProps } from '../../helpers/typings';

export interface SettingsFormProps {
  initialValues: SettingsFormValuesProps;
  onSubmit: (values: SettingsFormValuesProps) => void;
}
