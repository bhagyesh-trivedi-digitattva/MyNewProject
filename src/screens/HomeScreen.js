import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    ScrollView,
    Animated,
    Dimensions,
    Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
    const [userData, setUserData] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const drawerAnim = useRef(new Animated.Value(-width * 0.7)).current;

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const data = await AsyncStorage.getItem('userData');
            if (data) setUserData(JSON.parse(data));
        } catch (e) {
            console.log("User Load Error", e);
        }
    };

    const toggleDrawer = () => {
        Animated.timing(drawerAnim, {
            toValue: drawerOpen ? -width * 0.7 : 0,
            duration: 260,
            useNativeDriver: true,
        }).start();
        setDrawerOpen(!drawerOpen);
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem("currentUser");
        navigation.replace("Auth", { screen: "Login" });
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={colors.white} barStyle="dark-content" />

            {/* Menu Button */}
            <View style={styles.menuBtn}>
                <TouchableOpacity onPress={toggleDrawer}>
                    <Image source={require('../assets/menu.png')} style={styles.menuIcon} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <Text style={styles.welcomeText}>
                        {userData ? `Welcome ${userData.name}!` : "Welcome 🎉"}
                    </Text>
                    <Text style={styles.subtitle}>You have successfully logged in.</Text>
                </View>

                <View style={styles.actionsContainer}>
                    <TouchableOpacity style={styles.primaryButton}>
                        <Text style={styles.primaryButtonText}>Explore App Features</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => navigation.navigate("Profile")}
                    >
                        <Text style={styles.secondaryButtonText}>View Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.logoutButtonText}>Logout</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Thank you for using our app 🚀</Text>
                </View>
            </ScrollView>

            {drawerOpen && <TouchableOpacity style={styles.overlay} onPress={toggleDrawer} />}

            {/* Drawer */}
            <Animated.View style={[styles.drawer, { transform: [{ translateX: drawerAnim }] }]}>
                <View style={styles.drawerHeader}>
                    <Image source={require('../assets/user.png')} style={styles.userIcon} />
                    <Text style={styles.userName}>{userData?.name}</Text>
                    <Text style={styles.userEmail}>{userData?.email}</Text>
                </View>

                <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate("Profile")}>
                    <Image source={require('../assets/profile.png')} style={styles.drawerIcon} />
                    <Text style={styles.drawerText}>Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.drawerItem} onPress={handleLogout}>
                    <Image source={require('../assets/logout.png')} style={styles.drawerIcon} />
                    <Text style={[styles.drawerText, { color: colors.danger }]}>Logout</Text>
                </TouchableOpacity>
            </Animated.View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.white },
    menuBtn: { paddingHorizontal: 20, paddingTop: 10 },
    menuIcon: { width: 28, height: 28, tintColor: colors.primary },
    scrollContainer: { flexGrow: 1, padding: 24 },
    header: { alignItems: "center", marginBottom: 32 },
    welcomeText: { fontSize: 32, fontWeight: "bold", color: colors.primary, textAlign: "center" },
    subtitle: { fontSize: 16, color: colors.gray, textAlign: "center" },
    actionsContainer: { gap: 16, marginBottom: 32 },
    primaryButton: { backgroundColor: colors.primary, padding: 18, borderRadius: 12, alignItems: "center" },
    primaryButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
    secondaryButton: { borderWidth: 1, borderColor: colors.primary, padding: 18, borderRadius: 12, alignItems: "center" },
    secondaryButtonText: { color: colors.primary, fontSize: 18, fontWeight: "bold" },
    logoutButton: { borderWidth: 1, borderColor: colors.danger, padding: 18, borderRadius: 12, alignItems: "center" },
    logoutButtonText: { color: colors.danger, fontSize: 16, fontWeight: "bold" },
    footer: { alignItems: "center", marginTop: 10 },
    footerText: { color: colors.gray },

    drawer: {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: width * 0.7,
        backgroundColor: "#fff",
        elevation: 10,
        paddingTop: 40,
        zIndex: 9999,
        paddingLeft: 15
    },
    overlay: {
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 500
    },
    drawerHeader: { alignItems: "center", marginBottom: 20, borderBottomWidth: 1, borderColor: "#eee", paddingBottom: 15 },
    userIcon: { width: 60, height: 60, tintColor: colors.primary },
    userName: { fontSize: 18, fontWeight: "bold" },
    userEmail: { fontSize: 14, color: "#666" },
    drawerItem: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
    drawerIcon: { width: 22, height: 22, marginRight: 10, tintColor: colors.primary },
    drawerText: { fontSize: 16, color: colors.primary }
});

export default HomeScreen;
