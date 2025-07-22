import "../styles.css";
import type { AppProps, NextWebVitalsMetric } from "next/app";
import { Theme } from "@twilio-paste/core/theme";

import { AnalyticsProvider } from "../components/Analytics";

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <AnalyticsProvider writeKey={process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY}>
      <Theme.Provider theme="dark">
        <Component {...pageProps} />
      </Theme.Provider>
    </AnalyticsProvider>
  );
};

export function reportWebVitals(metric: NextWebVitalsMetric): void {
  // console.log(metric);
}

export default App;
