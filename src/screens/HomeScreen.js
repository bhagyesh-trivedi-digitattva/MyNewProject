import React, { useEffect, useState, useRef, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Image,
  Platform,
} from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { setTestValue } from '../slices/authSlice';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { appTheme, toggleTheme } = useContext(ThemeContext);

  const [userData, setUserData] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerAnim = useRef(new Animated.Value(-width * 0.7)).current;

  const testValue = useSelector(state => state.auth.testValue);
  const dispatch = useDispatch();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const data = await AsyncStorage.getItem('userData');
      if (data) setUserData(JSON.parse(data));
    } catch (e) {
      console.log('User Load Error', e);
    }
  };

  const toggleDrawer = () => {
    Animated.timing(drawerAnim, {
      toValue: drawerOpen ? -width * 0.7 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('isLoggedIn');
    navigation.replace('Auth');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: appTheme.colors.bg }]}>
      <StatusBar
        translucent={Platform.OS === 'ios'}
        backgroundColor={Platform.OS === 'android' ? appTheme.colors.bg : 'transparent'}
        barStyle={appTheme.dark ? 'light-content' : 'dark-content'}
      />

      {/* Menu Button */}
      <View style={styles.menuBtn}>
        <TouchableOpacity onPress={toggleDrawer} activeOpacity={0.8}>
          <Image
            source={require('../assets/menu.png')}
            style={[styles.menuIcon, { tintColor: appTheme.colors.primary }]}
          />
        </TouchableOpacity>
      </View>
      {/* THEME TOGGLE SWITCH - TOP RIGHT */}
<View style={styles.themeToggleContainer}>
  <TouchableOpacity onPress={toggleTheme} activeOpacity={0.9}>
    <Animated.View
      style={[
        styles.toggleSwitch,
        {
          backgroundColor: appTheme.dark
            ? appTheme.colors.primary
            : appTheme.colors.gray,
        }
      ]}
    >
      {/* Icons inside switch */}
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>☀️</Text>
        <Text style={styles.icon}>🌙</Text>
      </View>

      {/* Sliding ball */}
      <Animated.View
        style={[
          styles.toggleCircle,
          {
            transform: [{ translateX: appTheme.dark ? 26 : 0 }],
            backgroundColor: appTheme.colors.white,
          }
        ]}
      />
    </Animated.View>
  </TouchableOpacity>
