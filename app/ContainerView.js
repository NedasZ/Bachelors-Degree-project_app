import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import LoadingView from './screens/LoadingViewScreen';

import { containerViewStyles as styles } from './styles/global';

const ContainerView = ({ children, onPress, touchEnabled, loadingOptions }) => (
  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : null}
    style={{ flex: 1 }}
  >
    <TouchableWithoutFeedback
      disabled={!touchEnabled}
      onPress={onPress}
      style={styles.container}
    >
      <View style={styles.container}>
        {loadingOptions && loadingOptions.loading && (
          <LoadingView hideSpinner={loadingOptions.hideSpinner} />
        )}
        {children}
      </View>
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
);

export default ContainerView;