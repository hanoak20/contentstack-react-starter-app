import { AnalyticsBrowser } from "@segment/analytics-next";

export const analytics = AnalyticsBrowser.load({
  writeKey: process.env.REACT_APP_SEGMENT_API_KEY ?? "",
});
