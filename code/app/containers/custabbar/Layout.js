'use strict';

import { PixelRatio, Platform } from 'react-native';

export default {
  pixel: 1 / PixelRatio.get(),
  tabBarHeight:Platform.OS =='ios'?40:42//49,
};
