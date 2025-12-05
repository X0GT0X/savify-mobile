import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import { DynamicColorIOS } from 'react-native';

const TabLayout = () => {
  return (
    <NativeTabs tintColor={DynamicColorIOS({ light: '#202020', dark: '#FFFFFF' })}>
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon sf={{ default: 'house', selected: 'house.fill' }} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="overview">
        <Label>Overview</Label>
        <Icon sf={{ default: 'square.grid.2x2', selected: 'square.grid.2x2.fill' }} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="analytics">
        <Label>Analytics</Label>
        <Icon sf={{ default: 'chart.bar', selected: 'chart.bar.fill' }} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <Icon sf={{ default: 'gearshape', selected: 'gearshape.fill' }} />
        <Label>Settings</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
};

export default TabLayout;
