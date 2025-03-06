import { Feather, Ionicons } from '@expo/vector-icons';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import React, { useRef, useState } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CrewRole } from '~/api/crews';
import { FlightFormData } from '~/api/flights';

type CrewMember = { type: string; name: string };

type CrewFormProps = {
  crewState: CrewMember[];
  crewRoles: CrewRole[];
  form: UseFormReturn<FlightFormData>;
};

export function CrewForm({ crewState, form, crewRoles }: CrewFormProps) {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [inputValue, setInputValue] = useState('');
  const [editInputValue, setEditInputValue] = useState('');
  const [editSelectedRole, setEditSelectedRole] = useState('');
  const [selectedCrewMember, setSelectedCrewMember] = useState<CrewMember | null>(null);

  const roleSelectSheetRef = useRef<BottomSheetModal>(null);
  const editRoleSheetRef = useRef<BottomSheetModal>(null);

  const renderBackdrop = React.useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={1}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    []
  );

  return (
    <>
      <Text className="mb-2 text-base font-normal">Crew</Text>

      {/* List of Selected Crew Members */}
      {crewState.length > 0 ? (
        crewState.map((roleObj, index) => (
          <View key={`${roleObj.type}-${index}`} className="mt-2 flex-row items-center gap-4">
            <TouchableOpacity className="rounded-xl border border-[#23d013] px-4 py-2">
              <Text className="text-base font-medium">{roleObj.type}</Text>
            </TouchableOpacity>

            <Text className="text-base">{roleObj.name}</Text>

            <TouchableOpacity
              className="ml-auto"
              onPress={() => {
                setEditSelectedRole(roleObj.type);
                setSelectedCrewMember(roleObj);
                setEditInputValue(roleObj.name);
                editRoleSheetRef.current?.present();
              }}>
              <Ionicons name="list" size={24} color="#23D013" />
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text className="text-gray-400">No crew roles selected yet.</Text>
      )}

      <View className="my-4 h-px w-full bg-black/10" />

      {/* Crew Role Selection + Input Field */}
      <Controller
        control={form.control}
        name="crew"
        render={() => (
          <View className="mt-2 flex-row items-center gap-4">
            {/* ✅ Open Role Selection Modal */}
            <TouchableOpacity
              className="h-12 rounded-xl border border-[#23d013] px-4 py-3"
              onPress={() => roleSelectSheetRef.current?.present()}>
              <Text className="text-base font-medium">{selectedRole || 'Select Role'}</Text>
            </TouchableOpacity>

            {/* Input for Crew Member Name */}
            <TextInput
              className="h-12 flex-1 rounded-xl border border-black/10 px-2 text-xl"
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="Enter name"
            />

            {/* Add Crew Button */}
            <TouchableOpacity
              disabled={!selectedRole || inputValue.trim() === ''}
              onPress={() => {
                if (selectedRole && inputValue.trim() !== '') {
                  const currentCrew: CrewMember[] = form.getValues('crew') || [];
                  const newCrewMember: CrewMember = { type: selectedRole, name: inputValue.trim() };

                  form.setValue('crew', [...currentCrew, newCrewMember]);
                  setInputValue('');
                  setSelectedRole('');
                }
              }}>
              <Feather name="plus-circle" color={selectedRole ? '#23d013' : 'gray'} size={24} />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* 🔽 NEW Role Selection Modal */}
      <BottomSheetModal
        ref={roleSelectSheetRef}
        snapPoints={['40%']}
        enableDynamicSizing={false}
        index={0}
        enablePanDownToClose
        backdropComponent={renderBackdrop}>
        <View className="p-4">
          <Text className="mb-4 text-lg font-bold">Select a Role</Text>

          {crewRoles?.map((role) => (
            <TouchableOpacity
              key={role.id}
              className={`border-b border-gray-300 p-3 ${
                selectedRole === role.role ? 'bg-gray-200' : ''
              }`}
              onPress={() => {
                setSelectedRole(role.role);
                roleSelectSheetRef.current?.dismiss();
              }}>
              <Text className="text-base">{role.role}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheetModal>

      {/* 🔄 Edit Crew Role Modal */}
      <BottomSheetModal
        ref={editRoleSheetRef}
        snapPoints={['60%']}
        enableDynamicSizing={false}
        index={0}
        enablePanDownToClose
        backdropComponent={renderBackdrop}>
        <View className="p-4">
          <Text className="mb-4 text-lg font-bold">Edit Crew Member</Text>

          {/* Text Input for Editing Name */}
          <Text className="mb-2 text-base font-medium">Name</Text>
          <TextInput
            className="h-12 w-full rounded-xl border border-black/10 px-2 text-lg"
            value={editInputValue} // ✅ Using separate state for editing
            onChangeText={setEditInputValue}
            placeholder="Enter name"
          />

          {/* List of Roles to Select */}
          <Text className="mb-2 mt-4 text-base font-medium">Role</Text>
          {crewRoles?.map((role) => (
            <TouchableOpacity
              key={role.id}
              className={`border-b border-gray-300 p-3 ${
                editSelectedRole === role.role ? 'bg-gray-200' : ''
              }`}
              onPress={() => setEditSelectedRole(role.role)}>
              {' '}
              {/* ✅ Update separate edit role state */}
              <Text className="text-base">{role.role}</Text>
            </TouchableOpacity>
          ))}

          {/* Save Changes Button */}
          <TouchableOpacity
            className="mt-4 rounded-lg bg-[#23d013] p-3"
            onPress={() => {
              if (selectedCrewMember && editInputValue.trim() !== '') {
                const updatedCrew: CrewMember[] = form.getValues('crew').map((crew: CrewMember) =>
                  crew.type === selectedCrewMember.type && crew.name === selectedCrewMember.name
                    ? { type: editSelectedRole, name: editInputValue.trim() }
                    : crew
                );

                form.setValue('crew', updatedCrew);
                editRoleSheetRef.current?.dismiss();
              }
            }}>
            <Text className="text-center text-lg font-semibold text-white">Save Changes</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetModal>
    </>
  );
}
