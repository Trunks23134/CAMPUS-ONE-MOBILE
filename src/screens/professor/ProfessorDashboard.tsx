import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, ActivityIndicator, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { logout, getCurrentUser, AuthUser } from '../../services/auth.service';
import ProfessorClassList from './ProfessorClassList';
import ProfessorStudents from './ProfessorStudents';
import ProfessorGrades from './ProfessorGrades';
import ProfessorAnnouncements from './ProfessorAnnouncements';
import ProfessorSchedule from './ProfessorSchedule';
import ProfessorSettings from './ProfessorSettings';
import ProfessorHelp from './ProfessorHelp';

interface ProfessorDashboardProps {
    navigation: any;
    onLogout: () => void;
}

export default function ProfessorDashboard({ navigation, onLogout }: ProfessorDashboardProps) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const screenWidth = Dimensions.get('window').width;
    const slideAnim = useRef(new Animated.Value(-screenWidth)).current;
    const [activeScreen, setActiveScreen] = useState('dashboard');
    const [stats, setStats] = useState({ totalClasses: 0, totalStudents: 0, pendingSubmissions: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUser();
        loadStats();
    }, []);

    const loadUser = async () => {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
    };

    const loadStats = () => {
        // Simulate loading stats
        setTimeout(() => {
            setStats({ totalClasses: 3, totalStudents: 45, pendingSubmissions: 12 });
            setLoading(false);
        }, 1000);
    };

    const openSidebar = () => {
        setSidebarOpen(true);
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const closeSidebar = () => {
        Animated.timing(slideAnim, {
            toValue: -screenWidth,
            duration: 250,
            useNativeDriver: true,
        }).start(() => {
            setSidebarOpen(false);
        });
    };

    const handleLogout = async () => {
        await logout();
        onLogout();
    };

    const handleViewClasses = () => {
        closeSidebar();
        setActiveScreen('classes');
    };

    const handleNavigation = (screen: string) => {
        closeSidebar();
        setActiveScreen(screen);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.headerSafeArea}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.menuButton} onPress={openSidebar}>
                        <Ionicons name="menu" size={24} color="#fff" />
                    </TouchableOpacity>

                    <View style={styles.headerTitle}>
                        <Text style={styles.headerTitleOrange}>CAMPUS</Text>
                        <Text style={styles.headerTitleWhite}>Faculty</Text>
                    </View>

                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Sidebar Modal */}
            <Modal
                visible={sidebarOpen}
                transparent={true}
                animationType="fade"
                onRequestClose={closeSidebar}
            >
                <SafeAreaView style={styles.modalContainer} edges={['top']}>
                    {/* Sidebar */}
                    <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
                        {/* Logo Section */}
                        <View style={styles.sidebarLogo}>
                            <View style={styles.logoIcon}>
                                <Ionicons name="book" size={20} color="#000" />
                            </View>
                            <View>
                                <Text style={styles.logoText}>
                                    <Text style={styles.logoOrange}>CAMPUS</Text>
                                    <Text style={styles.logoWhite}> Faculty</Text>
                                </Text>
                                <Text style={styles.logoSubtext}>Professor Portal</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={closeSidebar}
                            >
                                <Ionicons name="close" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        {/* Navigation */}
                        <ScrollView style={styles.sidebarNav}>
                            {/* Main Section */}
                            <View style={styles.navSection}>
                                <NavButton
                                    icon="bar-chart"
                                    label="Dashboard"
                                    active={activeScreen === 'dashboard'}
                                    onPress={() => handleNavigation('dashboard')}
                                />
                                <NavButton
                                    icon="book"
                                    label="My Classes"
                                    active={activeScreen === 'classes'}
                                    onPress={handleViewClasses}
                                />
                            </View>

                            {/* Divider */}
                            <View style={styles.divider} />

                            {/* Management Section */}
                            <View style={styles.navSection}>
                                <NavButton
                                    icon="people"
                                    label="Students"
                                    active={activeScreen === 'students'}
                                    onPress={() => handleNavigation('students')}
                                />
                                <NavButton
                                    icon="clipboard"
                                    label="Encode Grades"
                                    active={activeScreen === 'grades'}
                                    onPress={() => handleNavigation('grades')}
                                />
                                <NavButton
                                    icon="notifications"
                                    label="Announcements"
                                    active={activeScreen === 'announcements'}
                                    onPress={() => handleNavigation('announcements')}
                                />
                                <NavButton
                                    icon="calendar"
                                    label="Schedule"
                                    active={activeScreen === 'schedule'}
                                    onPress={() => handleNavigation('schedule')}
                                />
                            </View>

                            {/* Divider */}
                            <View style={styles.divider} />

                            {/* Settings Section */}
                            <View style={styles.navSection}>
                                <NavButton
                                    icon="settings"
                                    label="Settings"
                                    active={activeScreen === 'settings'}
                                    onPress={() => handleNavigation('settings')}
                                />
                                <NavButton
                                    icon="help-circle"
                                    label="Help & Support"
                                    active={activeScreen === 'help'}
                                    onPress={() => handleNavigation('help')}
                                />
                            </View>
                        </ScrollView>

                        {/* User Section */}
                        <View style={styles.sidebarUser}>
                            <View style={styles.userInfo}>
                                <Text style={styles.userLabel}>Logged in as</Text>
                                <Text style={styles.userName}>{user?.name || user?.email}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.logoutButtonSidebar}
                                onPress={handleLogout}
                            >
                                <Ionicons name="log-out" size={20} color="#ef4444" />
                                <Text style={styles.logoutText}>Log Out</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>

                    {/* Overlay */}
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPress={closeSidebar}
                    />
                </SafeAreaView>
            </Modal>

            {/* Content */}
            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                {activeScreen === 'dashboard' && (
                    <>
                        {/* Welcome Section */}
                        <View style={styles.welcomeSection}>
                            <Text style={styles.welcomeTitle}>Welcome back, Professor!</Text>
                            <Text style={styles.welcomeSubtitle}>{user?.name || user?.email}</Text>
                        </View>

                        {/* Stats Cards */}
                        {loading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#F59E0B" />
                                <Text style={styles.loadingText}>Loading statistics...</Text>
                            </View>
                        ) : (
                            <View style={styles.statsGrid}>
                                <StatCard
                                    icon="book"
                                    label="Total Classes"
                                    value={stats.totalClasses}
                                    color="#F59E0B"
                                    description="Classes assigned this semester"
                                />
                                <StatCard
                                    icon="people"
                                    label="Total Students"
                                    value={stats.totalStudents}
                                    color="#2563eb"
                                    description="Across all your classes"
                                />
                                <StatCard
                                    icon="clipboard"
                                    label="Pending Submissions"
                                    value={stats.pendingSubmissions}
                                    color="#dc2626"
                                    description="Awaiting your review"
                                />
                            </View>
                        )}

                        {/* Quick Actions */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Quick Actions</Text>

                            <ActionCard
                                icon="book"
                                title="View My Classes"
                                subtitle="Manage your assigned subjects"
                                onPress={handleViewClasses}
                            />
                            <ActionCard
                                icon="clipboard"
                                title="Encode Grades"
                                subtitle="Input and manage student grades"
                                onPress={() => handleNavigation('grades')}
                            />
                            <ActionCard
                                icon="notifications"
                                title="Post Announcement"
                                subtitle="Notify your students"
                                onPress={() => handleNavigation('announcements')}
                            />
                        </View>

                        {/* Info Section */}
                        <View style={styles.infoBox}>
                            <View style={styles.infoIcon}>
                                <Ionicons name="book" size={24} color="#fff" />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoTitle}>Professor Dashboard</Text>
                                <Text style={styles.infoText}>
                                    Manage your classes, students, grades, and announcements all in one place.
                                </Text>
                            </View>
                        </View>
                    </>
                )}

                {activeScreen === 'classes' && <ProfessorClassList navigation={navigation} isEmbedded={true} />}
                {activeScreen === 'students' && <ProfessorStudents />}
                {activeScreen === 'grades' && <ProfessorGrades />}
                {activeScreen === 'announcements' && <ProfessorAnnouncements />}
                {activeScreen === 'schedule' && <ProfessorSchedule />}
                {activeScreen === 'settings' && <ProfessorSettings />}
                {activeScreen === 'help' && <ProfessorHelp />}
            </ScrollView>
        </SafeAreaView>
    );
}



