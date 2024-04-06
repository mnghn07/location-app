import { FlatList } from "react-native";
import React from "react";
import LocationItem from "./LocationItem";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { UserLocation } from "@/stores/models/client.type";

dayjs.extend(relativeTime);

interface Props {
  locations: UserLocation[];
  onShowMap: (location: UserLocation) => void;
}

const LocationList: React.FC<Props> = props => {
  const { locations, onShowMap } = props;

  const renderLocationItem = ({ item }: { item: UserLocation }) => {
    return <LocationItem item={item} onShowMap={() => onShowMap(item)} />;
  };

  return (
    <FlatList
      data={locations}
      renderItem={renderLocationItem}
      onEndReachedThreshold={16}
      keyExtractor={item => item.id}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default LocationList;
