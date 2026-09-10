export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface PerformanceData {
  impressions: number;
  clicks: number;
  ctr: number;
  averagePosition: number;
  conversions: number;
  revenue: number;
}

export interface ContentPerformanceRepository {
  getContentPerformance(contentId: string, dateRange: DateRange): Promise<PerformanceData>;
}

// Example Mock implementation (to be replaced by real Google Search Console API later)
export class MockPerformanceAdapter implements ContentPerformanceRepository {
  async getContentPerformance(contentId: string, dateRange: DateRange): Promise<PerformanceData> {
    return {
      impressions: 1240,
      clicks: 145,
      ctr: 11.6,
      averagePosition: 4.2,
      conversions: 12,
      revenue: 1200
    };
  }
}

export const performanceRepository: ContentPerformanceRepository = new MockPerformanceAdapter();
