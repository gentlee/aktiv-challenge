import React, {FC} from 'react';
import {Navigation} from 'react-native-navigation';
import {Provider} from 'react-redux';
import {store} from './redux/store';

const withRedux = <T extends object>(Component: FC<T>) => {
  return (props: T) => (
    <Provider store={store}>
      <Component {...props} />
    </Provider>
  );
};

Navigation.registerComponent('ImageList', () =>
  withRedux(require('./screens/image-list/ImageList').ImageList),
);
Navigation.registerComponent('ImageViewer', () =>
  withRedux(require('./screens/image-viewer/ImageViewer').ImageViewer),
);

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'ImageList',
            },
          },
        ],
      },
    },
  });
});
