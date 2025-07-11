import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Image,
  ScrollView, Alert, SafeAreaView
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, CatalogItem } from '../../types';
import { useTheme } from '../context/ThemeContext';
import createStyles, { FONT_SIZES } from '../context/appStyles';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = StackNavigationProp<RootStackParamList, 'CatalogEditorScreen'>;

const CatalogEditorScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<any>();

  const { businessId, catalog: initialCatalog } = route.params;
  const { colors } = useTheme();
  const styles = createStyles(colors).createBusinessScreen;

  const [catalog, setCatalog] = useState<CatalogItem[]>(initialCatalog || []);

  const pickImage = async (index: number) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission denied', 'Please enable gallery access.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      const updated = [...catalog];
      updated[index].imageUri = result.assets[0].uri;
      setCatalog(updated);
    }
  };

  const addNewItem = () => {
    setCatalog([...catalog, { name: '', price: 0, description: '', imageUri: '' }]);
  };

  const removeItem = (index: number) => {
    const updated = [...catalog];
    updated.splice(index, 1);
    setCatalog(updated);
  };

  const handleSave = () => {
    navigation.navigate('EditBusinessScreen', { businessId, catalog });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.header}>Edit Catalog / Menu</Text>

        {catalog.map((item, index) => (
          <View key={index} style={styles.catalogItem}>
            <TouchableOpacity onPress={() => pickImage(index)} style={styles.imagePicker}>
              {item.imageUri ? (
                <Image source={{ uri: item.imageUri }} style={styles.imagePreview} />
              ) : (
                <Ionicons name="image-outline" size={FONT_SIZES.large} color={colors.primary} />
              )}
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Item Name"
              value={item.name}
              onChangeText={(text) => {
                const updated = [...catalog];
                updated[index].name = text;
                setCatalog(updated);
              }}
            />
            <TextInput
              style={styles.input}
              placeholder="Price"
              keyboardType="numeric"
              value={item.price?.toString()}
              onChangeText={(text) => {
                const updated = [...catalog];
                updated[index].price = parseFloat(text) || 0;
                setCatalog(updated);
              }}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={item.description}
              onChangeText={(text) => {
                const updated = [...catalog];
                updated[index].description = text;
                setCatalog(updated);
              }}
            />
            <TouchableOpacity onPress={() => removeItem(index)} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Remove Item</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity onPress={addNewItem} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add New Item</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSave} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Save Catalog</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CatalogEditorScreen;
