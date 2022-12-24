import React, {FC, memo} from 'react';
import {TouchableOpacity, Image, Text, StyleSheet} from 'react-native';
import {Navigation, NavigationComponentProps} from 'react-native-navigation';
import {PixabayImage} from '../../api/pixabay/types';

type Props = NavigationComponentProps & {
  image: PixabayImage;
};

export const ImageListRow: FC<Props> = memo(({componentId, image}) => {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() =>
        Navigation.push(componentId, {
          component: {
            name: 'ImageViewer',
            passProps: {image},
          },
        })
      }>
      <Image
        resizeMode="cover"
        style={styles.image}
        source={{uri: image.previewURL}}
      />
      <Text numberOfLines={1} style={styles.title}>
        id: {image.id}
      </Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  row: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  image: {
    width: 40,
    height: 40,
    backgroundColor: 'gray',
    borderRadius: 4,
  },
});
