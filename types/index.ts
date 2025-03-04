export type CrewSelectionProps = {
    crew: {
      pic: string[];
      sic: string[];
      fo: string[];
      rp: string[];
      ip: string[];
      ca: string[];
      tp: string[];
      sp: string[];
    };
    onCrewChange: (updatedCrew: {
      pic: string[];
      sic: string[];
      fo: string[];
      rp: string[];
      ip: string[];
      ca: string[];
      tp: string[];
      sp: string[];
    }) => void;
  };