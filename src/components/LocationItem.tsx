import { Share, Alert, StyleSheet } from "react-native";
import React, { useRef, useState } from "react";
import Box from "./atoms/Box";
import Text from "./atoms/Text";
import Ionicons from "@expo/vector-icons/Ionicons";
import Swipeable from "react-native-gesture-handler/Swipeable";
import RectButton from "react-native-gesture-handler/Swipeable";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { TouchableOpacity } from "./atoms/Touchable";
import { useAppStore, useLocationStore } from "@/stores/client";
import { TextInput } from "react-native-gesture-handler";
import { useTheme } from "@shopify/restyle";
import { Theme } from "@/themes";
dayjs.extend(relativeTime);

interface Props {
  item: any;
  onShowMap?: () => void;
}

const LocationItem: React.FC<Props> = props => {
  const { item, onShowMap } = props;
  const swipeableRef = useRef<Swipeable>(null);
  const theme = useTheme<Theme>();
  const { updateLocation, removeLocation } = useLocationStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editingLat, setEditingLat] = useState(item.latitude.toString());
  const [editingLong, setEditingLong] = useState(item.longitude.toString());
  const { mode } = useAppStore();

  const onShareLocation = () => {
    console.log("Share location");
    Share.share({
      url: `https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`
    });
    swipeableRef.current?.close();
  };

  const onRemove = () => {
    Alert.alert(
      "Remove location",
      "Are you sure you want to remove this location?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            console.log("Remove location");
            removeLocation(item.id);
            swipeableRef.current?.close();
          }
        }
      ]
    );
  };

  const onEdit = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      if (
        editingLat === item.latitude.toString() &&
        editingLong === item.longitude.toString()
      ) {
        setIsEditing(false);
        return;
      }
      updateLocation({
        id: item.id,
        timestamp: item.timestamp,
        latitude: parseFloat(editingLat),
        longitude: parseFloat(editingLong)
      });
      swipeableRef.current?.close();
    }
  };

  const renderRightActions = () => {
    return (
      <RectButton useNativeAnimations>
        <Box flexDirection={"row"}>
          <TouchableOpacity onPress={onEdit}>
            <Box
              width={72}
              height={"100%"}
              backgroundColor={"editColor"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              {!isEditing ? (
                <Ionicons name="create-sharp" size={24} color="white" />
              ) : (
                <Ionicons name="checkmark" size={24} color="white" />
              )}
            </Box>
          </TouchableOpacity>
          <TouchableOpacity onPress={onShareLocation}>
            <Box
              width={72}
              height={"100%"}
              backgroundColor={"shareColor"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Ionicons name="share-social-sharp" size={24} color="white" />
            </Box>
          </TouchableOpacity>
          <TouchableOpacity onPress={onRemove}>
            <Box
              width={72}
              height={"100%"}
              backgroundColor={"deleteColor"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Ionicons name="trash-sharp" size={24} color="white" />
            </Box>
          </TouchableOpacity>
        </Box>
      </RectButton>
    );
  };

  return (
    <>
      <Swipeable
        ref={swipeableRef}
        rightThreshold={20}
        renderRightActions={renderRightActions}
        onSwipeableClose={() => {
          setIsEditing(false);
        }}
      >
        <TouchableOpacity activeOpacity={1} onPress={onShowMap}>
          <Box
            p="m"
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            borderBottomWidth={0.5}
            borderBottomColor="border"
            backgroundColor={
              mode === "dark" ? "secondaryBackground" : "primaryBackground"
            }
          >
            <Text>{dayjs(item.timestamp).fromNow()}</Text>
            <Box alignItems={"flex-end"}>
              <Text variant={"highlight"}>{item.latitude}</Text>
              <Text variant={"highlight"}>{item.longitude}</Text>
            </Box>
          </Box>
        </TouchableOpacity>
      </Swipeable>
      {isEditing && (
        <Box>
          <Box
            ml={"s"}
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Text variant={"highlight"}>Latitude:</Text>
            <TextInput
              value={editingLat}
              onChangeText={setEditingLat}
              style={[
                styles.input,
                theme.textVariants.input,
                {
                  backgroundColor:
                    mode === "dark"
                      ? theme.colors.secondaryBackground
                      : theme.colors.primaryBackground
                }
              ]}
            />
          </Box>
          <Box
            ml={"s"}
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Text variant={"highlight"}>Longitude:</Text>
            <TextInput
              value={editingLong}
              onChangeText={setEditingLong}
              style={[
                styles.input,
                theme.textVariants.input,
                {
                  backgroundColor:
                    mode === "dark"
                      ? theme.colors.secondaryBackground
                      : theme.colors.primaryBackground
                }
              ]}
            />
          </Box>
        </Box>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    width: "70%",
    height: 50
  }
});

export default LocationItem;
