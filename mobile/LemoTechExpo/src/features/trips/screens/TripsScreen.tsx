import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  FlatList
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  SecondaryButton,
  CleanIcon,
  ClockIcon,
  StarIcon
} from '../../../design-system';
import { COLORS } from '../../../constants/app';

interface Trip {
  id: string;
  date: string;
  time: string;
  status: 'completed' | 'in_progress' | 'cancelled';
  items: string[];
  total: number;
  rating?: number;
  driver?: {
    name: string;
    rating: number;
  };
}

interface TripsScreenProps {
  navigation?: any;
}

export const TripsScreen: React.FC<TripsScreenProps> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<'past' | 'upcoming'>('past');

  const trips: Trip[] = [
    { id: '1', date: '2024-01-15', time: '14:30', status: 'completed', items: ['Sneakers', 'Shirts', 'Jeans'], total: 85, rating: 5, driver: { name: 'Sarah Johnson', rating: 4.8 } },
    { id: '2', date: '2024-01-12', time: '10:15', status: 'completed', items: ['Suits', 'Dresses'], total: 65, rating: 4, driver: { name: 'Mike Chen', rating: 4.9 } },
    { id: '3', date: '2024-01-18', time: '16:45', status: 'in_progress', items: ['Bedding', 'Curtains'], total: 90, driver: { name: 'Emma Wilson', rating: 4.7 } },
  ];

  const upcomingTrips: Trip[] = [
    { id: '4', date: '2024-01-20', time: '09:00', status: 'in_progress', items: ['Sneakers', 'Casual Shoes'], total: 50 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return COLORS.success;
      case 'in_progress':
        return COLORS.warning;
      case 'cancelled':
        return COLORS.error;
      default:
        return COLORS.grey[500];
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const renderTripItem = ({ item }: { item: Trip }) => (
    <View style={styles.tripCard}>
      <View style={styles.tripHeader}>
        <View style={styles.tripDate}>
          <Text style={styles.tripDateText}>{item.date}</Text>
          <Text style={styles.tripTimeText}>{item.time}</Text>
        </View>
        <View style={styles.tripStatus}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.tripContent}>
        <View style={styles.itemsSection}>
          <Text style={styles.sectionTitle}>Items</Text>
          <View style={styles.itemsList}>
            {item.items.map((itemName, index) => (
              <View key={index} style={styles.itemTag}>
                <Text style={styles.itemTagText}>{itemName}</Text>
              </View>
            ))}
          </View>
        </View>

        {item.driver && (
          <View style={styles.driverSection}>
            <Text style={styles.sectionTitle}>Driver</Text>
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>{item.driver.name}</Text>
              <View style={styles.driverRating}>
                <StarIcon size="sm" variant="warning" />
                <Text style={styles.driverRatingText}>{item.driver.rating}</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.tripFooter}>
          <Text style={styles.totalAmount}>R{item.total}</Text>
          {item.status === 'completed' && item.rating && (
            <View style={styles.ratingSection}>
              <Text style={styles.ratingLabel}>Your Rating:</Text>
              <View style={styles.ratingStars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    size="sm"
                    variant={star <= item.rating! ? 'warning' : 'muted'}
                  />
                ))}
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const currentTrips = activeTab === 'past' ? trips : upcomingTrips;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0A28" />
      <LinearGradient
        colors={['#0F0A28', '#1E1440', '#190F32']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Trips</Text>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'past' && styles.activeTab]}
            onPress={() => setActiveTab('past')}
          >
            <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>
              Past
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
            onPress={() => setActiveTab('upcoming')}
          >
            <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
              Upcoming
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {currentTrips.length > 0 ? (
          <FlatList
            data={currentTrips}
            renderItem={renderTripItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <CleanIcon size="xl" variant="muted" />
            <Text style={styles.emptyTitle}>
              {activeTab === 'past' ? "No trips yet" : "No upcoming trips"}
            </Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'past' 
                ? "Your completed trips will appear here"
                : "Your scheduled trips will appear here"
              }
            </Text>
            <SecondaryButton
              size="md"
              onPress={() => navigation?.navigate('Book')}
              style={styles.bookButton}
            >
              Book Now
            </SecondaryButton>
          </View>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0A28',
  },
  gradient: {
    flex: 1,
  },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
    letterSpacing: -0.5,
  },

  // Tab Navigation
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  activeTabText: {
    color: COLORS.white,
  },

  // List
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // Trip Card
  tripCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tripDate: {
    alignItems: 'flex-start',
  },
  tripDateText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 2,
  },
  tripTimeText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  tripStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
    textTransform: 'uppercase',
  },

  // Trip Content
  tripContent: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemsSection: {
    marginBottom: 16,
  },
  itemsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  itemTag: {
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 53, 0.3)',
  },
  itemTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },

  // Driver Section
  driverSection: {
    marginBottom: 16,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  driverRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverRatingText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
    marginLeft: 4,
  },

  // Trip Footer
  tripFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },
  ratingSection: {
    alignItems: 'flex-end',
  },
  ratingLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  ratingStars: {
    flexDirection: 'row',
    gap: 2,
  },

  // Empty State
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  bookButton: {
    paddingHorizontal: 32,
  },
});


