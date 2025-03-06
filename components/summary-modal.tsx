import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Image } from 'expo-image';

export type FlightSummary = {
  total?: number;
  sic?: number;
  mp?: number;
  ifr?: number;
  xc?: number;
  'Total block time'?: number;
  'PIC - Pilot In Command'?: number;
  'SIC - Second in Command'?: number;
  'PICUS - PIC Under Supervision'?: number;
  'DUAL (Student)'?: number;
  Instructor?: number;
  'Multi pilot'?: number;
  Night?: number;
  'IFR - Instrument Flight Rules'?: number;
  'IFR - Actual IMC'?: number;
  'IFR Simulated - HOOD'?: number;
  'XC - Cross Country'?: number;
  'Relief pilot'?: number;
  Simulator?: number;
  [key: string]: number | undefined;
};

interface SummaryModalProps {
  visible: boolean;
  onClose: () => void;
  flightSummary: FlightSummary;
  onSave: (updatedSummary: FlightSummary) => void;
}

export const SUMMARY_LABELS: Record<keyof FlightSummary, string> = {
  total: 'Total block time',
  pic: 'PIC - Pilot In Command',
  sic: 'SIC - Second in Command',
  picus: 'PICUS - PIC Under Supervision',
  dual: 'DUAL (Student)',
  inst: 'Instructor',
  multi: 'Multi pilot',
  night: 'Night',
  ifr: 'IFR - Instrument Flight Rules',
  ifri: 'IFR - Actual IMC',
  ifrs: 'IFR Simulated - HOOD',
  xc: 'XC - Cross Country',
  rp: 'Relief pilot',
  sim: 'Simulator',
};

const SummaryModal: React.FC<SummaryModalProps> = ({ visible, onClose, flightSummary, onSave }) => {
  const [adjustments, setAdjustments] = useState<FlightSummary>(() => {
    return Object.keys(SUMMARY_LABELS).reduce((acc, key) => {
      acc[key as keyof FlightSummary] = 0.0;
      return acc;
    }, {} as FlightSummary);
  });
  

  useEffect(() => {
    if (visible) {
      setAdjustments((prev) => ({
        ...prev,
        ...flightSummary,
      }));
    }
  }, [visible, flightSummary]);

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
          <Text className="mb-4 text-center text-xl font-bold">ADJUST</Text>

          <ScrollView>
            {Object.entries(SUMMARY_LABELS).map(([shortKey, fullLabel]) => (
              <View
                key={shortKey}
                className="mb-4 w-auto flex-1 items-start justify-start rounded-xl border border-black/10 bg-white p-4">
                <Text style={{ flex: 1, fontSize: 14, fontWeight: 'bold' }}>{fullLabel}</Text>
                <View className="flex-row gap-2">
                  <View className="flex-1 flex-row items-center gap-2">
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
                      value={adjustments[shortKey] ?? 0.0} // ✅ Uses short key for state
                      onValueChange={(val) => handleAdjust(shortKey, val)}
                    />
                  </View>
                  {/* ✅ Display slider value */}
                  <View
                    style={{
                      backgroundColor: 'green',
                      borderRadius: 20,
                      paddingVertical: 4,
                      paddingHorizontal: 10,
                      minWidth: 60,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>
                      {adjustments[shortKey]?.toFixed(1)}
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

export { SummaryModal };
