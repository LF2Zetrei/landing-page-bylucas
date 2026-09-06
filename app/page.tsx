import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import ParallelogramsSketch from "@/components/ParallelogramsSketch";
import MetaballBackground from "@/components/MetaBallBackground";
import GridBackground from "@/components/GridBackground";
import { MonitoringStatus } from "@/components/MonitoringStatus";

export default function Home() {

  return (
    <div className="grid flex-1 min-h-0 grid-cols-2 grid-rows-1 gap-6 w-full bg-gray-800 p-6">
      <FadeIn direction="up" className="p-4">
        <ParallelogramsSketch width="100%" height="100%" strokeCount={1} angle={2} strokeColor="black" contentPosition="below">
            <MetaballBackground
                speed={0.5}
                bgColor="0.93, 0.91, 0.90"
                gradientColor="0.78, 0.76, 0.80"
            >
                <div className="h-full w-full flex items-center justify-center">
                  <Link
                    href="https://portfolio.bylucas.eu"
                    className="font-(family-name:--font-baloo) text-7xl font-bold text-black inline-block hover:scale-110 transition-transform"
                  >
                    My Portfolio
                  </Link>
                </div>
            </MetaballBackground>
        </ParallelogramsSketch>
      </FadeIn>

      <FadeIn direction="down" delay={120} className="p-4">
        <ParallelogramsSketch width="100%" height="100%" strokeCount={1} angle={2} strokeColor="black" contentPosition="below">
            <GridBackground
                bgColor="#ede8e5"
                lineColor="rgba(0, 0, 0, 0.08)"
                spacing={36}
                lineOpacity={1}
            >
                <div className="h-full w-full flex items-center justify-center gap-6">
                    <Link
                      href="https://portfolio.bylucas.eu"
                      className="font-(family-name:--font-baloo) text-7xl font-bold text-black inline-block hover:scale-110 transition-transform"
                    >
                      Monitoring
                    </Link>
                    <div className="-translate-y-6">
                      <MonitoringStatus />
                    </div>
                </div>
            </GridBackground>
        </ParallelogramsSketch>
      </FadeIn>
    </div>
  );
}