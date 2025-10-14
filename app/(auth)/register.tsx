import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '../../components/layout/Screen';
import { useTheme } from '../../components/layout/ThemeProvider';
import { LoadingOverlay } from '../../components/common/LoadingOverlay';
import { ErrorToast } from '../../components/common/ErrorToast';

export default function Register() {
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorToast, setErrorToast] = useState('');

  const handleContinue = async () => {
    if (!name.trim()) {
      setErrorToast('Please enter your name');
      return;
    }

    setLoading(true);
    try {
      // Save user data locally or to your backend
      router.replace('/(main)/dashboard');
    } catch (error) {
      setErrorToast('Failed to complete registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      {loading && <LoadingOverlay message="Setting up your journal..." />}
      {errorToast && (
        <ErrorToast 
          message={errorToast} 
          onHide={() => setErrorToast('')} 
        />
      )}

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Welcome to Your Rewind Journal
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Let's personalize your experience
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              What's your name?
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              style={[
                styles.input,
                {
                  color: theme.colors.text,
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                }
              ]}
              placeholderTextColor={theme.colors.textSecondary}
              autoFocus
            />
          </View>

          <Pressable
            onPress={handleContinue}
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: theme.colors.primary,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  form: {
    gap: 24,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    fontSize: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 