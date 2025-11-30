#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
// Google Maps - Only import if available
#if __has_include(<GoogleMaps/GoogleMaps.h>)
#import <GoogleMaps/GoogleMaps.h>
#endif

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // Initialize Google Maps with API key from Info.plist
  #if __has_include(<GoogleMaps/GoogleMaps.h>)
  NSString *mapsApiKey = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"GOOGLE_MAPS_API_KEY"];
  if (mapsApiKey && mapsApiKey.length > 0) {
    [GMSServices provideAPIKey:mapsApiKey];
  }
  #endif
  
  self.moduleName = @"Bookable";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self getBundleURL];
}

- (NSURL *)getBundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
