import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useHomeData} from '@/hooks/useHomeData';
import {Restaurant} from '@/types/restaurant';
import RestaurantCard from '@/components/home/RestaurantCard';
import TopRestaurantItem from '@/components/home/TopRestaurantItem';
import SectionHeader from '@/components/home/SectionHeader';
import CuisineCard from '@/components/home/CuisineCard';
import AreaChip from '@/components/home/AreaChip';
import PromotionCard from '@/components/home/PromotionCard';
import ExperienceCard from '@/components/home/ExperienceCard';
import FilterBar from '@/components/home/FilterBar';

type TopTab = 'topBooked' | 'topViewed' | 'topSaved';

const HomeScreen: React.FC = () => {
  const {data, loading, error, refetch} = useHomeData();
  const [activeTopTab, setActiveTopTab] = useState<TopTab>('topBooked');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (loading && !data) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#DA3743" />
      </View>
    );
  }

  if (error && !data) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error-outline" size={64} color="#DA3743" />
        <Text style={styles.errorText}>Failed to load data</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const sections = data?.sections;

  const renderRestaurantList = (
    restaurants: Restaurant[],
    showTimeSlots = false,
    showPoints = false,
  ) => (
    <FlatList
      horizontal
      data={restaurants}
      keyExtractor={item => item._id}
      renderItem={({item}) => (
        <RestaurantCard
          restaurant={item}
          showTimeSlots={showTimeSlots}
          showPoints={showPoints}
        />
      )}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.horizontalList}
    />
  );

  const renderTopRestaurantTabs = () => (
    <View style={styles.tabsContainer}>
      {(['topBooked', 'topViewed', 'topSaved'] as TopTab[]).map(tab => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, activeTopTab === tab && styles.activeTab]}
          onPress={() => setActiveTopTab(tab)}>
          <Text style={[styles.tabText, activeTopTab === tab && styles.activeTabText]}>
            {tab === 'topBooked' ? 'Top booked' : tab === 'topViewed' ? 'Top viewed' : 'Top saved'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#DA3743" />}
        showsVerticalScrollIndicator={false}>
        
        {/* Header with Greeting */}
        <View style={styles.header}>
          <Text style={styles.greeting}>{data?.greeting || 'Good afternoon'}</Text>
          <TouchableOpacity style={styles.profileButton}>
            <Icon name="person-outline" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Filter Bar */}
        <FilterBar />

        {/* Book for dinner tonight */}
        {sections?.bookTonight && sections.bookTonight.data.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title={sections.bookTonight.title} />
            {renderRestaurantList(sections.bookTonight.data, true, true)}
          </View>
        )}

        {/* Top restaurants this week */}
        {sections?.topRestaurants && (
          <View style={styles.section}>
            <SectionHeader
              title={sections.topRestaurants.title}
              subtitle={sections.topRestaurants.subtitle}
              showViewAll={false}
            />
            {renderTopRestaurantTabs()}
            <View style={styles.topRestaurantsList}>
              {sections.topRestaurants.tabs[activeTopTab].data.map((restaurant, index) => (
                <TopRestaurantItem
                  key={restaurant._id}
                  restaurant={restaurant}
                  rank={index + 1}
                />
              ))}
            </View>
            <TouchableOpacity style={styles.viewFullListButton}>
              <Text style={styles.viewFullListText}>View full list</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Award-winning */}
        {sections?.awardWinning && sections.awardWinning.data.length > 0 && (
          <View style={styles.section}>
            <SectionHeader
              title={sections.awardWinning.title}
              subtitle={sections.awardWinning.subtitle}
            />
            {renderRestaurantList(sections.awardWinning.data)}
          </View>
        )}

        {/* Outdoor dining */}
        {sections?.outdoorDining && sections.outdoorDining.data.length > 0 && (
          <View style={styles.section}>
            <SectionHeader
              title={sections.outdoorDining.title}
              subtitle={sections.outdoorDining.subtitle}
            />
            {renderRestaurantList(sections.outdoorDining.data, true)}
          </View>
        )}

        {/* Featured restaurants */}
        {sections?.featured && sections.featured.data.length > 0 && (
          <View style={styles.section}>
            <SectionHeader
              title={sections.featured.title}
              subtitle={sections.featured.subtitle}
            />
            {renderRestaurantList(sections.featured.data, true, true)}
          </View>
        )}

        {/* New to Bookable */}
        {sections?.newToBookable && sections.newToBookable.data.length > 0 && (
          <View style={styles.section}>
            <SectionHeader
              title={sections.newToBookable.title}
              subtitle={sections.newToBookable.subtitle}
            />
            {renderRestaurantList(sections.newToBookable.data, true)}
          </View>
        )}

        {/* Wine tasting */}
        {sections?.wineTasting && sections.wineTasting.data.length > 0 && (
          <View style={styles.section}>
            <SectionHeader
              title={sections.wineTasting.title}
              subtitle={sections.wineTasting.subtitle}
            />
            {renderRestaurantList(sections.wineTasting.data, true)}
          </View>
        )}

        {/* Featured Experiences */}
        {sections?.featuredExperiences && sections.featuredExperiences.data.length > 0 && (
          <View style={styles.section}>
            <SectionHeader
              title={sections.featuredExperiences.title}
              subtitle={sections.featuredExperiences.subtitle}
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {sections.featuredExperiences.data.map(exp => (
                <ExperienceCard key={exp._id} experience={exp} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Get inspired */}
        {sections?.getInspired && sections.getInspired.data.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title={sections.getInspired.title} showViewAll={false} />
            <FlatList
              horizontal
              data={sections.getInspired.data}
              keyExtractor={item => item._id}
              renderItem={({item}) => <PromotionCard promotion={item} />}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </View>
        )}

        {/* Browse by cuisine */}
        {sections?.cuisines && sections.cuisines.data.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title={sections.cuisines.title} />
            <FlatList
              horizontal
              data={sections.cuisines.data}
              keyExtractor={item => item._id}
              renderItem={({item}) => <CuisineCard category={item} />}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </View>
        )}

        {/* Explore the area */}
        {sections?.areas && sections.areas.data.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title={sections.areas.title} />
            <View style={styles.areasContainer}>
              {sections.areas.data.map(area => (
                <AreaChip key={area._id} area={area} />
              ))}
            </View>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#DA3743',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginTop: 24,
  },
  horizontalList: {
    paddingHorizontal: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginRight: 24,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#DA3743',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#DA3743',
    fontWeight: '600',
  },
  topRestaurantsList: {
    backgroundColor: '#FFFFFF',
  },
  viewFullListButton: {
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  viewFullListText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DA3743',
  },
  areasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
  },
  bottomPadding: {
    height: 100,
  },
});

export default HomeScreen;
