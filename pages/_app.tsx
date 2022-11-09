import "../styles.css";
import type { AppProps, NextWebVitalsMetric } from "next/app";
import { CustomizationProvider } from "@twilio-paste/core/customization";
import { AnalyticsProvider } from "../components/Analytics";

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <AnalyticsProvider writeKey={process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY}>
      <CustomizationProvider
        baseTheme="default"
        theme={{
          fonts: {},
          textColors: {},
        }}
      >
        <Component {...pageProps} />
      </CustomizationProvider>
    </AnalyticsProvider>
  );
};

export function reportWebVitals(metric: NextWebVitalsMetric): void {
  // console.log(metric);
}

export default App;
