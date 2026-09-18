import { Redirect } from 'expo-router';

/**
 * The Share tab is presented as a prominent center button that opens the
 * Create Story flow (see the custom tabBarButton in this group's _layout).
 * If this route is ever reached directly, send the user home.
 */
export default function ShareTab() {
  return <Redirect href="/home" />;
}
