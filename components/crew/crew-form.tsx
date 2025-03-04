import { Feather, Ionicons } from '@expo/vector-icons';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useRef, useState } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CrewRole } from '~/api/crews';
import { FlightFormData } from '~/api/flights';

type CrewFormProps = {
  crewState: { type: string; name: string }[]; // ✅ Correct type for crewState
  crewRoles: CrewRole[];
  form: UseFormReturn<FlightFormData>;
};

export function CrewForm({ crewState, form, crewRoles }: CrewFormProps) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');

  const roleSelectSheetRef = useRef<BottomSheetModal>(null);
  const editRoleSheetRef = useRef<BottomSheetModal>(null);

  return (
    <>
      <View className="mt-4 rounded-xl bg-white p-4">
        <Text className="mb-2 text-base font-normal">Crew Roles</Text>

        {/* List Selected Crew Roles */}
        <View className="rounded-lg p-3">
          {crewState.length > 0 ? (
            crewState.map((roleObj, index) => (
              <View key={`${roleObj.type}-${index}`} className="mt-2 flex-row items-center gap-4">
                {/* Edit Crew Role */}
                <TouchableOpacity
                  className="rounded-xl border border-[#23d013] px-4 py-2"
                  onPress={() => {
                    setSelectedRole(roleObj.type);
                    editRoleSheetRef.current?.present();
                  }}>
                  <Text className="text-base font-medium">{roleObj.type.toUpperCase()}</Text>
                </TouchableOpacity>

                {/* Crew Member Name */}
                <Text className="text-base">{roleObj.name}</Text>

                {/* Remove Crew Role */}
                <TouchableOpacity
                  className="ml-auto"
                  onPress={() => {
                    const updatedCrew = crewState.filter(
                      (crew) => !(crew.type === roleObj.type && crew.name === roleObj.name)
                    );
                    form.setValue('crew', updatedCrew); // ✅ Ensures correct object structure
                  }}>
                  <Ionicons name="trash" size={24} color="red" />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text className="text-gray-400">No crew roles selected yet.</Text>
          )}
        </View>

        <View className="my-4 h-px w-full bg-black/10" />

        {/* Add New Crew Role & Name */}
        <Controller
          control={form.control}
          name="crew"
          render={() => (
            <View className="mt-2 flex-row items-center gap-4">
              {/* Select Crew Role */}
              <TouchableOpacity
                className="h-12 rounded-xl border border-[#23d013] px-4 py-3"
                onPress={() => roleSelectSheetRef.current?.present()}>
                <Text className="text-base font-medium">
                  {selectedRole ? selectedRole.toUpperCase() : 'Select Role'}
                </Text>
              </TouchableOpacity>

              {/* Enter Crew Member Name */}
              <TextInput
                className="h-12 flex-1 rounded-xl border border-black/10 px-2 text-xl"
                value={inputValue}
                onChangeText={setInputValue}
                placeholder="Enter name"
              />

              {/* Add Crew Role */}
              <TouchableOpacity
                disabled={!selectedRole || inputValue.trim() === ''}
                onPress={() => {
                  if (selectedRole && inputValue.trim() !== '') {
                    const currentCrew = form.getValues('crew') || [];
                    const newCrewMember = { type: selectedRole, name: inputValue.trim() };

                    form.setValue('crew', [...currentCrew, newCrewMember]); // ✅ Adds correct object type
                    setInputValue('');
                    setSelectedRole(null);
                  }
                }}>
                <Feather name="plus-circle" color={selectedRole ? '#23d013' : 'gray'} size={24} />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      {/* Crew Role Selection Modal */}
      <BottomSheetModal
        ref={roleSelectSheetRef}
        snapPoints={['40%']}
        index={0}
        enablePanDownToClose
        enableDynamicSizing={false}
        backdropComponent={(props) => <BottomSheetBackdrop {...props} pressBehavior="close" />}>
        <View className="p-4">
          <Text className="mb-4 text-lg font-bold">Select Crew Role</Text>
          {crewRoles?.map((role) => (
            <TouchableOpacity
              key={role.id}
              className="border-b border-gray-300 p-3"
              onPress={() => {
                setSelectedRole(role.role);
                roleSelectSheetRef.current?.dismiss();
              }}>
              <Text className="text-base">{role.role}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheetModal>

      {/* Edit Crew Role Modal */}
      <BottomSheetModal
        ref={editRoleSheetRef}
        snapPoints={['40%']}
        index={0}
        enablePanDownToClose
        enableDynamicSizing={false}
        backdropComponent={(props) => <BottomSheetBackdrop {...props} pressBehavior="close" />}>
        <View className="p-4">
          <Text className="mb-4 text-lg font-bold">Edit Crew Role</Text>
          {crewRoles?.map((role) => (
            <TouchableOpacity
              key={role.id}
              className="border-b border-gray-300 p-3"
              onPress={() => {
                const updatedCrew = form
                  .getValues('crew')
                  .map((crew) =>
                    crew.type === selectedRole ? { ...crew, type: role.role } : crew
                  );

                form.setValue('crew', updatedCrew);
                editRoleSheetRef.current?.dismiss();
              }}>
              <Text className="text-base">{role.role}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheetModal>
    </>
  );
}
