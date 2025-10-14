import { ScrollView, StyleSheet } from 'react-native';
import { Screen } from '../../components/layout/Screen';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Loading } from '../../components/common/Loading';
import { EntryCard } from '../../components/entry/EntryCard';

export default function TestScreen() {
  const mockEntry = {
    id: '1',
    title: 'Test Entry',
    content: 'This is a test entry',
    createdAt: new Date(),
    unlockDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    isUnlocked: false,
    mediaUrls: [],
  };

  return (
    <Screen>
      <ScrollView style={styles.container}>
        {/* Test Input */}
        <Input
          label="Regular Input"
          placeholder="Type something..."
        />
        <Input
          label="Input with Error"
          placeholder="Type something..."
          error="This is an error message"
        />

        {/* Test Cards */}
        <Card style={styles.card}>
          <Input label="Input in Card" placeholder="Type here..." />
          <Button title="Button in Card" onPress={() => {}} />
        </Card>

        <Card variant="outlined" style={styles.card}>
          <Input label="Input in Outlined Card" placeholder="Type here..." />
          <Button
            title="Secondary Button"
            variant="secondary"
            onPress={() => {}}
          />
        </Card>

        {/* Test EntryCard */}
        <EntryCard entry={mockEntry} />

        {/* Test Loading */}
        <Card style={styles.card}>
          <Loading message="Loading something..." />
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginVertical: 10,
  },
}); 