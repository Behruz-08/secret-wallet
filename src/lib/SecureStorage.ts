

import * as Keychain from 'react-native-keychain';

const SERVICE_NAME = 'myApp'; // базовое имя сервиса

type KeychainAccount = 'is_registered' | 'first_run' | 'seed_phrase';

// Собственный тип для опций (можно расширять по необходимости)
interface SetOptions {
  accessible?: Keychain.ACCESSIBLE;
  rules?: Keychain.SECURITY_RULES;
}

const keychainService = {
  async get(account: KeychainAccount): Promise<string | null> {
    try {
      // Формируем уникальное имя сервиса для каждой записи
      const result = await Keychain.getGenericPassword({
        service: `${SERVICE_NAME}_${account}`,
      });
      return result ? result.password : null;
    } catch (error) {
      console.error(`Keychain get error (${account}):`, error);
      return null;
    }
  },

  async set(account: KeychainAccount, value: string, options?: SetOptions): Promise<void> {
    try {
      // Используем account как username, а имя сервиса составное
      await Keychain.setGenericPassword(
        account, // username (можно использовать просто account)
        value,   // password
        {
          service: `${SERVICE_NAME}_${account}`,
          ...options,
        }
      );
    } catch (error) {
      console.error(`Keychain set error (${account}):`, error);
      throw error;
    }
  },
};

export const getRegistrationStatus = async (): Promise<boolean> => {
  const status = await keychainService.get('is_registered');
  return status === 'true';
};

export const setRegistrationStatus = async (status: boolean): Promise<void> => {
  await keychainService.set('is_registered', status.toString(), {
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
  });
};

export const isFirstRun = async (): Promise<boolean> => {
  const result = await keychainService.get('first_run');
  return result === null; // Если запись отсутствует, считаем, что это первый запуск
};

export const markFirstRun = async (): Promise<void> => {
  await keychainService.set('first_run', 'false', {
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
  });
};

export const saveSeedPhrase = async (seed: string): Promise<void> => {
  await keychainService.set('seed_phrase', seed, {
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    rules: Keychain.SECURITY_RULES.NONE,
  });
};

export const getSeedPhrase = async (): Promise<string | null> => {
  const phrase = await keychainService.get('seed_phrase');
  console.log('Полученная seed-фраза:', phrase);
  return phrase;
};
