import React from 'react';
import {Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {NavigationFunctionComponent} from 'react-native-navigation';
import {PixabayImage} from '../../api/pixabay/types';

type Props = {
  image: PixabayImage;
};

export const ImageViewer: NavigationFunctionComponent<Props> = ({image}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text numberOfLines={1} style={styles.text}>
          User: {image.user}
        </Text>
        <Text numberOfLines={1} style={styles.text}>
          Resolution: {image.imageWidth}x{image.imageHeight}
        </Text>
        <Text numberOfLines={2} style={styles.text}>
          Tags: {image.tags}
        </Text>
      </View>
      <Image
        style={styles.image}
        resizeMode="contain"
        source={{
          uri: image.largeImageURL, // This can be improved by using device screen size and selecting proper image size
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    padding: 16,
  },
  text: {
    fontSize: 13,
  },
  image: {
    flex: 1,
  },
});
