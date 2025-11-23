// services/visitorTracking.service.ts

import { PrismaClient, VisitorType, VisitorStatus } from '@prisma/client';
import UAParser from 'ua-parser-js';
import geoip from 'geoip-lite';

const prisma = new PrismaClient();

interface TrackVisitorData {
  visitorId: string;
  ipAddress: string;
  userAgent: string;
  referrer?: string;
  utmParams?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
  page: string;
  email?: string;
  name?: string;
  phone?: string;
  company?: string;
  position?: string;
  screenResolution?: string;
}

interface TrackSessionData {
  visitorId: string;
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  entryPage: string;
  exitPage?: string;
  endTime?: Date;
  isActive?: boolean;
}

interface TrackPageViewData {
  visitorId: string;
  url: string;
  title?: string;
  path: string;
  referrer?: string;
  timeOnPage?: number;
  scrollDepth?: number;
  clicks?: number;
}

interface TrackEventData {
  visitorId: string;
  eventType: string;
  eventCategory?: string;
  eventLabel?: string;
  eventValue?: string;
  page: string;
  element?: string;
}

interface TrackFormSubmissionData {
  visitorId: string;
  formType: string;
  formName?: string;
  page: string;
  email?: string;
  name?: string;
  phone?: string;
  company?: string;
  message?: string;
  customFields?: any;
}

interface UpdateLiveVisitorData {
  visitorId: string;
  currentPage: string;
  pageTitle?: string;
  isActive: boolean;
  email?: string;
  name?: string;
  ipAddress: string;
  userAgent: string;
  timeOnSite?: number;
  pageViews?: number;
}

interface VisitorFilters {
  type?: VisitorType;
  status?: VisitorStatus;
  email?: string;
  country?: string;
}

class VisitorTrackingService {
  // Create or update visitor
  async trackVisitor(data: TrackVisitorData) {
    try {
      const {
        visitorId,
        ipAddress,
        userAgent,
        referrer,
        utmParams,
        page,
        email,
        name,
        phone,
        company,
        position,
        screenResolution
      } = data;

      // Parse user agent for device info
      const parser = new UAParser(userAgent);
      const deviceInfo = parser.getResult();

      // Get geo location from IP
      const geo = geoip.lookup(ipAddress);

      // Check if visitor exists
      let visitor = await prisma.visitor.findUnique({
        where: { visitorId }
      });

      if (visitor) {
        // Update existing visitor
        visitor = await prisma.visitor.update({
          where: { visitorId },
          data: {
            lastVisit: new Date(),
            totalVisits: { increment: 1 },
            totalPageViews: { increment: 1 },
            ipAddress,
            country: geo?.country || visitor.country,
            city: geo?.city || visitor.city,
            region: geo?.region || visitor.region,
            timezone: geo?.timezone || visitor.timezone,
            device: deviceInfo.device.type || 'Desktop',
            os: `${deviceInfo.os.name || 'Unknown'} ${deviceInfo.os.version || ''}`.trim(),
            browser: deviceInfo.browser.name || 'Unknown',
            browserVersion: deviceInfo.browser.version || undefined,
            userAgent,
            ...(email && { email, type: 'IDENTIFIED' as VisitorType }),
            ...(name && { name }),
            ...(phone && { phone }),
            ...(company && { company }),
            ...(position && { position }),
            pagesVisited: {
              push: page
            }
          }
        });
      } else {
        // Create new visitor
        visitor = await prisma.visitor.create({
          data: {
            visitorId,
            ipAddress,
            country: geo?.country || null,
            city: geo?.city || null,
            region: geo?.region || null,
            timezone: geo?.timezone || null,
            device: deviceInfo.device.type || 'Desktop',
            os: `${deviceInfo.os.name || 'Unknown'} ${deviceInfo.os.version || ''}`.trim(),
            browser: deviceInfo.browser.name || 'Unknown',
            browserVersion: deviceInfo.browser.version || undefined,
            screenResolution: screenResolution || undefined,
            userAgent,
            referrer: referrer || undefined,
            utmSource: utmParams?.source || undefined,
            utmMedium: utmParams?.medium || undefined,
            utmCampaign: utmParams?.campaign || undefined,
            utmTerm: utmParams?.term || undefined,
            utmContent: utmParams?.content || undefined,
            email: email || undefined,
            name: name || undefined,
            phone: phone || undefined,
            company: company || undefined,
            position: position || undefined,
            type: email ? 'IDENTIFIED' : 'ANONYMOUS',
            pagesVisited: [page]
          }
        });
      }

      return visitor;
    } catch (error) {
      console.error('Error tracking visitor:', error);
      throw error;
    }
  }

