
import SecureStorage from 'react-native-secure-key-store';
const FIRST_RUN_KEY = 'first_run';


export const isFirstRun = async (): Promise<boolean> => {
  try {
    return !(await SecureStorage.get(FIRST_RUN_KEY));
  } catch {
    return true;
  }
};

export const markFirstRun = async () => {
  await SecureStorage.set(FIRST_RUN_KEY, 'false');
};




// Функция для сохранения seed-фразы

export const saveSeedPhrase = async (seed: string): Promise<void> => {
  try {
    await SecureStorage.set('seed_phrase', seed, {
      accessible: 'AccessibleWhenUnlocked' as any,
    });
  } catch (error) {
    console.error('Error saving seed phrase:', error);
    throw error;
  }
};

// Функция для получения seed-фразы
export const getSeedPhrase = async (): Promise<string | null> => {
  try {
    const result = await SecureStorage.get('seed_phrase');
    console.log('Полученная seed-фраза:', result);
    return result;
  } catch (error) {
    console.error('Ошибка получения seed-фразы:', error);
    return null;
  }
};

