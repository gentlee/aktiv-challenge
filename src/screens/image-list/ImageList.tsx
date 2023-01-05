import React, {useCallback, useEffect, useMemo} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ListRenderItemInfo,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';
import {
  NavigationComponentProps,
  NavigationFunctionComponent,
} from 'react-native-navigation';
import debounce from 'debounce';
import {shallowEqual, useSelector} from 'react-redux';
import {PixabayImage} from '../../api/pixabay/types';
import {ImageListRow} from './ImageListRow';
import {loadNextImagePage} from '../../redux/images/actions';
import {getState, ReduxState} from '../../redux/store';

export const ImageList: NavigationFunctionComponent<
  NavigationComponentProps
> = ({componentId}) => {
  const {data, loading, error} = useSelector(selector, shallowEqual);

  useEffect(() => {
    loadNextImagePage();
  }, []);

  useEffect(() => {
    if (error) {
      console.log('Error', error);

      Alert.alert('', error.message ?? 'Unknown error', [{text: 'Dismiss'}]);
    }
  }, [error]);

  const renderItem = useCallback(
    ({item}: ListRenderItemInfo<PixabayImage>) => {
      return <ImageListRow componentId={componentId} image={item} />;
    },
    [componentId],
  );

  const onEndReached = useCallback(() => {
    loadNextImagePage();
  }, []);

  const inputElement = useMemo(() => {
    return (
      <TextInput
        style={styles.input}
        defaultValue={getState().userInput}
        onChangeText={debounce(loadNextImagePage, 500)}
        placeholder="Search"
      />
    );
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {inputElement}
      <FlatList
        style={styles.list}
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onEndReached={onEndReached}
        ListFooterComponent={loading ? loaderElement : undefined}
        ListEmptyComponent={
          loading ? undefined : error ? errorElement : emptyElement
        }
      />
    </SafeAreaView>
  );
};

const selector = ({data, loading, error}: ReduxState) => ({
  data,
  loading,
  error,
});

const keyExtractor = (item: PixabayImage) => String(item.id);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    margin: 16,
    padding: 8,
    fontSize: 14,
    backgroundColor: '#ddd',
    borderRadius: 4,
  },
  list: {
    flex: 1,
  },
  empty: {
    textAlign: 'center',
  },
});

const loaderElement = <ActivityIndicator size="small" />;

const emptyElement = <Text style={styles.empty}>Nothing found.</Text>;

const errorElement = <Text style={styles.empty}>Error.</Text>;
