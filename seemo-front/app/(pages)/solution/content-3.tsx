import Image from "next/image";

export default function ContentSection3() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <h2 className="relative z-10 max-w-xl text-4xl font-medium lg:text-5xl">
          Shop Smarter and Safer with Blockchain Transparency
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
          <div className="relative mb-6 sm:mb-0">
            <div className="bg-linear-to-b aspect-76/59 relative rounded-2xl from-zinc-300 to-transparent p-px dark:from-zinc-700">
              <Image
                src="/people-8149872_1280.jpg"
                className="hidden rounded-[15px] dark:block"
                alt="payments illustration dark"
                width={1207}
                height={929}
              />
              <Image
                src="/people-8149872_1280.jpg"
                className="rounded-[15px] shadow dark:hidden"
                alt="payments illustration light"
                width={1207}
                height={929}
              />
            </div>
          </div>

          <div className="relative space-y-4">
            <p className="text-muted-foreground">
              As a customer, you deserve to know the truth behind every product you purchase. 
              Our verification platform, powered by the Cardano blockchain, 
              gives you that power—instantly. With just a scan, you can {" "}
              <span className="text-accent-foreground font-bold">
                trace the origin, authenticity, and full journey of any product.
              </span>{" "}
              Say goodbye to counterfeits and false claims. Experience peace of mind, 
              transparency, and ethical buying—because trust should never be a guessing game.


            </p>
            {/* <p className="text-muted-foreground">
              When you know the story behind what you buy, 
              trust becomes part of the product.
            </p> */}

            <div className="pt-6">
              <blockquote className="border-l-4 pl-4">
                <p>
                  Without trust, there is no value. Blockchain restores that trust.
                </p>

                <div className="mt-6 space-y-3">
                  <cite className="block font-medium">Charles Hoskinson, Founder of Cardano</cite>
                  {/* <img
                    className="h-5 w-fit dark:invert"
                    src="https://html.tailus.io/blocks/customers/nvidia.svg"
                    alt="Nvidia Logo"
                    height="20"
                    width="auto"
                  /> */}
                </div>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
