import type { Metadata } from "next";
import ContentSection2 from "@/app/(pages)/solution/content-2";
import ContentSection1 from "@/app/(pages)/solution/content-1";
import ContentSection3 from "@/app/(pages)/solution/content-3";
import { AnimatedGroup } from "@/components/ui/animated-group";

export const metadata: Metadata = {
  title: "VerifyProduct",
  description: "Verify Product",
};
const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring" as "spring",
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};
export default function VerifyProduct() {
  return (
    <>
      <div className="pt-8">
        <AnimatedGroup
          variants={{
            container: {
              visible: {
                transition: {
                  staggerChildren: 0.05,
                  delayChildren: 0.75,
                },
              },
            },
            ...transitionVariants,
          }}
          className="mt-12"
        >
          {" "}
          <ContentSection1 />
          <ContentSection3 />
          <ContentSection2 />
        </AnimatedGroup>
      </div>
    </>
  );
}
