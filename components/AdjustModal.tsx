import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Image } from 'expo-image';

interface FlightSummary {
  total: number;
  sic: number;
  mp: number;
  ifr: number;
  xc: number;
  [key: string]: number;
}

interface AdjustModalProps {
  visible: boolean;
  onClose: () => void;
  flightSummary: FlightSummary;
  onSave: (updatedSummary: FlightSummary) => void;
}
const ADJUSTMENT_KEYS = [
  'Total block time',
  'PIC - Pilot In Command',
  'SIC - Second in Command',
  'PICUS - PIC Under Supervision',
  'DUAL (Student)',
  'Instructor',
  'Multi pilot',
  'Night',
  'IFR - Instrument Flight Rules',
  'IFR - Actual IMC',
  'IFR Simulated - HOOD',
  'XC - Cross Country',
  'Relief pilot',
  'Simulator',
];

interface FlightSummary {
  'Total block time': number;
  'PIC - Pilot In Command': number;
  'SIC - Second in Command': number;
  'PICUS - PIC Under Supervision': number;
  'DUAL (Student)': number;
  Instructor: number;
  'Multi pilot': number;
  Night: number;
  'IFR - Instrument Flight Rules': number;
  'IFR - Actual IMC': number;
  'IFR Simulated - HOOD': number;
  'XC - Cross Country': number;
  'Relief pilot': number;
  Simulator: number;
}
interface AdjustModalProps {
  visible: boolean;
  onClose: () => void;
  initialSummary: FlightSummary;
  onSave: (updatedSummary: FlightSummary) => void;
}
const AdjustModal: React.FC<AdjustModalProps> = ({ visible, onClose, flightSummary, onSave }) => {
  const initialAdjustments: FlightSummary = ADJUSTMENT_KEYS.reduce((acc, key) => {
    acc[key] = flightSummary[key] !== undefined ? flightSummary[key] : 0; // Use 0 if not present
    return acc;
  }, {} as FlightSummary);

  const [adjustments, setAdjustments] = useState<FlightSummary>(initialAdjustments);

  useEffect(() => {
    if (visible) {
      const syncedAdjustments: FlightSummary = ADJUSTMENT_KEYS.reduce((acc, key) => {
        acc[key] = flightSummary[key] ?? 0; // Default to 0 if undefined
        return acc;
      }, {} as FlightSummary);

      setAdjustments(syncedAdjustments);
    }
  }, [visible, flightSummary]); // ✅ Depend on visibility & flightSummary

  const handleAdjust = (key: keyof FlightSummary, value: number) => {
    setAdjustments((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="max-h-[80%] w-11/12 rounded-lg bg-white p-5 shadow-lg">
          {/* Title */}
          <Text className="mb-4 text-center text-xl font-bold">ADJUST</Text>

          <ScrollView>
            {ADJUSTMENT_KEYS.map((key) => (
              <View
                key={key}
                className="mb-4 w-auto flex-1 items-start justify-start rounded-xl border border-black/10 bg-white p-4">
                <Text style={{ flex: 1, fontSize: 14, fontWeight: 'bold' }}>{key}</Text>
                <View className="flex-row gap-2">
                  <View className="flex-row gap-2 flex-1 items-center">
                    <Image
                      source={require('../assets/images/klok.png')}
                      style={{ width: 24, height: 24 }}
                    />
                    <Slider
                      style={{ flex: 1 }}
                      minimumValue={0}
                      maximumValue={10}
                      step={0.1}
                      minimumTrackTintColor="green"
                      thumbTintColor="green"
                      value={adjustments[key] ?? 0}
                      onValueChange={(val) => handleAdjust(key, val)}
                    />
                  </View>
                  <View
                    style={{
                      backgroundColor: 'green',
                      borderRadius: 20,
                      paddingVertical: 4,
                      paddingHorizontal: 10,
                      minWidth: 60,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>
                      {adjustments[key]?.toFixed(1)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          <View className="mt-5 flex-row justify-between">
            <TouchableOpacity
              className="flex-row items-center rounded-lg bg-green-600 px-4 py-2"
              onPress={() => onSave(adjustments)}>
              <Ionicons name="checkmark" size={20} color="white" />
              <Text className="ml-2 text-base text-white">Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center rounded-lg bg-red-500 px-4 py-2"
              onPress={onClose}>
              <Ionicons name="close" size={20} color="white" />
              <Text className="ml-2 text-base text-white">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AdjustModal;
