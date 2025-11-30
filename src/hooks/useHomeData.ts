import {useState, useEffect, useCallback} from 'react';
import {homeApi, ApiResponse} from '@/services/api';
import {HomeData} from '@/types/restaurant';

interface UseHomeDataReturn {
  data: HomeData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useHomeData = (): UseHomeDataReturn => {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = (await homeApi.getHomeData()) as unknown as ApiResponse<HomeData>;
      if (response.success) {
        setData(response.data);
      } else {
        setError('Failed to load data');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {data, loading, error, refetch: fetchData};
};
