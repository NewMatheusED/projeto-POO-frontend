import { loadAll } from "@tsparticles/all";
import type { ISourceOptions } from "@tsparticles/engine";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useEffect, useMemo, useState } from "react";
import Logo from "~/src/components/Logo";

type TPageType = "login" | "registro";

export default function PageLayout({
  children,
  pageType = "login",
}: {
  children: React.ReactNode;
  pageType?: TPageType;
}) {
  const [init, setInit] = useState(false);
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadAll(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);
  const particlesLoaded = async (): Promise<void> => {};
  const options: ISourceOptions = useMemo(
    () => ({
      particles: {
        number: {
          value: 160,
          density: {
            enable: true,
            valueArea: 800,
          },
        },
        color: {
          value: "#ffffff",
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#000000",
          },
          polygon: {
            nb_sides: 5,
          },
          image: {
            src: "img/github.svg",
            width: 100,
            height: 100,
          },
        },
        opacity: {
          value: 0.8,
          ramdom: true,
          animation: {
            mode: "random",
            enable: true,
            startValue: "min",
            decay: 0,
            speed: 0.5,
          },
        },
        size: {
          value: 3,
          animation: {
            mode: "random",
            enable: true,
            startValue: "min",
            decay: 0,
            speed: 0.5,
          },
        },
        lineLinked: {
          enable: false,
          distance: 150,
          color: "#ffffff",
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1,
          direction: "none",
          random: true,
          straight: false,
          outModes: "out",
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 600,
          },
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onHover: {
            enable: true,
            mode: "bubble",
          },
          onclick: {
            enable: true,
            mode: "repulse",
          },
          resize: {
            delay: 0,
            enable: true,
          },
        },
        modes: {
          grab: {
            distance: 400,
            lineLinked: {
              opacity: 1,
            },
          },
          bubble: {
            distance: 250,
            size: 0,
            duration: 2,
            opacity: 0,
            speed: 3,
          },
          repulse: {
            distance: 400,
            duration: 0.4,
          },
          push: {
            particles_nb: 4,
          },
          remove: {
            particlesNb: 2,
          },
        },
      },
      retina_detect: true,
    }),
    []
  );
  return (
    <>
      <main className="flex min-h-full bg-ai-dark-blue">
        <data className="absolute top-2 left-2 w-30 h-30 z-10">
          <Logo
            size="lg"
          />
        </data>
        <div
          className={`w-full min-h-full z-50 ${pageType == "login" ? "flex items-center justify-center" : ""}`}
        >
          {children}
        </div>
      </main>
      {init && (
        <Particles options={options} particlesLoaded={particlesLoaded} />
      )}
    </>
  );
}