</View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.welcomeText, { color: appTheme.colors.primary }]}>
            {userData ? `Welcome, ${userData.name}!` : 'Welcome 🎉'}
          </Text>

          <Text style={[styles.subtitle, { color: appTheme.colors.gray }]}>
            You have successfully logged in.
          </Text>
        </View>

        <View style={styles.actionsContainer}>

          {/* REDUX TEST BUTTON */}
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: appTheme.colors.primary }]}
            activeOpacity={0.8}
            onPress={() => dispatch(setTestValue("Redux IS WORKING 🎉"))}
          >
            <Text style={[styles.primaryButtonText, { color: appTheme.colors.white }]}>
              TEST REDUX
            </Text>
          </TouchableOpacity>

          <Text style={{ marginTop: 10, fontSize: 16, color: appTheme.colors.primary }}>
            {testValue}
          </Text>

          {/* THEME TOGGLE BUTTON */}
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: appTheme.colors.card }]}
            activeOpacity={0.8}
            onPress={toggleTheme}
          >
            <Text style={{ color: appTheme.colors.text, fontSize: 18, fontWeight: 'bold' }}>
              Toggle Theme ({appTheme.dark ? "Dark" : "Light"})
            </Text>
          </TouchableOpacity>

          {/* Profile */}
          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: appTheme.colors.primary }]}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={[styles.secondaryButtonText, { color: appTheme.colors.primary }]}>
              View Profile
            </Text>
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity
            style={[styles.logoutButton, { borderColor: appTheme.colors.danger }]}
            activeOpacity={0.8}
            onPress={handleLogout}
          >
            <Text style={[styles.logoutButtonText, { color: appTheme.colors.danger }]}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: appTheme.colors.gray }]}>
            Thank you for using our app 🚀
          </Text>
        </View>
      </ScrollView>

      {/* Overlay */}
      {drawerOpen && (
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={toggleDrawer} />
      )}

      {/* Drawer */}
      <Animated.View style={[
        styles.drawer,
        {
          transform: [{ translateX: drawerAnim }],
          backgroundColor: appTheme.colors.card
        }
      ]}>
        <View style={styles.drawerHeader}>
          <Image
            source={require('../assets/user.png')}
            style={[styles.userIcon, { tintColor: appTheme.colors.primary }]}
          />
          <Text style={[styles.userName, { color: appTheme.colors.text }]}>{userData?.name}</Text>
          <Text style={[styles.userEmail, { color: appTheme.colors.gray }]}>{userData?.email}</Text>
        </View>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            toggleDrawer();
            navigation.navigate('Profile');
          }}
        >
          <Image
            source={require('../assets/profile.png')}
            style={[styles.drawerIcon, { tintColor: appTheme.colors.primary }]}
          />
          <Text style={[styles.drawerText, { color: appTheme.colors.primary }]}>
            Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.drawerItem} onPress={handleLogout}>
          <Image
            source={require('../assets/logout.png')}
            style={[styles.drawerIcon, { tintColor: appTheme.colors.danger }]}
          />
          <Text style={[styles.drawerText, { color: appTheme.colors.danger }]}>
            Logout
          </Text>
        </TouchableOpacity>
      </Animated.View>

    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },

  menuBtn: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
  },
  menuIcon: { width: 28, height: 28 },

  scrollContainer: { flexGrow: 1, padding: 24 },

  header: { alignItems: 'center', marginBottom: 32 },

  welcomeText: { fontSize: 30, fontWeight: 'bold', marginBottom: 8 },

  subtitle: { fontSize: 16, textAlign: 'center' },

  actionsContainer: { gap: 16, marginBottom: 32 },

  primaryButton: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
      },
      android: { elevation: 4 },
    }),
  },

  primaryButtonText: { fontSize: 18, fontWeight: 'bold' },

  secondaryButton: {
    borderWidth: 1.5,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },

  secondaryButtonText: { fontSize: 18, fontWeight: 'bold' },

  logoutButton: {
    borderWidth: 1.5,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },

  logoutButtonText: { fontSize: 16, fontWeight: 'bold' },

  footer: { alignItems: 'center', marginTop: 10 },

  footerText: {},

  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 500,
  },

  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: width * 0.7,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingLeft: 15,
    zIndex: 9999,
    ...Platform.select({
      ios: {
        shadowOpacity: 0.25,
        shadowOffset: { width: 2, height: 4 },
        shadowRadius: 8,
      },
      android: { elevation: 10 },
    }),
  },

  drawerHeader: {
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingBottom: 15,
  },
themeToggleContainer: {
  position: 'absolute',
  right: 20,
  top: Platform.OS === 'ios' ? 15 : 35,
  zIndex: 999,
},

toggleSwitch: {
  width: 55,
  height: 30,
  borderRadius: 30,
  justifyContent: 'center',
  paddingHorizontal: 4,
},

toggleCircle: {
  width: 24,
  height: 24,
  borderRadius: 12,
  position: 'absolute',
  top: 3,
  left: 3,
},

iconContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  paddingHorizontal: 6,
},

icon: {
  fontSize: 14,
},

  userIcon: { width: 60, height: 60, marginBottom: 10 },

  userName: { fontSize: 18, fontWeight: 'bold' },

  userEmail: { fontSize: 14 },

  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingLeft: 10,
  },

  drawerIcon: { width: 22, height: 22, marginRight: 10 },

  drawerText: { fontSize: 16 },
});
