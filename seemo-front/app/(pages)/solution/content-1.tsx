import Image from "next/image";

export default function ContentSection1() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <h2 className="relative z-10 max-w-xl text-4xl font-medium lg:text-5xl">
          EARN your customers' trust FOREVER
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
          <div className="relative mb-6 sm:mb-0">
            <div className="bg-linear-to-b aspect-76/59 relative rounded-2xl from-zinc-300 to-transparent p-px dark:from-zinc-700">
              <Image
                src="/ai-generated-8701393_1280.png"
                className="hidden rounded-[15px] dark:block"
                alt="payments illustration dark"
                width={1207}
                height={929}
              />
              <Image
                src="/payments-light.png"
                className="rounded-[15px] shadow dark:hidden"
                alt="payments illustration light"
                width={1207}
                height={929}
              />
            </div>
          </div>

          <div className="relative space-y-4">
            <p className="text-muted-foreground">
              In today's market, transparency isn’t just a value—it’s a competitive edge. Our product verification platform, built on the secure and sustainable Cardano blockchain,allows your company to {" "}
              <span className="text-accent-foreground font-bold">
                prove product authenticity, track supply chains in real-time, and build lasting trust with customers.
              </span>{/* {" "}
              — from products innovate. */}
            </p>
            <p className="text-muted-foreground">
              By offering verifiable data at every stage, you protect your brand, fight counterfeits, and meet rising consumer demands for accountability. It's more than innovation—it's future-ready integrity.
            </p>

            <div className="pt-6">
              <blockquote className="border-l-4 pl-4">
                <p>
                  Making the world work better for all.
                </p>

                <div className="mt-6 space-y-3">
                  <cite className="block font-medium">CARDANO</cite>
                  <img
                    className="h-5 w-fit dark:invert"
                    src="https://user-images.githubusercontent.com/31596855/34464591-2b975084-ee54-11e7-8ce3-6be97ac66183.png"
                    alt="cardano logo"
                    height="20"
                    width="auto"
                  />
                </div>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
