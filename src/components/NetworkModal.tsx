

import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    FlatList,
    View,
    Modal,

} from 'react-native';
import { Button } from 'react-native-paper';
import { NetworkType } from '../constants/currency';

type NetworkModalProps = {
    visible: boolean;
    onClose: () => void;
    networks: { name: string; key: NetworkType }[];
    selectedNetwork: NetworkType;
    onSelect: (key: NetworkType) => void;
};

const NetworkModal = ({
    visible,
    onClose,
    networks,
    selectedNetwork,
    onSelect,
}: NetworkModalProps) => {
    const screenWidth = Dimensions.get('window').width;
    const slideAnim = React.useRef(new Animated.Value(-screenWidth)).current;
    const [pressedItem, setPressedItem] = useState<string | null>(null);

    const handlePressIn = (key: string) => () => {
        setPressedItem(key);
    };

    const handlePressOut = () => {
        setPressedItem(null);
    };

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: visible ? 0 : -screenWidth,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, [visible, slideAnim, screenWidth]);

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <TouchableOpacity
                    style={styles.modalBackground}
                    activeOpacity={1}
                    onPress={onClose}
                >
                    <Animated.View style={[styles.modalContent, { transform: [{ translateX: slideAnim }] }]}>
                        <Text style={styles.modalTitle}>Select Network</Text>
                        <FlatList
                            data={networks}
                            keyExtractor={(item) => item.key}
                            contentContainerStyle={styles.listContent}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.networkItem,
                                        pressedItem === item.key && styles.itemPressed,
                                        selectedNetwork === item.key && styles.selectedItem,
                                    ]}
                                    activeOpacity={0.7}
                                    onPressIn={handlePressIn(item.key)}
                                    onPressOut={handlePressOut}
                                    onPress={() => {
                                        onSelect(item.key);
                                        onClose();
                                    }}
                                >
                                    <Text style={[
                                        styles.networkText,
                                        selectedNetwork === item.key && styles.selectedText,
                                    ]}>
                                        {item.name}
                                    </Text>
                                    {selectedNetwork === item.key && (
                                        <Text style={styles.selectedIndicator}>✓</Text>
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                        <Button
                            mode="contained"
                            onPress={onClose}
                            style={styles.closeButton}
                            labelStyle={styles.buttonLabel}
                        >
                            Close
                        </Button>
                    </Animated.View>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    modalContent: {
        marginTop: 50,
        alignSelf: 'center',
        backgroundColor: 'white',
        padding: 20,
        width: '100%',
        height: '90%',
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    listContent: {
        flexGrow: 1,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    networkItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    itemPressed: {
        backgroundColor: '#f5f5f5',
        transform: [{ scale: 0.98 }],
    },
    selectedItem: {
        backgroundColor: '#e3f2fd',
        borderLeftWidth: 4,
        borderLeftColor: '#2196F3',
    },
    networkText: {
        fontSize: 16,
        color: '#333',
    },
    selectedText: {
        color: '#2196F3',
        fontWeight: '600',
    },
    selectedIndicator: {
        color: '#2196F3',
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        marginTop: 20,
        alignSelf: 'center',
        borderRadius: 8,
        backgroundColor: '#2196F3',
    },
    buttonLabel: {
        color: '#fff',
        fontWeight: '500',
    },
});

export default NetworkModal;
