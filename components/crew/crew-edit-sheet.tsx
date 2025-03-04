import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '~/api/api';
import { useAuth } from '~/context/auth-context';

type CrewEditSheetProps = {
  member: { id: number; name: string } | null;
  onClose: () => void;
};

export function CrewEditSheet({ onClose, member }: CrewEditSheetProps) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [editedName, setEditedName] = useState(member?.name || '');
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const updateCrewMemberMutation = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      api(`/crews/members/${id}`, token!, {
        method: 'PUT',
        body: JSON.stringify({ name }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crews'] });

      bottomSheetRef.current?.dismiss();
      onClose();
    },
  });

  const handleSaveEdit = () => {
    if (!member || !editedName.trim()) return;
    updateCrewMemberMutation.mutate({ id: member.id, name: editedName.trim() });
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
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={['40%']}
      index={0}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore">
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Edit Crew Member</Text>

        <TextInput
          value={editedName}
          onChangeText={setEditedName}
          style={{
            height: 50,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            paddingHorizontal: 10,
            fontSize: 16,
          }}
          autoFocus
        />

        <TouchableOpacity
          onPress={handleSaveEdit}
          style={{
            marginTop: 20,
            backgroundColor: '#23D013',
            padding: 12,
            borderRadius: 8,
            alignItems: 'center',
          }}>
          <Text style={{ color: 'white', fontSize: 16 }}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </BottomSheetModal>
  );
}
