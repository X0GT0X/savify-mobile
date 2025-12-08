import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import { useTranslation } from 'react-i18next';
import { DynamicColorIOS } from 'react-native';

const TabLayout = () => {
  const { t } = useTranslation();

  return (
    <NativeTabs
      labelStyle={{ color: DynamicColorIOS({ light: '#202020', dark: '#E6E6E6' }) }}
      iconColor={DynamicColorIOS({ light: '#202020', dark: '#E6E6E6' })}
      tintColor={DynamicColorIOS({ light: '#202020', dark: '#E6E6E6' })}>
      <NativeTabs.Trigger name="index">
        <Label>{t('Home')}</Label>
        <Icon sf={{ default: 'house', selected: 'house.fill' }} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="overview">
        <Label>{t('Overview')}</Label>
        <Icon sf={{ default: 'square.grid.2x2', selected: 'square.grid.2x2.fill' }} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="analytics">
        <Label>{t('Analytics')}</Label>
        <Icon sf={{ default: 'chart.bar', selected: 'chart.bar.fill' }} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <Icon sf={{ default: 'gearshape', selected: 'gearshape.fill' }} />
        <Label>{t('Settings')}</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
};

export default TabLayout;