// Navigation Button Component
function NavButton({
    icon,
    label,
    active,
    onPress
}: {
    icon: string;
    label: string;
    active: boolean;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity
            style={[styles.navButton, active && styles.navButtonActive]}
            onPress={onPress}
        >
            <Ionicons
                name={icon as any}
                size={20}
                color={active ? '#fff' : '#d1d5db'}
            />
            <Text style={[styles.navButtonText, active && styles.navButtonTextActive]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}

// Stat Card Component
function StatCard({
    icon,
    label,
    value,
    color,
    description
}: {
    icon: string;
    label: string;
    value: number;
    color: string;
    description: string;
}) {
    return (
        <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: `${color}15` }]}>
                <Ionicons name={icon as any} size={24} color={color} />
            </View>
            <Text style={styles.statLabel}>{label}</Text>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statDescription}>{description}</Text>
        </View>
    );
}

// Action Card Component
function ActionCard({
    icon,
    title,
    subtitle,
    onPress
}: {
    icon: string;
    title: string;
    subtitle: string;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity style={styles.actionCard} onPress={onPress}>
            <View style={styles.actionIconContainer}>
                <Ionicons name={icon as any} size={24} color="#F59E0B" />
            </View>
            <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>{title}</Text>
                <Text style={styles.actionSubtitle}>{subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
    },
    headerSafeArea: {
        backgroundColor: '#1a1a1a',
    },
    header: {
        backgroundColor: '#1a1a1a',
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    headerTitle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitleOrange: {
        color: '#F59E0B',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: -0.5,
    },
    headerTitleWhite: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '300',
        letterSpacing: -0.5,
    },
    menuButton: {
        width: 40,
        height: 40,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutButton: {
        width: 40,
        height: 40,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Modal & Sidebar
    modalContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    sidebar: {
        width: 256,
        backgroundColor: '#1a1a1a',
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
        flexDirection: 'column',
    },
    sidebarLogo: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#374151',
        gap: 12,
    },
    logoIcon: {
        width: 32,
        height: 32,
        backgroundColor: '#F59E0B',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    logoOrange: {
        color: '#F59E0B',
    },
    logoWhite: {
        color: '#fff',
    },
    logoSubtext: {
        fontSize: 11,
        color: '#9ca3af',
        marginTop: 2,
    },
    closeButton: {
        marginLeft: 'auto',
        padding: 8,
    },
    sidebarNav: {
        flex: 1,
        paddingVertical: 16,
    },
    navSection: {
        paddingHorizontal: 8,
        marginBottom: 8,
    },
    navButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        marginBottom: 4,
    },
    navButtonActive: {
        backgroundColor: '#F59E0B',
    },
    navButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#d1d5db',
    },
    navButtonTextActive: {
        color: '#fff',
    },
    divider: {
        height: 1,
        backgroundColor: '#374151',
        marginVertical: 8,
    },
    sidebarUser: {
        borderTopWidth: 1,
        borderTopColor: '#374151',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    userInfo: {
        marginBottom: 12,
    },
    userLabel: {
        fontSize: 11,
        color: '#9ca3af',
        marginBottom: 4,
    },
    userName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#fff',
    },
    logoutButtonSidebar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
    },
    logoutText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#ef4444',
    },

    // Content
    content: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    contentContainer: {
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    welcomeSection: {
        marginBottom: 24,
    },
    welcomeTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    welcomeSubtitle: {
        fontSize: 14,
        color: '#6b7280',
    },

    // Loading
    loadingContainer: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 12,
    },

    // Stats Grid
    statsGrid: {
        marginBottom: 24,
    },
    statCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        marginBottom: 12,
        alignItems: 'center',
    },
    statIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    statLabel: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 4,
    },
    statValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    statDescription: {
        fontSize: 11,
        color: '#9ca3af',
    },

    // Section
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 12,
    },

    // Action Card
    actionCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    actionIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionContent: {
        flex: 1,
    },
    actionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 2,
    },
    actionSubtitle: {
        fontSize: 12,
        color: '#6b7280',
    },

    // Info Box
    infoBox: {
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(245, 158, 11, 0.2)',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    infoIcon: {
        width: 40,
        height: 40,
        backgroundColor: '#F59E0B',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoContent: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    infoText: {
        fontSize: 12,
        color: '#6b7280',
        lineHeight: 18,
    },
});
