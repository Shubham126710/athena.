export const safeGetStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item !== null ? item : defaultValue;
  } catch (error) {
    return defaultValue;
  }
};

export const safeSetStorage = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn('localStorage is disabled or not accessible', error);
  }
};

export const safeRemoveStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn('localStorage is disabled or not accessible', error);
  }
};
