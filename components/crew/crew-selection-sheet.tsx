import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useAuth } from '~/context/auth-context';
import { Button } from '../Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCrewRole, CrewRole, deleteCrewRole, editCrewRole } from '~/api/crews';

type CrewSelectionProps = {
  crewRoles: CrewRole[];
  value: { type: string; name: string }[];
  onChange: (value: { type: string; name: string }[]) => void;
};

export function CrewSelectionSheet({ crewRoles }: CrewSelectionProps) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const [newCrewType, setNewCrewType] = useState('');
  const [editingRoleId, setEditingRoleId] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>('');

  const handleOpenSheet = () => bottomSheetRef.current?.present();

  const createCrewMutation = useMutation({
    mutationFn: (role: string) => createCrewRole(role, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crews'] });
      setNewCrewType('');
    },
  });

  const editCrewMutation = useMutation({
    mutationFn: ({ roleId, updatedRole }: { roleId: number; updatedRole: string }) =>
      editCrewRole(roleId, updatedRole, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crews'] });
      setEditingRoleId(null); // Exit edit mode
    },
  });

  const deleteCrewMutation = useMutation({
    mutationFn: (roleId: number) => deleteCrewRole(roleId, token!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['crews'] }),
  });

  const handleCreateCrewType = () => {
    if (newCrewType.trim()) {
      createCrewMutation.mutate(newCrewType.trim());
    }
  };

  const handleSaveEdit = () => {
    if (editingRoleId && editText.trim()) {
      editCrewMutation.mutate({ roleId: editingRoleId, updatedRole: editText.trim() });
    }
  };

  // Handle Edit Press
  const handleEditPress = (roleId: number, role: string) => {
    setEditingRoleId(roleId); // Set row to edit mode
    setEditText(role); // Pre-fill input
  };

  // Handle Cancel Edit
  const handleCancelEdit = () => {
    setEditingRoleId(null); // Exit edit mode
    setEditText('');
  };
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
      <Button
        title="Manage Crew Roles"
        iconLeft={require('../../assets/images/edit.png')}
        style={{
          borderRadius: 16,
          borderColor: '#C4C4C4',
          borderWidth: 1,
          width: 'auto',
          marginTop: 12,
        }}
        onPress={handleOpenSheet}>
        <Ionicons name="settings" size={24} color="white" />
        <Text style={{ marginLeft: 8, color: 'white', fontSize: 16 }}>Manage Roles</Text>
      </Button>

      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={['60%']}
        enableDynamicSizing={false}
        index={0}
        enablePanDownToClose
        backdropComponent={renderBackdrop}>
        <View style={{ padding: 16, flex: 1 }}>
          <Text>Types</Text>
          <FlatList
            data={crewRoles || []}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 16,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: '#ccc',
                  marginTop: 10,
                  backgroundColor: 'white',
                }}>
                {/* Role Text or Input Field */}
                {editingRoleId === item.id ? (
                  <BottomSheetTextInput
                    value={editText}
                    onChangeText={setEditText}
                    autoFocus
                    style={{
                      fontSize: 20,
                      borderBottomWidth: 1,
                      borderColor: '#23D013',
                      padding: 4,
                      flex: 1,
                    }}
                  />
                ) : (
                  <Text style={{ fontSize: 20 }}>{item.role}</Text>
                )}

                {/* Icons for Edit/Delete */}
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  {editingRoleId === item.id ? (
                    <>
                      {/* Save (Checkmark) */}
                      <TouchableOpacity onPress={handleSaveEdit}>
                        <Ionicons name="checkmark" size={36} color="#23D013" />
                      </TouchableOpacity>

                      {/* Cancel (X) */}
                      <TouchableOpacity onPress={handleCancelEdit}>
                        <Ionicons name="close" size={36} color="darkred" />
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      {/* Edit (Pencil) */}
                      <TouchableOpacity onPress={() => handleEditPress(item.id, item.role)}>
                        <Ionicons name="create-outline" size={36} color="#23D013" />
                      </TouchableOpacity>

                      {/* Delete (Trash) */}
                      <TouchableOpacity
                        onPress={() =>
                          Alert.alert(
                            'Delete Crew Role',
                            `Are you sure you want to delete "${item.role}"?`,
                            [
                              { text: 'Cancel', style: 'cancel' },
                              {
                                text: 'Delete',
                                style: 'destructive',
                                onPress: () => deleteCrewMutation.mutate(item.id),
                              },
                            ]
                          )
                        }>
                        <Ionicons name="trash-outline" size={36} color="darkred" />
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            )}
          />
          <Text style={{ fontSize: 16 }}>Add Crew Type</Text>
          <View className="mb-4 flex-row gap-2">
            <BottomSheetTextInput
              style={{
                height: 50,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 8,
                paddingHorizontal: 10,
                fontSize: 16,
                marginTop: 'auto',
                flex: 1,
              }}
              placeholder="Enter role (e.g., Pilot, Co-Pilot)"
              value={newCrewType}
              onChangeText={setNewCrewType}
            />
            <TouchableOpacity
              onPress={handleCreateCrewType}
              style={{
                marginTop: 10,
                backgroundColor: '#23D013',
                padding: 12,
                borderRadius: 8,
                alignItems: 'center',
              }}>
              <Feather name="plus" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheetModal>
    </>
  );
}