  // Create or update visitor session
  async trackSession(data: TrackSessionData) {
    try {
      const {
        visitorId,
        sessionId,
        ipAddress,
        userAgent,
        entryPage,
        exitPage,
        endTime,
        isActive = true
      } = data;

      // Parse device info
      const parser = new UAParser(userAgent);
      const deviceInfo = parser.getResult();

      // Check if session exists
      let session = await prisma.visitorSession.findUnique({
        where: { sessionId }
      });

      if (session) {
        // Update existing session
        session = await prisma.visitorSession.update({
          where: { sessionId },
          data: {
            isActive,
            pageViews: { increment: 1 },
            ...(exitPage && { exitPage }),
            ...(endTime && { 
              endTime,
              duration: Math.floor((new Date(endTime).getTime() - new Date(session.startTime).getTime()) / 1000)
            })
          }
        });
      } else {
        // Create new session
        session = await prisma.visitorSession.create({
          data: {
            visitorId,
            sessionId,
            entryPage,
            ipAddress,
            device: deviceInfo.device.type || 'Desktop',
            browser: deviceInfo.browser.name || 'Unknown',
            os: `${deviceInfo.os.name || 'Unknown'} ${deviceInfo.os.version || ''}`.trim(),
            isActive
          }
        });
      }

      return session;
    } catch (error) {
      console.error('Error tracking session:', error);
      throw error;
    }
  }

  // Track page view
  async trackPageView(data: TrackPageViewData) {
    try {
      const {
        visitorId,
        url,
        title,
        path,
        referrer,
        timeOnPage,
        scrollDepth,
        clicks
      } = data;

      const pageView = await prisma.pageView.create({
        data: {
          visitorId,
          url,
          title: title || undefined,
          path,
          referrer: referrer || undefined,
          timeOnPage: timeOnPage || undefined,
          scrollDepth: scrollDepth || undefined,
          clicks: clicks || 0
        }
      });

      return pageView;
    } catch (error) {
      console.error('Error tracking page view:', error);
      throw error;
    }
  }

  // Track visitor event
  async trackEvent(data: TrackEventData) {
    try {
      const {
        visitorId,
        eventType,
        eventCategory,
        eventLabel,
        eventValue,
        page,
        element
      } = data;

      const event = await prisma.visitorEvent.create({
        data: {
          visitorId,
          eventType,
          eventCategory: eventCategory || undefined,
          eventLabel: eventLabel || undefined,
          eventValue: eventValue || undefined,
          page,
          element: element || undefined
        }
      });

      return event;
    } catch (error) {
      console.error('Error tracking event:', error);
      throw error;
    }
  }

  // Track form submission
  async trackFormSubmission(data: TrackFormSubmissionData) {
    try {
      const {
        visitorId,
        formType,
        formName,
        page,
        email,
        name,
        phone,
        company,
        message,
        customFields
      } = data;

      const submission = await prisma.formSubmission.create({
        data: {
          visitorId,
          formType,
          formName: formName || undefined,
          page,
          email: email || undefined,
          name: name || undefined,
          phone: phone || undefined,
          company: company || undefined,
          message: message || undefined,
          customFields: customFields || undefined
        }
      });

      // Update visitor to LEAD if they submitted a form
      if (email) {
        await prisma.visitor.update({
          where: { visitorId },
          data: {
            email,
            name: name || undefined,
            phone: phone || undefined,
            company: company || undefined,
            type: 'LEAD',
            leadScore: { increment: 10 }
          }
        });
      }

      return submission;
    } catch (error) {
      console.error('Error tracking form submission:', error);
      throw error;
    }
  }

  // Update live visitor status
  async updateLiveVisitor(data: UpdateLiveVisitorData) {
    try {
      const {
        visitorId,
        currentPage,
        pageTitle,
        isActive,
        email,
        name,
        ipAddress,
        userAgent,
        timeOnSite,
        pageViews
      } = data;

      // Parse device info
      const parser = new UAParser(userAgent);
      const deviceInfo = parser.getResult();
      const geo = geoip.lookup(ipAddress);

      const liveVisitor = await prisma.liveVisitor.upsert({
        where: { visitorId },
        update: {
          currentPage,
          pageTitle: pageTitle || undefined,
          isActive,
          lastActivityAt: new Date(),
          timeOnSite: timeOnSite !== undefined ? timeOnSite : { increment: 5 },
          pageViews: pageViews !== undefined ? pageViews : { increment: 1 },
          email: email || undefined,
          name: name || undefined
        },
        create: {
          visitorId,
          currentPage,
          pageTitle: pageTitle || undefined,
          isActive,
          email: email || undefined,
          name: name || undefined,
          ipAddress,
          country: geo?.country || undefined,
          city: geo?.city || undefined,
          device: deviceInfo.device.type || 'Desktop',
          browser: deviceInfo.browser.name || 'Unknown',
          timeOnSite: timeOnSite || 0,
          pageViews: pageViews || 1
        }
      });

      return liveVisitor;
    } catch (error) {
      console.error('Error updating live visitor:', error);
      throw error;
    }
  }

  // Get all live visitors
  async getLiveVisitors() {
    try {
      // Get visitors active in last 5 minutes
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

      const liveVisitors = await prisma.liveVisitor.findMany({
        where: {
          lastActivityAt: {
            gte: fiveMinutesAgo
          },
          isActive: true
        },
        orderBy: {
          lastActivityAt: 'desc'
        }
      });

      return liveVisitors;
    } catch (error) {
      console.error('Error getting live visitors:', error);
      throw error;
    }
  }

