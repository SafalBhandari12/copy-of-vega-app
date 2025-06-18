export const getBaseUrl = async (providerValue: string) => {
  try {
    let baseUrl = '';
    const cacheKey = 'CacheBaseUrl_' + providerValue;
    const timeKey = 'baseUrlTime_' + providerValue;
    const expireTime = 60 * 60 * 1000; // 1 hour

    const cachedUrl = localStorage.getItem(cacheKey);
    const cachedTime = localStorage.getItem(timeKey);

    if (
      cachedUrl &&
      cachedTime &&
      Date.now() - parseInt(cachedTime, 10) < expireTime
    ) {
      baseUrl = cachedUrl;
    } else {
      const baseUrlRes = await fetch(
        'https://himanshu8443.github.io/providers/modflix.json',
      );
      const baseUrlData = await baseUrlRes.json();
      baseUrl = baseUrlData[providerValue].url;
      localStorage.setItem(cacheKey, baseUrl);
      localStorage.setItem(timeKey, Date.now().toString());
    }
    return baseUrl;
  } catch (error) {
    console.error(`Error fetching baseUrl: ${providerValue}`, error);
    return '';
  }
};
