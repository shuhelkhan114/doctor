import { logError } from '@core/utils/logger';
import { QueryCache, QueryClient } from 'react-query';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      logError(error);
    },
  }),
});
