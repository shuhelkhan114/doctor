import toast from '@core/lib/toast';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Purchases, { CustomerInfo, LOG_LEVEL, PurchasesOffering } from 'react-native-purchases';

export const useRevenueCat = () => {
  const [offerings, setOfferings] = useState<{ [key: string]: PurchasesOffering }>();
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

  const subscriptionState = customerInfo?.activeSubscriptions;

  useEffect(() => {
    const fetchInfo = async () => {
      Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

      if (Platform.OS === 'ios') {
        Purchases.configure({
          apiKey: 'appl_sMMcDhIyCebguusqisDEssqwcgq',
        });
        const offerings = await Purchases.getOfferings();
        const customerInfo = await Purchases.getCustomerInfo();
        setCustomerInfo(customerInfo);
        setOfferings(offerings.all);
      } else {
        toast.error('Android not supported yet');
      }
    };

    fetchInfo().catch(console.error);
  }, []);

  useEffect(() => {
    const customerInfoUpdated = async (info: CustomerInfo) => {
      setCustomerInfo(info);
    };
    Purchases.addCustomerInfoUpdateListener(customerInfoUpdated);
  }, []);

  return {
    customerInfo,
    offerings,
    subscriptionState,
  };
};

export default useRevenueCat;
