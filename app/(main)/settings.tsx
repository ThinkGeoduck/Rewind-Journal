import { View, Text, StyleSheet, Switch } from 'react-native';
import { Screen } from '../../components/layout/Screen';
import { useTheme } from '../../components/layout/ThemeProvider';
import { useUserStore } from '../../stores/user.store';
import { Button } from '../../components/common/Button';
import { router } from 'expo-router';

export default function Settings() {
  const { theme } = useTheme();
  const { settings, updateSettings, clearUser } = useUserStore();

  const handleLogout = () => {
    clearUser();
    router.replace('/');
  };

  return (
    <Screen>
      <Text style={[styles.title, { color: theme.colors.text }]}>Settings</Text>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Theme
        </Text>
        <View style={styles.option}>
          <Text style={[styles.optionText, { color: theme.colors.text }]}>
            Dark Mode
          </Text>
          <Switch
            value={settings.theme === 'dark'}
            onValueChange={(value) =>
              updateSettings({ theme: value ? 'dark' : 'light' })
            }
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Notifications
        </Text>
        <View style={styles.option}>
          <Text style={[styles.optionText, { color: theme.colors.text }]}>
            Enable Notifications
          </Text>
          <Switch
            value={settings.notifications}
            onValueChange={(value) =>
              updateSettings({ notifications: value })
            }
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Data Management
        </Text>
        <Button
          title="Manage Backups"
          onPress={() => router.push('/settings/backup')}
          variant="secondary"
          style={styles.button}
        />
      </View>

      <View style={styles.footer}>
        <Button
          title="Sign Out"
          onPress={handleLogout}
          variant="secondary"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  optionText: {
    fontSize: 16,
  },
  footer: {
    marginTop: 'auto',
  },
  button: {
    marginTop: 16,
  },
}); 