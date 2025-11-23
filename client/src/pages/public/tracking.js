// public/tracking.js
// Visitor Tracking Script - Add this to your website's public HTML
// Version: 2.0 - Enhanced with better error handling and performance

(function() {
  'use strict';

  // ==================== CONFIGURATION ====================
  const CONFIG = {
    API_BASE_URL: window.VISITOR_TRACKING_API || 'http://localhost:5000/api/visitor-tracking',
    UPDATE_INTERVAL: 5000, // 5 seconds
    SCROLL_DEBOUNCE: 150, // ms
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000 // ms
  };

  // ==================== UTILITY FUNCTIONS ====================

  /**
   * Generate or retrieve visitor ID from localStorage
   */
  function getVisitorId() {
    let visitorId = localStorage.getItem('visitorId');
    if (!visitorId) {
      visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('visitorId', visitorId);
    }
    return visitorId;
  }

  /**
   * Generate or retrieve session ID from sessionStorage
   */
  function getSessionId() {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }

  /**
   * Get UTM parameters from URL
   */
  function getUtmParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      source: params.get('utm_source') || undefined,
      medium: params.get('utm_medium') || undefined,
      campaign: params.get('utm_campaign') || undefined,
      term: params.get('utm_term') || undefined,
      content: params.get('utm_content') || undefined
    };
  }

  /**
   * Get screen resolution
   */
  function getScreenResolution() {
    return `${window.screen.width}x${window.screen.height}`;
  }

  /**
   * Get user identity from localStorage
   */
  function getUserIdentity() {
    return {
      email: localStorage.getItem('userEmail') || undefined,
      name: localStorage.getItem('userName') || undefined,
      phone: localStorage.getItem('userPhone') || undefined,
      company: localStorage.getItem('userCompany') || undefined
    };
  }

  /**
   * Send tracking data to API with retry logic
   */
  async function sendTrackingData(endpoint, data, retryCount = 0) {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        keepalive: true // Ensures request completes even if page is closing
      });

      if (!response.ok && retryCount < CONFIG.RETRY_ATTEMPTS) {
        // Retry on failure
        setTimeout(() => {
          sendTrackingData(endpoint, data, retryCount + 1);
        }, CONFIG.RETRY_DELAY * (retryCount + 1));
      }

      return response;
    } catch (error) {
      // Silently fail - don't break the website
      if (retryCount < CONFIG.RETRY_ATTEMPTS) {
        setTimeout(() => {
          sendTrackingData(endpoint, data, retryCount + 1);
        }, CONFIG.RETRY_DELAY * (retryCount + 1));
      }
      console.debug('Tracking error:', error.message);
    }
  }

  // ==================== TRACKING FUNCTIONS ====================

  /**
   * Track initial visitor
   */
  function trackVisitor() {
    const visitorId = getVisitorId();
    const utmParams = getUtmParams();
    const userIdentity = getUserIdentity();

    sendTrackingData('/track', {
      visitorId,
      page: window.location.href,
      referrer: document.referrer || undefined,
      utmParams,
      screenResolution: getScreenResolution(),
      ...userIdentity
    });
  }

  /**
   * Track session
   */
  function trackSession() {
    const visitorId = getVisitorId();
    const sessionId = getSessionId();

    sendTrackingData('/track/session', {
      visitorId,
      sessionId,
      entryPage: window.location.href,
      isActive: true
    });
  }

  /**
   * Track page view
   */
  function trackPageView() {
    const visitorId = getVisitorId();

    sendTrackingData('/track/pageview', {
      visitorId,
      url: window.location.href,
      title: document.title,
      path: window.location.pathname,
      referrer: document.referrer || undefined
    });
  }

  /**
   * Track custom event
   */
  function trackEvent(eventType, eventData = {}) {
    const visitorId = getVisitorId();

    sendTrackingData('/track/event', {
      visitorId,
      eventType,
      eventCategory: eventData.category || undefined,
      eventLabel: eventData.label || undefined,
      eventValue: eventData.value || undefined,
      page: window.location.href,
      element: eventData.element || undefined
    });
  }

  /**
   * Track form submission
   */
  function trackFormSubmission(formData) {
    const visitorId = getVisitorId();

    // Store user info in localStorage for future tracking
    if (formData.email) localStorage.setItem('userEmail', formData.email);
    if (formData.name) localStorage.setItem('userName', formData.name);
    if (formData.phone) localStorage.setItem('userPhone', formData.phone);
    if (formData.company) localStorage.setItem('userCompany', formData.company);

    sendTrackingData('/track/form', {
      visitorId,
      formType: formData.type || 'contact',
      formName: formData.formName || undefined,
      page: window.location.href,
      email: formData.email || undefined,
      name: formData.name || undefined,
      phone: formData.phone || undefined,
      company: formData.company || undefined,
      message: formData.message || undefined,
      customFields: formData.customFields || undefined
    });

    // Track visitor again to update identity
    trackVisitor();
  }

  // ==================== LIVE VISITOR TRACKING ====================

  let timeOnSite = 0;
  let pageViews = 0;
  let isActive = true;
  let lastActivityTime = Date.now();

  /**
   * Update live visitor status
   */
  function updateLiveVisitor() {
    const visitorId = getVisitorId();
    const userIdentity = getUserIdentity();

    // Check if user is still active (activity in last 30 seconds)
    const timeSinceLastActivity = Date.now() - lastActivityTime;
    isActive = timeSinceLastActivity < 30000;

    sendTrackingData('/live/update', {
      visitorId,
      currentPage: window.location.href,
      pageTitle: document.title,
      isActive,
      timeOnSite,
      pageViews,
      ...userIdentity
    });

    if (isActive) {
      timeOnSite += CONFIG.UPDATE_INTERVAL / 1000; // Convert to seconds
    }
  }

  /**
   * Reset activity timer
   */
  function recordActivity() {
    lastActivityTime = Date.now();
    isActive = true;
  }

  // ==================== ENGAGEMENT TRACKING ====================

  let maxScrollDepth = 0;
  let scrollMilestones = [25, 50, 75, 100];
  let trackedMilestones = new Set();

  /**
   * Track scroll depth
   */
  function trackScrollDepth() {
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    
    const scrollPercentage = Math.round(
      ((scrollTop + clientHeight) / scrollHeight) * 100
    );
    
    if (scrollPercentage > maxScrollDepth) {
      maxScrollDepth = Math.min(scrollPercentage, 100);
      
      // Track milestone scrolls
      scrollMilestones.forEach(milestone => {
        if (maxScrollDepth >= milestone && !trackedMilestones.has(milestone)) {
          trackedMilestones.add(milestone);
          trackEvent('scroll', {
            category: 'engagement',
            label: `${milestone}% scrolled`,
            value: milestone.toString()
          });
        }
      });
    }

    recordActivity();
  }

  /**
   * Track clicks on elements
   */
  function setupClickTracking() {
    document.addEventListener('click', (e) => {
      const target = e.target;
      
      // Track button clicks
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        const button = target.tagName === 'BUTTON' ? target : target.closest('button');
        trackEvent('click', {
          category: 'button',
          label: button.textContent?.trim() || button.getAttribute('aria-label') || 'Button',
          element: button.className
        });
      }
      
      // Track link clicks
      else if (target.tagName === 'A' || target.closest('a')) {
        const link = target.tagName === 'A' ? target : target.closest('a');
        trackEvent('click', {
          category: 'link',
          label: link.textContent?.trim() || link.getAttribute('aria-label') || 'Link',
          element: link.href
        });
      }

      recordActivity();
    }, true); // Use capture phase
  }

  /**
   * Track keyboard activity
   */
  function setupKeyboardTracking() {
    let typingTimeout;
    document.addEventListener('keydown', () => {
      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => {
        recordActivity();
      }, 500);
    });
  }

  /**
   * Track mouse movement
   */
  function setupMouseTracking() {
    let mouseTimeout;
    document.addEventListener('mousemove', () => {
      clearTimeout(mouseTimeout);
      mouseTimeout = setTimeout(() => {
        recordActivity();
      }, 500);
    });
  }

  // ==================== PAGE LIFECYCLE ====================

  let pageStartTime = Date.now();

  /**
   * Track time spent on page
   */
  function trackTimeOnPage() {
    const timeSpent = Math.round((Date.now() - pageStartTime) / 1000);
    
    sendTrackingData('/track/pageview', {
      visitorId: getVisitorId(),
      url: window.location.href,
      title: document.title,
      path: window.location.pathname,
      timeOnPage: timeSpent,
      scrollDepth: maxScrollDepth
    });
  }

  /**
   * Handle page visibility changes
   */
  function setupVisibilityTracking() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        trackEvent('visibility', {
          category: 'engagement',
          label: 'page_hidden'
        });
        isActive = false;
      } else {
        trackEvent('visibility', {
          category: 'engagement',
          label: 'page_visible'
        });
        recordActivity();
        pageStartTime = Date.now(); // Reset page start time
      }
    });
  }

  /**
   * Handle page unload
   */
  function setupUnloadTracking() {
    // Modern browsers prefer 'visibilitychange' over 'beforeunload'
    window.addEventListener('beforeunload', () => {
      trackTimeOnPage();
      
      // Mark session as ended
      sendTrackingData('/track/session', {
        visitorId: getVisitorId(),
        sessionId: getSessionId(),
        exitPage: window.location.href,
        isActive: false,
        endTime: new Date().toISOString()
      });
    });

    // Fallback for page navigation
    window.addEventListener('pagehide', trackTimeOnPage);
  }

  // ==================== SPA SUPPORT ====================

  /**
   * Track route changes in Single Page Applications
   */
  function setupSPATracking() {
    let lastUrl = window.location.href;

    // Listen for history changes
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      originalPushState.apply(this, args);
      handleRouteChange();
    };

    history.replaceState = function(...args) {
      originalReplaceState.apply(this, args);
      handleRouteChange();
    };

    window.addEventListener('popstate', handleRouteChange);

    function handleRouteChange() {
      const currentUrl = window.location.href;
      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        
        // Track time on previous page
        trackTimeOnPage();
        
        // Reset tracking for new page
        pageStartTime = Date.now();
        maxScrollDepth = 0;
        trackedMilestones.clear();
        pageViews++;
        
        // Track new page view
        trackPageView();
      }
    }
  }

  // ==================== INITIALIZATION ====================

  /**
   * Initialize tracking
   */
  function init() {
    try {
      // Initial tracking
      trackVisitor();
      trackSession();
      trackPageView();
      pageViews++;

      // Setup event tracking
      setupClickTracking();
      setupKeyboardTracking();
      setupMouseTracking();
      setupVisibilityTracking();
      setupUnloadTracking();
      setupSPATracking();
      
      // Track scroll depth
      let scrollTimeout;
      window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(trackScrollDepth, CONFIG.SCROLL_DEBOUNCE);
      }, { passive: true });

      // Update live visitor status periodically
      setInterval(updateLiveVisitor, CONFIG.UPDATE_INTERVAL);

      console.log('✅ Visitor Tracking initialized');
    } catch (error) {
      console.error('❌ Visitor Tracking initialization failed:', error);
    }
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ==================== PUBLIC API ====================

  /**
   * Expose tracking functions globally
   */
  window.VisitorTracking = {
    trackEvent,
    trackFormSubmission,
    trackPageView: () => {
      pageViews++;
      trackPageView();
    },
    getVisitorId,
    getSessionId,
    identify: (userData) => {
      if (userData.email) localStorage.setItem('userEmail', userData.email);
      if (userData.name) localStorage.setItem('userName', userData.name);
      if (userData.phone) localStorage.setItem('userPhone', userData.phone);
      if (userData.company) localStorage.setItem('userCompany', userData.company);
      trackVisitor(); // Update visitor with new identity
    },
    reset: () => {
      localStorage.removeItem('visitorId');
      sessionStorage.removeItem('sessionId');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      localStorage.removeItem('userPhone');
      localStorage.removeItem('userCompany');
    }
  };

})();

// ============================================
// USAGE EXAMPLES:
// ============================================

// 1. Track custom events:
// window.VisitorTracking.trackEvent('video_play', {
//   category: 'video',
//   label: 'Homepage Video',
//   value: 'intro-video'
// });

// 2. Track form submissions:
// window.VisitorTracking.trackFormSubmission({
//   type: 'contact',
//   formName: 'Contact Form',
//   email: 'user@example.com',
//   name: 'John Doe',
//   phone: '+1234567890',
//   company: 'Acme Corp',
//   message: 'Hello!'
// });

// 3. Track custom page views (for SPAs):
// window.VisitorTracking.trackPageView();

// 4. Identify a user:
// window.VisitorTracking.identify({
//   email: 'user@example.com',
//   name: 'John Doe',
//   phone: '+1234567890',
//   company: 'Acme Corp'
// });

// 5. Reset visitor data (useful for logout):
// window.VisitorTracking.reset();