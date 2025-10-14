import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '../../components/layout/Screen';
import { Button } from '../../components/common/Button';
import { useTheme } from '../../components/layout/ThemeProvider';
import { useUser } from '../../hooks/useUser';
import { useEntryStore } from '../../stores/entry.store';
import { EntryCard } from '../../components/entry/EntryCard';
import { Ionicons } from '@expo/vector-icons';

export default function Dashboard() {
  const { theme } = useTheme();
  const { name } = useUser();
  const entries = useEntryStore((state) => state.entries);

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour >= 4 && hour < 12) {
      return `Good Morning,`;
    } else if (hour >= 12 && hour < 17) {
      return `Good Afternoon,`;
    } else if (hour >= 17 && hour < 3) {
      return `Good Evening,`;
    } else {
      return `Greetings,`;
    }
  };

  const navigateToSettings = () => {
    router.push('/settings');
  };

  const navigateToNewEntry = () => {
    router.push('/entry/new');
  };

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.greetingContainer}>
          <Text style={[styles.greeting, { color: theme.colors.textSecondary }]}>
            {getTimeBasedGreeting()}
          </Text>
          <Text style={[styles.userName, { color: theme.colors.text }]}>
            {name}
          </Text>
        </View>
        <Pressable onPress={navigateToSettings}>
          <Ionicons 
            name="settings-outline" 
            size={24} 
            color={theme.colors.text} 
          />
        </Pressable>
      </View>

      {entries.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            No entries yet. Write your first message to your future self!
          </Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          renderItem={({ item }) => <EntryCard entry={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}

      <Button 
        title="+ New Entry"
        onPress={navigateToNewEntry}
        style={styles.button}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greetingContainer: {
    gap: 4,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '500',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  list: {
    flexGrow: 1,
  },
  button: {
    marginTop: 16,
  },
}); 