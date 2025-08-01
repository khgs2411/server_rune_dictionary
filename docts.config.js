export default {
  // Custom rollup configuration for docts
  rollup: {
    external: (id) => {
      // Keep mongoose external due to size
      if (id === 'mongoose' || id.startsWith('mongoose/')) {
        return true;
      }
      // Bundle topsyde-utils to fix ES module issues
      if (id === 'topsyde-utils' || id.startsWith('topsyde-utils/')) {
        return false;
      }
      // Default behavior for other modules
      return !id.startsWith('.') && !id.startsWith('/');
    }
  }
};