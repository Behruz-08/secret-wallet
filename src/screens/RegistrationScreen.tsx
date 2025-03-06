import React, { useState } from 'react';
import useWallet from '../hooks/useWallet';

import Loading from '../components/Loading';
import BackupPhraseView from '../components/BackupPharseView';
import WelcomeScreen from '../components/WelcomeScreen';
import WalletScreen from './WalletScreen';
import { markFirstRun } from '../lib/SecureStorage';


const RegistrationScreen = () => {
    const {
        isInitialized,
        currentAccount,
        createNewWallet,
        restoreWallet,
        isRegistered,
    } = useWallet();

    const [backupPhrase, setBackupPhrase] = useState('');

    // Создание нового кошелька
    const handleCreateWallet = async () => {
        await markFirstRun();
        const phrase = await createNewWallet();
        setBackupPhrase(phrase);
    };

    // Восстановление кошелька
    const handleRestore = async (phrase: string) => {
        await restoreWallet(phrase);
    };

    if (!isInitialized && !currentAccount) {return <Loading />;}



    if (backupPhrase) {return (
        <BackupPhraseView
            phrase={backupPhrase}
            onConfirm={() => setBackupPhrase('')}
        />
    );}

    if (!isRegistered && !currentAccount) {return (
        <WelcomeScreen
            onCreate={handleCreateWallet}
            onRestore={handleRestore}
        />
    );}



    return <WalletScreen />;
};

export default RegistrationScreen;
