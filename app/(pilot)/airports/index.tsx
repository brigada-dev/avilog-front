import React from 'react';
import { View } from 'react-native';
import { AirportChart } from '../../../components/airport/AirportChart';
import Layout from '~/components/Layout';
import { Header } from '~/components/Header';
import { Stack } from 'expo-router';

const airportData = [
  { code: 'ESMS', country: 'SE', visits: 27, flagUrl: 'https://flagcdn.com/w40/se.png' },
  { code: 'EDDP', country: 'DE', visits: 12, flagUrl: 'https://flagcdn.com/w40/de.png' },
  { code: 'LHDC', country: 'HU', visits: 8, flagUrl: 'https://flagcdn.com/w40/hu.png' },
  { code: 'LBSF', country: 'BG', visits: 8, flagUrl: 'https://flagcdn.com/w40/bg.png' },
  { code: 'ESGG', country: 'SE', visits: 7, flagUrl: 'https://flagcdn.com/w40/se.png' },
  { code: 'EGJJ', country: 'GB', visits: 6, flagUrl: 'https://flagcdn.com/w40/gb.png' },
  { code: 'EDDN', country: 'DE', visits: 6, flagUrl: 'https://flagcdn.com/w40/de.png' },
  { code: 'ETNL', country: 'DE', visits: 6, flagUrl: 'https://flagcdn.com/w40/de.png' },
  { code: 'EDLV', country: 'DE', visits: 5, flagUrl: 'https://flagcdn.com/w40/de.png' },
  { code: 'EBLG', country: 'BE', visits: 5, flagUrl: 'https://flagcdn.com/w40/be.png' },
  { code: 'LECO', country: 'ES', visits: 4, flagUrl: 'https://flagcdn.com/w40/es.png' },
  { code: 'EKRK', country: 'DK', visits: 4, flagUrl: 'https://flagcdn.com/w40/dk.png' },
  { code: 'ESKS', country: 'SE', visits: 4, flagUrl: 'https://flagcdn.com/w40/se.png' },
  { code: 'EPGD', country: 'PL', visits: 4, flagUrl: 'https://flagcdn.com/w40/pl.png' },
  { code: 'EETN', country: 'EE', visits: 4, flagUrl: 'https://flagcdn.com/w40/ee.png' },
  { code: 'LDOS', country: 'HR', visits: 4, flagUrl: 'https://flagcdn.com/w40/hr.png' },
  { code: 'LHBP', country: 'HU', visits: 2, flagUrl: 'https://flagcdn.com/w40/hu.png' },
  { code: 'EKBI', country: 'DK', visits: 2, flagUrl: 'https://flagcdn.com/w40/dk.png' },
  { code: 'EVRA', country: 'LV', visits: 2, flagUrl: 'https://flagcdn.com/w40/lv.png' },
  { code: 'LGKO', country: 'GR', visits: 2, flagUrl: 'https://flagcdn.com/w40/gr.png' },
  { code: 'EBOS', country: 'BE', visits: 1, flagUrl: 'https://flagcdn.com/w40/be.png' },
  { code: 'LIMC', country: 'IT', visits: 1, flagUrl: 'https://flagcdn.com/w40/it.png' },
  { code: 'LTFE', country: 'TR', visits: 1, flagUrl: 'https://flagcdn.com/w40/tr.png' },
  { code: 'EDDW', country: 'DE', visits: 1, flagUrl: 'https://flagcdn.com/w40/de.png' },
  { code: 'LOWS', country: 'AT', visits: 1, flagUrl: 'https://flagcdn.com/w40/at.png' },
  { code: 'EDDL', country: 'DE', visits: 1, flagUrl: 'https://flagcdn.com/w40/de.png' },
];

export default function AirportsRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Layout variant="primary">
        <Header title="Airports" />
        <View>
          <AirportChart data={airportData} />
        </View>
      </Layout>
    </>
  );
}