  // Get visitor details by ID
  async getVisitorById(visitorId: string) {
    try {
      const visitor = await prisma.visitor.findUnique({
        where: { visitorId },
        include: {
          sessions: {
            orderBy: { startTime: 'desc' },
            take: 10
          },
          pageViews: {
            orderBy: { timestamp: 'desc' },
            take: 20
          },
          events: {
            orderBy: { timestamp: 'desc' },
            take: 50
          },
          forms: {
            orderBy: { submittedAt: 'desc' }
          }
        }
      });

      return visitor;
    } catch (error) {
      console.error('Error getting visitor:', error);
      throw error;
    }
  }

  // Get all visitors with pagination
  async getAllVisitors(page: number = 1, limit: number = 20, filters: VisitorFilters = {}) {
    try {
      const skip = (page - 1) * limit;

      const where: any = {};
      if (filters.type) where.type = filters.type;
      if (filters.status) where.status = filters.status;
      if (filters.email) where.email = { contains: filters.email, mode: 'insensitive' };
      if (filters.country) where.country = filters.country;

      const [visitors, total] = await Promise.all([
        prisma.visitor.findMany({
          where,
          skip,
          take: limit,
          orderBy: { lastVisit: 'desc' },
          include: {
            _count: {
              select: {
                sessions: true,
                pageViews: true,
                events: true,
                forms: true
              }
            }
          }
        }),
        prisma.visitor.count({ where })
      ]);

      return {
        visitors,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page
      };
    } catch (error) {
      console.error('Error getting all visitors:', error);
      throw error;
    }
  }

  // Get visitor analytics
  async getVisitorAnalytics(startDate: Date, endDate: Date) {
    try {
      const visitors = await prisma.visitor.findMany({
        where: {
          firstVisit: {
            gte: startDate,
            lte: endDate
          }
        }
      });

      const sessions = await prisma.visitorSession.findMany({
        where: {
          startTime: {
            gte: startDate,
            lte: endDate
          }
        }
      });

      const pageViews = await prisma.pageView.findMany({
        where: {
          timestamp: {
            gte: startDate,
            lte: endDate
          }
        }
      });

      const forms = await prisma.formSubmission.findMany({
        where: {
          submittedAt: {
            gte: startDate,
            lte: endDate
          }
        }
      });

      // Calculate metrics
      const totalVisitors = visitors.length;
      const newVisitors = visitors.filter(v => v.totalVisits === 1).length;
      const returningVisitors = totalVisitors - newVisitors;
      const totalPageViews = pageViews.length;
      const avgTimeOnSite = sessions.reduce((acc, s) => acc + (s.duration || 0), 0) / sessions.length || 0;

      // Top pages
      const pageCount: Record<string, number> = {};
      pageViews.forEach(pv => {
        pageCount[pv.path] = (pageCount[pv.path] || 0) + 1;
      });
      const topPages = Object.entries(pageCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([path, count]) => ({ path, views: count }));

      // Top countries
      const countryCount: Record<string, number> = {};
      visitors.forEach(v => {
        if (v.country) {
          countryCount[v.country] = (countryCount[v.country] || 0) + 1;
        }
      });
      const topCountries = Object.entries(countryCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([country, count]) => ({ country, visitors: count }));

      // Top devices
      const deviceCount: Record<string, number> = {};
      visitors.forEach(v => {
        if (v.device) {
          deviceCount[v.device] = (deviceCount[v.device] || 0) + 1;
        }
      });
      const topDevices = Object.entries(deviceCount)
        .map(([device, count]) => ({ device, visitors: count }));

      return {
        totalVisitors,
        newVisitors,
        returningVisitors,
        totalPageViews,
        avgTimeOnSite: Math.round(avgTimeOnSite),
        formSubmissions: forms.length,
        leadsGenerated: forms.filter(f => f.email).length,
        topPages,
        topCountries,
        topDevices
      };
    } catch (error) {
      console.error('Error getting visitor analytics:', error);
      throw error;
    }
  }

  // Clean up old live visitor records
  async cleanupLiveVisitors() {
    try {
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

      await prisma.liveVisitor.updateMany({
        where: {
          lastActivityAt: {
            lt: tenMinutesAgo
          }
        },
        data: {
          isActive: false
        }
      });

      // Delete very old records (older than 1 day)
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      await prisma.liveVisitor.deleteMany({
        where: {
          lastActivityAt: {
            lt: oneDayAgo
          }
        }
      });
    } catch (error) {
      console.error('Error cleaning up live visitors:', error);
    }
  }

  // Update visitor status (ACTIVE, IDLE, LEFT)
  async updateVisitorStatus(visitorId: string, status: VisitorStatus) {
    try {
      await prisma.visitor.update({
        where: { visitorId },
        data: { status }
      });
    } catch (error) {
      console.error('Error updating visitor status:', error);
      throw error;
    }
  }
}

export default new VisitorTrackingService();