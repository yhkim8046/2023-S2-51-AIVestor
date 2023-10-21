import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, SafeAreaView, ScrollView } from 'react-native';
import { getFirestore, collection, getDocs, query, orderBy, where, deleteDoc } from 'firebase/firestore';
import StockCard from './common/cards/StockCard'; 
import CryptoCard from './common/cards/CryptoCard'; 
import cardStyles from './common/cards/Cards.style'; 
import { useNavigation } from '@react-navigation/native';
import Homestyles from "./home-page/HomePage.style";
import { getAuth } from 'firebase/auth';
import { useDarkMode } from './common/darkmode/DarkModeContext'; 

const BookmarkedStocksPage = () => {
  const [bookmarkedItems, setBookmarkedItems] = useState([]);
  const navigation = useNavigation();
  const { isDarkMode } = useDarkMode(); 
  const [activeTab, setActiveTab] = useState('stock');
  const filteredItems = bookmarkedItems.filter(item => item.type === activeTab);

  const handleBack = () => {
    navigation.navigate('HomeStack'); // Navigate back to the previous screen
  };

  useEffect(() => {
    const fetchBookmarkedItems = async () => {
      const db = getFirestore();
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const stocksRef = collection(db, 'bookmarkedStocks');
        const cryptosRef = collection(db, 'bookmarkedCryptos'); // Added reference for cryptos

        const stocksQuery = query(stocksRef, where('userId', '==', user.uid));
        const cryptosQuery = query(cryptosRef, where('userId', '==', user.uid));

        try {
          const stocksSnapshot = await getDocs(stocksQuery);
          const cryptosSnapshot = await getDocs(cryptosQuery);

          const stocks = stocksSnapshot.docs.map(doc => ({ ...doc.data(), type: 'stock' }));
          const cryptos = cryptosSnapshot.docs.map(doc => ({ ...doc.data(), type: 'crypto' }));

          setBookmarkedItems([...stocks, ...cryptos]);
        } catch (error) {
          console.error('Error fetching bookmarked items:', error);
        }
      } else {
        console.log('No authenticated user found');
      }
    };

    fetchBookmarkedItems();
  }, []);


  const styles = {
    container: {
      width: "100%",
      alignItems: "center",
      justifyContent: "flex-start",
    },
    inputIcon: {
      width: 24,
      height: 24,
      marginRight: 8,
    },
    backButtonContainer: {
      position: 'absolute',
      top: 80,
      left: 20,
    },
    backButton: {
      width: 30,
      height: 30,
      tintColor: isDarkMode ? "white" : "black",
    },
    title: {
      fontSize: 24,
      marginBottom: 15,
      color: isDarkMode ? "white" : "black",
    },
    appContainer: {
      flex: 1,
      padding: 15,
      paddingTop: 50,
      width: "100%",
      backgroundColor: isDarkMode ? "#333" : "White",
    },
    header: {
      fontWeight: "bold",
      fontSize: 30,
      paddingTop: 20,
      paddingBottom: 20,
      color: isDarkMode ? "White" : "Black",
    },
    stocks: {
      paddingTop: 20,
      paddingBottom: 20,
    },
    tabButtons: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 10,
    },
    tabButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      marginHorizontal: 8,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
    },
    activeTabButton: {
      backgroundColor: '#007bff',
      borderColor: '#007bff',
    },
    tabButtonText: {
      color: '#333',
      fontWeight: 'bold',
    },
  };
  
  return (
    <SafeAreaView style={[styles.appContainer]}>
      <View style={styles.container}>
        <Text style={[styles.title, { fontSize: 28, fontWeight: "900"}]}>Bookmark Page</Text>
      </View>
      <View style={styles.tabButtons}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'stock' && styles.activeTabButton]}
          onPress={() => setActiveTab('stock')}
        >
          <Text style={styles.tabButtonText}>Stocks</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'crypto' && styles.activeTabButton]}
          onPress={() => setActiveTab('crypto')}
        >
          <Text style={styles.tabButtonText}>Cryptos</Text>
        </TouchableOpacity>
      </View>
      <View>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Image
              source={{
                uri: 'https://github.com/ErickLao123/2023-S2-51-AIVestor/raw/main/assets/back.png',
              }}
              style={styles.inputIcon}
            />
          </TouchableOpacity>
        </View>
        
        <FlatList
          style={styles.stocks}
          data={filteredItems}
          keyExtractor={(item) => item.type + '-' + (item.symbol || item.from_symbol)}
          renderItem={({ item }) => {
            return (
              item.type === 'crypto' ? (
                <CryptoCard
                  item={item}
                  isBookedMarked={true}
                />
              ) : (
                <StockCard
                  item={item}
                  isBookedMarked={true}
                />
              )
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default BookmarkedStocksPage;