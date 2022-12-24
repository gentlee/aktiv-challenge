/**
 * @format
 */

import 'react-native';
import React from 'react';
import ImageList from '../src/screens/image-list/ImageList';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  renderer.create(<ImageList />);
});
