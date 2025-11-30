import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const RewardsScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text style={styles.pageTitle}>Bookable Regulars</Text>

        {/* Go for Gold Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Go for Gold status</Text>
          <Text style={styles.sectionDescription}>
            Make and complete six bookings on Bookable to unlock exclusive benefits like:
          </Text>

          {/* Priority Notify */}
          <View style={styles.benefitItem}>
            <View style={styles.benefitIcon}>
              <Text style={styles.bellEmoji}>🔔</Text>
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Priority notify</Text>
              <Text style={styles.benefitDescription}>
                Be the first to know when tables open up.
              </Text>
            </View>
          </View>

          {/* Uber One */}
          <View style={styles.benefitItem}>
            <View style={styles.benefitIcon}>
              <Text style={styles.giftEmoji}>🎁</Text>
            </View>
            <View style={styles.benefitContent}>
              <View style={styles.benefitTitleRow}>
                <Text style={styles.benefitTitle}>6 months of Uber One for free</Text>
                <View style={styles.externalBadge}>
                  <Icon name="open-in-new" size={12} color="#6B7280" />
                </View>
              </View>
              <Text style={styles.benefitDescription}>
                Enjoy member-only savings on Uber, Uber Eats, and more. Offer excludes current Uber
                One members.*
              </Text>
            </View>
          </View>
        </View>

        {/* Earn Points Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Earn points, enjoy rewards</Text>
          <Text style={styles.sectionDescription}>
            Start accumulating points immediately by booking on Bookable, then redeem for rewards
            like:
          </Text>

          {/* Experiences Credit Card */}
          <TouchableOpacity style={styles.rewardCard}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80',
              }}
              style={styles.rewardImage}
            />
            <View style={styles.rewardContent}>
              <Text style={styles.rewardTitle}>Experiences credit</Text>
              <Text style={styles.rewardDescription}>
                Save on prix fixe menus, cocktail classes, and more.
              </Text>
            </View>
          </TouchableOpacity>

          {/* Amazon Gift Card */}
          <TouchableOpacity style={styles.rewardCard}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=400&q=80',
              }}
              style={styles.rewardImage}
            />
            <View style={styles.rewardContent}>
              <Text style={styles.rewardTitle}>Amazon gift card</Text>
              <Text style={styles.rewardDescription}>
                Exchange points for cash to use on Amazon.
              </Text>
            </View>
          </TouchableOpacity>

          {/* Dining Credit Card */}
          <TouchableOpacity style={styles.rewardCard}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80',
              }}
              style={styles.rewardImage}
            />
            <View style={styles.rewardContent}>
              <Text style={styles.rewardTitle}>Dining credit</Text>
              <Text style={styles.rewardDescription}>
                Get credit towards your next restaurant bill.
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Footer Note */}
        <View style={styles.footerNote}>
          <Text style={styles.footerNoteText}>
            *This offer is provided by Uber. Bookable is not responsible for Uber One programme
            terms, billing, or fulfilment.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  benefitIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  bellEmoji: {
    fontSize: 24,
  },
  giftEmoji: {
    fontSize: 24,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  externalBadge: {
    marginLeft: 6,
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  rewardCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  rewardImage: {
    width: 120,
    height: 100,
  },
  rewardContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  rewardDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  footerNote: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  footerNoteText: {
    fontSize: 12,
    color: '#9CA3AF',
    lineHeight: 18,
  },
});

export default RewardsScreen;
