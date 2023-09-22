import React, { useState, useEffect } from "react";
import {
    Text,
    TouchableOpacity,
    View,
    TextInput,
    Button,
    Modal,
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
} from "react-native";
import { Image } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { StatusBar } from "react-native";
import StockCard from "./StockCard";
import { useDarkMode } from "./common/darkmode/DarkModeContext"; // Import the hook
import { Picker } from '@react-native-picker/picker'; // Import the picker

const PortFolio = () => {
    const { isDarkMode } = useDarkMode(); // Use the hook to access dark mode state

    // Pop up a window to get input from the user about the stocks or crypto info
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [assetName, setAssetName] = useState('');
    const [assetPrice, setAssetPrice] = useState('');
    const [assetQuantity, setAssetQuantity] = useState('');
    const [selectedValue, setSelectedValue] = useState('Stock');
    const [userAssets, setUserAssets] = useState([]); // Array to store the user's assets
    const [totalStockValue, setTotalStockValue] = useState(0); // Initialize totalStockValue state
    const [totalCryptoValue, setTotalCryptoValue] = useState(0); // Initialize totalCryptoValue state
    const [totalAssetsValue, setTotalAssetsValue] = useState(0); // Initialize totalAssetsValue state
    const [cryptoTotalValues, setCryptoTotalValues] = useState([]);
    const [stockTotalValues, setStockTotalValues] = useState([]); // Initialize stockTotalValues state

    // Helper function to generate a random color
    const getRandomColor = () => {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const hideModal = () => {
        setIsModalVisible(false);
    };

    const handleSave = () => {
        // Create an object to store the asset details
        const newAsset = {
            name: assetName,
            price: parseFloat(assetPrice),
            quantity: parseInt(assetQuantity),
            type: selectedValue,
        };

        // Update userAssets with the new asset
        setUserAssets([...userAssets, newAsset]);

        // Calculate the total value for the new asset
        let totalValue = newAsset.price * newAsset.quantity;

        // For displaying the value by the asset type
        if (newAsset.type === 'Stock') {
            setStockTotalValues([...stockTotalValues, totalValue]);
        } else if (newAsset.type === 'Crypto') {
            const newCryptoAsset = {
                name: assetName,
                totalValue: totalValue,
            };
            setCryptoTotalValues([...cryptoTotalValues, newCryptoAsset]);
        }

        // Clear the input fields
        setAssetName('');
        setAssetPrice('');
        setAssetQuantity('');
        setSelectedValue('Stock');

        hideModal();
    };

    const screenWidth = Dimensions.get("window").width;

    const chartData = userAssets.map((asset) => ({
        name: asset.name,
        price: asset.price * asset.quantity, // Calculate the total price for the asset
        color: getRandomColor(),
        legendFontColor: "#7F7F7F",
        legendFontSize: 15,
    }));

    const chartConfig = {
        backgroundGradientFrom: "#fff",
        backgroundGradientTo: "#fff",
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    };

    // Apply dark mode styles conditionally
    const containerStyle = [
        styles.container,
        isDarkMode && styles.darkModeContainer,
    ];

    const earnedMoneyStyle = isDarkMode
        ? styles.darkModeEarnedMoney
        : styles.earnedMoney;
    const losesMoneyStyle = isDarkMode
        ? styles.darkModeLosesMoney
        : styles.losesMoney;

    // Calculate totalStockValue and totalCryptoValue when stockTotalValues and cryptoTotalValues change
    useEffect(() => {
        const stockValue = stockTotalValues.reduce((total, value) => total + value, 0);
        const cryptoValue = cryptoTotalValues.reduce((total, crypto) => total + crypto.totalValue, 0);
        setTotalStockValue(stockValue);
        setTotalCryptoValue(cryptoValue);
    }, [stockTotalValues, cryptoTotalValues]);

    // Calculate totalAssetsValue whenever totalStockValue or totalCryptoValue changes
    useEffect(() => {
        setTotalAssetsValue(totalStockValue + totalCryptoValue);
    }, [totalStockValue, totalCryptoValue]);

    return (
        <View style={containerStyle}>
            <View style={styles.topBar}>
                <Button title="Add" onPress={showModal} />
            </View>
            <Modal visible={isModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text>Fill in the fields: </Text>
                        <Text>{"\n"}</Text>
                        <TextInput
                            value={assetName}
                            onChangeText={(text) => setAssetName(text)}
                            placeholder="Enter the name of asset"
                        />
                        <TextInput
                            value={assetPrice}
                            onChangeText={(text) => setAssetPrice(text)}
                            placeholder="Enter the price of asset"
                            keyboardType="numeric"
                        />
                        <TextInput
                            value={assetQuantity}
                            onChangeText={(text) => setAssetQuantity(text)}
                            placeholder="Enter the quantity of asset"
                            keyboardType="numeric"
                        />
                        <View style={styles.pickerContainer}>
                            <Text>{"\n"}</Text>
                            <Text style={styles.selectOptionText}>Select an option:</Text>
                            <Picker
                                selectedValue={selectedValue}
                                onValueChange={(itemValue) => setSelectedValue(itemValue)}
                            >
                                <Picker.Item label="Stock" value="Stock" />
                                <Picker.Item label="Crypto" value="Crypto" />
                            </Picker>
                            <Text>Selected asset Type: {selectedValue}</Text>
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button title="Save" onPress={handleSave} />
                            <Button title="Close" onPress={hideModal} />
                        </View>
                    </View>
                </View>
            </Modal>
            <PieChart
                data={chartData}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                accessor="price"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
            />
            {/* Render total values for stocks */}
            <Text style={styles.assetValue}>Stocks Total Values:</Text>
            {userAssets.map((asset, index) => (
                <Text key={index}>
                    {asset.name}: ${asset.price * asset.quantity}
                </Text>
            ))}
            <Text>Total Stock Assets: ${totalStockValue}</Text>
            <Text>{"\n"}</Text>

            {/* Render total values for cryptos */}
            <Text style={styles.assetValue}>Cryptos Total Values:</Text>
            {cryptoTotalValues.map((crypto, index) => (
                <Text key={index}>
                    {crypto.name}: ${crypto.totalValue}
                </Text>
            ))}
            <Text>Total Crypto Assets: ${totalCryptoValue}</Text>
            <Text>{"\n"}</Text>
            <StatusBar style="auto" />
            <Text style={styles.totalValue}>Total assets values: ${totalAssetsValue}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    darkModeContainer: {
        backgroundColor: "#333", // Dark mode background color
    },
    earnedMoney: {
        color: "blue",
    },
    darkModeEarnedMoney: {
        color: "lightblue", // Dark mode text color
    },
    losesMoney: {
        color: "red",
    },
    darkModeLosesMoney: {
        color: "pink", // Dark mode text color
    },
    addButton: {
        backgroundColor: "blue",
        color: "black",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background for the modal
    },
    modalContent: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        height: "60%",
        width: "80%",
        alignItems: "center",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        marginTop: 20,
    },
    topBar: {
        position: 'absolute',
        top: 10,  // Adjust this value as needed to position the button vertically
        left: 10, // Adjust this value as needed to position the button horizontally
        flexDirection: "row", // Arrange items horizontally
    },
    pickerContainer: {
        flex: 1,
    },
    assetValue: {
        fontSize: 15,
        fontWeight: "bold",
    },
    totalValue: {
        fontSize: 20,
        fontWeight: "bold",
        color: "blue",
    },
    selectOptionText: {
        marginBottom: 5, // Adjust this value as needed to reduce the gap
    },
});

export default PortFolio;
