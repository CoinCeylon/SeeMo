import { Cpu, Zap } from "lucide-react";
import Image from "next/image";

export default function ContentSection2() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <h2 className="relative z-10 max-w-xl text-4xl font-medium lg:text-5xl">
          The Cardano ecosystem brings trust to every transaction.
        </h2>
        <div className="relative">
          <div className="relative z-10 space-y-4 md:w-1/2">
            <p className="text-body">
              Cardano is more than just a blockchain.{" "}
              <span className="text-title font-medium">
                It powers a secure, scalable ecosystem 
              </span>{" "}
              — from product verification to financial inclusion.
            </p>
            <p>
              It supports a full-stack ecosystem — from traceable supply chains 
              to smart contracts and decentralized applications, empowering businesses and individuals worldwide.


            </p>

            <div className="grid grid-cols-2 gap-3 pt-6 sm:gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Zap className="size-4" />
                  <h3 className="text-sm font-medium">Reliable</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Blockchain-based authenticity you can trust—fast, secure, and transparent.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Cpu className="size-4" />
                  <h3 className="text-sm font-medium">Scalable</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Built on peer-reviewed research, Cardano is designed to grow with your business.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-12 h-fit md:absolute md:-inset-y-12 md:inset-x-0 md:mt-0">
            <div
              aria-hidden
              className="bg-linear-to-l z-1 to-background absolute inset-0 hidden from-transparent to-55% md:block"
            ></div>
            <div className="border-border/50 relative rounded-2xl border border-dotted p-2">
              <Image
                src="/charts.png"
                className="hidden rounded-[12px] dark:block"
                alt="payments illustration dark"
                width={1207}
                height={450}
              />
              <Image
                src="/charts-light.png"
                className="rounded-[12px] shadow dark:hidden"
                alt="payments illustration light"
                width={1207}
                height={450}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
